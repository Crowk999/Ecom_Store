import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { fetchCart } from "../api/cart";

interface CartData {
    items: any[];
    total: number;
}

interface CartContextType {
    cart: CartData | null;
    refreshCart: () => Promise<void>;
    loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartData | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshCart = async () => {
        try {
            const data = await fetchCart();
            setCart(data);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshCart();
    }, []);

    return (
        <CartContext.Provider value={{ cart, refreshCart, loading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
