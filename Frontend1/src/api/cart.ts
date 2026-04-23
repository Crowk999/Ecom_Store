export const API_URL = "http://127.0.0.1:8000/api/carts/";

export const fetchCart = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(API_URL, {
        headers: {
            "Authorization": token ? `Token ${token}` : ""
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch cart");
    }
    return response.json();
};

export const addToCart = async (productId: number, quantity: number = 1) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Token ${token}` : ""
        },
        body: JSON.stringify({ product_id: productId, quantity }),
    });
    if (!response.ok) {
        throw new Error("Failed to add to cart");
    }
    return response.json();
};

export const removeFromCart = async (itemId: number) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}remove`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Token ${token}` : ""
        },
        body: JSON.stringify({ item_id: itemId }),
    });
    if (!response.ok) {
        throw new Error("Failed to remove from cart");
    }
    return response.json();
};

export const updateCartQuantity = async (itemId: number, action: "increase" | "decrease") => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}update`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Token ${token}` : ""
        },
        body: JSON.stringify({ item_id: itemId, action }),
    });
    if (!response.ok) {
        throw new Error("Failed to update cart quantity");
    }
    return response.json();
};
