export const API_URL = "http://127.0.0.1:8000/api/";

export interface OrderData {
    email: string;
    phone: string;
    full_name: string;
    address: string;
    city: string;
    state?: string;
    country?: string;
    zip_code: string;
    payment_method: string;
    order_notes?: string;
}

export const createOrder = async (orderData: OrderData) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}orders/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        },
        body: JSON.stringify(orderData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create order");
    }

    return response.json();
};
