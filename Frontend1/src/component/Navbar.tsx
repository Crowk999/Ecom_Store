import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isDark, setIsDark] = useState(false);
    const { cart } = useCart();
    const navigate = useNavigate();
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        setUsername(localStorage.getItem("username"));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setUsername(null);
        navigate("/login");
    };

    const cartItemCount = cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/?search=${searchQuery}`);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo Section */}
                    <Link to="/" className="flex-shrink-0 flex items-center gap-2 group cursor-pointer">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-500/30">
                            {/* Knight Logo (SVG) */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17,2H7C5.9,2,5,2.9,5,4v3h2V4h10v16H7v-3H5v3c0,1.1,0.9,2,2,2h10c1.1,0,2-0.9,2-2V4C19,2.9,18.1,2,17,2z" />
                                <path d="M12.5 15c-2.33 0-4.31 1.46-5.11 3.5h10.22c-0.8-2.04-2.78-3.5-5.11-3.5zM12.5 6c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z" />
                                <path d="M10.84,8.5L9.67,9.67l0.59,0.59L12,8.5l1.74,1.76l0.59-0.59l-1.17-1.17L14.33,7.33l-0.59-0.59L12,8.5L10.26,6.74L9.67,7.33L10.84,8.5z" opacity="0" />
                            </svg>
                        </div>
                        <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight">
                            Crowk Shop
                        </span>
                    </Link>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-lg mx-8">
                        <form onSubmit={handleSearch} className="w-full relative group">
                            <input
                                type="text"
                                placeholder="Search premium products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-100 dark:focus:border-indigo-900 outline-none transition-all placeholder-gray-400 text-gray-700 dark:text-gray-200 shadow-inner"
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </form>
                    </div>

                    {/* Navigation Actions */}
                    <div className="flex items-center space-x-6">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                        >
                            {isDark ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        <Link to="/cart" className="relative p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors group">
                            {cartItemCount > 0 && (
                                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white dark:ring-gray-900 transform group-hover:scale-110 transition-transform animate-pulse">
                                    {cartItemCount}
                                </div>
                            )}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </Link>

                        {/* Auth Links */}
                        {username ? (
                            <div className="flex items-center gap-6 ml-4">
                                <button
                                    onClick={handleLogout}
                                    className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-all duration-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </button>

                                <div className="flex items-center gap-3 pl-6 border-l border-gray-200 dark:border-gray-700">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Welcome back,</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">{username}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-50 shadow-sm overflow-hidden ring-2 ring-transparent group-hover:ring-indigo-200 transition-all">
                                        <img src={`https://ui-avatars.com/api/?name=${username}&background=random`} alt="User" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
