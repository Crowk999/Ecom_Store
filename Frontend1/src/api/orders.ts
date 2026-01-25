export const API_URL = "http://127.0.0.1:8000/api/";

export interface OrderItem {
    id: number;
    product: number;
    product_name: string;
    product_image: string;
    quantity: number;
    price: string;
}

export interface Order {
    id: number;
    user: number;
    total_amount: string;
    full_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
    payment_method: string;
    order_notes: string;
    status: string;
    created_at: string;
    updated_at: string;
    items: OrderItem[];
}

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

export const fetchUserOrders = async (): Promise<Order[]> => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}orders/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch orders");
    }

    return response.json();
};

export const getOrderDetail = async (orderId: number): Promise<Order> => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}orders/${orderId}/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch order details");
    }

    return response.json();
};
