import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const OrderSuccessPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        // Confetti effect or celebration animation could go here
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4">
            <div className="max-w-2xl w-full">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
                    {/* Success Icon */}
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        Thank you for your purchase. Your order has been confirmed.
                    </p>

                    {/* Order Details */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 mb-8 border border-indigo-100 dark:border-indigo-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Order Number</p>
                                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">#{orderId || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estimated Delivery</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="text-3xl mb-2">📧</div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Email Confirmation</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Check your inbox</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="text-3xl mb-2">📦</div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Track Your Order</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Coming soon</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="text-3xl mb-2">🎁</div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Free Shipping</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">On this order</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/"
                            className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:-translate-y-0.5"
                        >
                            Continue Shopping
                        </Link>
                        <button
                            onClick={() => window.print()}
                            className="px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        >
                            Print Receipt
                        </button>
                    </div>

                    {/* Support Info */}
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Need help? Contact our support team at{' '}
                            <a href="mailto:support@crowkshop.com" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                                support@crowkshop.com
                            </a>
                        </p>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        🔒 Your payment information is secure and encrypted
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
