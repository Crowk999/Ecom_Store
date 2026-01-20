import React, { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../api/auth";

const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const data = await loginUser({ username, password });
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);
            // Force reload to update Navbar state
            window.location.href = "/";
        } catch (err: any) {
            setError(err.message || "Login failed");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-2xl relative overflow-hidden border border-gray-100 dark:border-gray-700">
                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>

                <div className="text-center relative z-10">
                    <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30 transform rotate-3 hover:rotate-6 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19,22H5a1,1,0,0,1,0-2H19a1,1,0,0,1,0,2Z" />
                            <path d="M16.5,18a1,1,0,0,1-.6-.2,4.88,4.88,0,0,0-5.8,0,1,1,0,0,1-1.2-1.6,6.85,6.85,0,0,1,8.2,0A1,1,0,0,1,16.5,18Z" />
                            <path d="M12,18a6.49,6.49,0,0,1-3-1v1a1,1,0,0,1-2,0V6.63A4.52,4.52,0,0,1,7.26,6l1.37-3.42A3,3,0,0,1,13,1.48L14.1,2H16a3,3,0,0,1,3,3V7a1,1,0,0,1-2,0V5a1,1,0,0,0-1-1H15.1l-.81-1.62A1,1,0,0,0,13.4,2L12,5.5,10.23,2.85A2.62,2.62,0,0,0,8.38,1.6L7.1,4.79A2.53,2.53,0,0,0,7,5.5V17a4.49,4.49,0,0,0,4.45,1H12Z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Sign in to continue your journey
                    </p>
                </div>

                <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 p-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all transform hover:-translate-y-0.5 shadow-lg ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <svg className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </span>
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </div>
                </form>

                <div className="text-center relative z-10">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline transition-all">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
