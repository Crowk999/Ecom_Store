import React, { useEffect } from "react";
import { removeFromCart, updateCartQuantity } from "../api/cart";
import CartItem from "../component/CartItem";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartPage: React.FC = () => {
    const { cart, refreshCart, loading } = useCart();

    useEffect(() => {
        refreshCart();
    }, []);

    const handleRemove = async (itemId: number) => {
        try {
            await removeFromCart(itemId);
            await refreshCart();
        } catch (err) {
            alert("Failed to remove item");
        }
    };

    const handleUpdateQuantity = async (itemId: number, action: "increase" | "decrease") => {
        try {
            await updateCartQuantity(itemId, action);
            await refreshCart();
        } catch (err) {
            console.error("Failed to update quantity");
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    // Assuming error handling is now managed by the context or not explicitly displayed here
    // If the context provides an error state, you might want to display it here.
    // For now, based on the provided snippet, the local error state and its display are removed.

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
            <div className="mx-auto max-w-5xl">
                <h1 className="mb-10 text-4xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm">
                    Shopping Cart
                </h1>

                {!cart || cart.items.length === 0 ? (
                    <div className="rounded-3xl bg-white dark:bg-gray-800 p-16 text-center shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center transition-colors duration-300">
                        <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h2 className="mb-3 text-2xl font-bold text-gray-900">
                            Your cart is empty
                        </h2>
                        <p className="mb-8 text-gray-500 max-w-md mx-auto text-lg">
                            Looks like you haven't added anything yet. Explore our premium collection and find something you love.
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-base font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-8 lg:grid-cols-12 items-start">
                        <div className="rounded-2xl bg-white shadow-lg border border-gray-100 lg:col-span-8 overflow-hidden">
                            <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-gray-700 dark:text-gray-200 font-semibold">Cart Items ({cart.items.length})</h3>
                            </div>
                            <div className="p-6 divide-y divide-gray-100 dark:divide-gray-700">
                                {cart.items.map((item: any) => (
                                    <div key={item.id} className="py-2 first:pt-0 last:pb-0">
                                        <CartItem item={item} onRemove={handleRemove} onUpdateQuantity={handleUpdateQuantity} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-4 space-y-6 sticky top-24">
                            <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                                <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-4">
                                    Order Summary
                                </h2>
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Subtotal</span>
                                        <span>${Number(cart.total).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Shipping</span>
                                        <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Tax</span>
                                        <span>$0.00</span>
                                    </div>
                                </div>
                                <div className="mb-8 flex justify-between text-xl font-extrabold text-gray-900 dark:text-white pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <span>Total</span>
                                    <span>${Number(cart.total).toFixed(2)}</span>
                                </div>

                                <Link to="/checkout" className="w-full rounded-xl bg-indigo-600 px-6 py-4 text-center text-base font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                    Proceed to Checkout
                                </Link>
                                <p className="mt-4 text-xs text-gray-400 text-center flex items-center justify-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Secure Checkout
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
