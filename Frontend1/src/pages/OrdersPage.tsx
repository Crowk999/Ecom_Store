import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchUserOrders, getOrderDetail, type Order, type OrderItem } from '../api/orders';

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) return;
        loadOrders();
    }, [token]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await fetchUserOrders();
            setOrders(data);
            setError(null);
        } catch (err) {
            setError("Failed to load orders");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOrderClick = async (orderId: number) => {
        try {
            const order = await getOrderDetail(orderId);
            setSelectedOrder(order);
        } catch (err) {
            console.error("Failed to fetch order details", err);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'shipped':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'delivered':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
                <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Login Required</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Please login to view your orders</p>
                    <Link to="/login" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium">
                        Login Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                        My Orders
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Track your orders and view details</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Loading orders...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-red-700 dark:text-red-400">
                        {error}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-lg">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Orders Yet</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't placed any orders yet</p>
                        <Link to="/" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Orders List */}
                        <div className="lg:col-span-2">
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div
                                        key={order.id}
                                        onClick={() => handleOrderClick(order.id)}
                                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-[1.02] border border-gray-100 dark:border-gray-700"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                    Order #{order.id}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {new Date(order.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-gray-200 dark:border-gray-700">
                                            <div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Items</p>
                                                <p className="font-bold text-gray-900 dark:text-white text-lg">
                                                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Amount</p>
                                                <p className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">
                                                    ${parseFloat(order.total_amount).toFixed(2)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Payment</p>
                                                <p className="font-semibold text-gray-900 dark:text-white text-sm capitalize">
                                                    {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Delivery To</p>
                                                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                                    {order.address}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:text-indigo-700 dark:hover:text-indigo-300">
                                            <span>View Details</span>
                                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Details Sidebar */}
                        <div className="lg:col-span-1">
                            {selectedOrder ? (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-4 border border-gray-100 dark:border-gray-700">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                            Order Details
                                        </h3>
                                        <button
                                            onClick={() => setSelectedOrder(null)}
                                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Order ID</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">#{selectedOrder.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Status</p>
                                            <p className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                                                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Delivery Address</p>
                                            <p className="text-sm text-gray-900 dark:text-white font-medium">{selectedOrder.address}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Contact</p>
                                            <p className="text-sm text-gray-900 dark:text-white font-medium">{selectedOrder.phone}</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-3">Items</h4>
                                        <div className="space-y-3 max-h-48 overflow-y-auto">
                                            {selectedOrder.items.map((item: OrderItem) => (
                                                <div key={item.id} className="flex gap-3 items-start">
                                                    {item.product_image && (
                                                        <img
                                                            src={item.product_image.startsWith('http') ? item.product_image : `http://127.0.0.1:8000${item.product_image}`}
                                                            alt={item.product_name}
                                                            className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                                        />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.product_name}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                                            <span>Total</span>
                                            <span className="text-indigo-600 dark:text-indigo-400">${parseFloat(selectedOrder.total_amount).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center border border-gray-100 dark:border-gray-700">
                                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-gray-600 dark:text-gray-400">Click on an order to see details</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
