const AUTH_URL = "http://127.0.0.1:8000/api/";

export const loginUser = async (data: any) => {
    const response = await fetch(`${AUTH_URL}login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Login failed");
    }
    return response.json();
};

export const registerUser = async (data: any) => {
    const response = await fetch(`${AUTH_URL}register/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json();
        // Extract error messages if possible
        const errorMessage = Object.values(errorData).flat().join(", ") || "Registration failed";
        throw new Error(errorMessage);
    }
    return response.json();
};
