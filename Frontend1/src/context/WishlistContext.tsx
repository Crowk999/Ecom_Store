import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type WishlistContextType = {
    wishlist: number[];
    addToWishlist: (productId: number) => Promise<void>;
    removeFromWishlist: (productId: number) => Promise<void>;
    toggleWishlist: (productId: number) => Promise<void>;
    isInWishlist: (productId: number) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<number[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWishlist = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setWishlist([]);
                return;
            }

            try {
                const response = await fetch("http://127.0.0.1:8000/api/wishlist/", {
                    headers: {
                        "Authorization": `Token ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setWishlist(data);
                }
            } catch (error) {
                console.error("Failed to fetch wishlist", error);
            }
        };

        fetchWishlist();
    }, [localStorage.getItem("token")]); // Re-fetch when token changes (login/logout behavior might need explicit trigger but this helps)

    const toggleWishlist = async (productId: number) => {
        const token = localStorage.getItem("token");
        if (!token) {
            if (confirm("Please login to use the wishlist!")) {
                navigate("/login");
            }
            return;
        }

        // Optimistic update
        const isLiked = wishlist.includes(productId);
        setWishlist(prev => isLiked ? prev.filter(id => id !== productId) : [...prev, productId]);

        try {
            await fetch("http://127.0.0.1:8000/api/wishlist/toggle", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                },
                body: JSON.stringify({ product_id: productId })
            });
            // Ideally check response success, but optimistic update makes UI snappy
        } catch (error) {
            console.error("Failed to toggle wishlist", error);
            // Revert on error
            setWishlist(prev => isLiked ? [...prev, productId] : prev.filter(id => id !== productId));
        }
    };

    const addToWishlist = async (productId: number) => {
        if (!wishlist.includes(productId)) await toggleWishlist(productId);
    };

    const removeFromWishlist = async (productId: number) => {
        if (wishlist.includes(productId)) await toggleWishlist(productId);
    };

    const isInWishlist = (productId: number) => wishlist.includes(productId);

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};
