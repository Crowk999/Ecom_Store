import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Products } from "../component/type";
import { addToCart } from "../api/cart";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState<Products | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const { refreshCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/products/${id}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Product not found");
                }
                return response.json();
            })
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    const handleAddToCart = async () => {
        if (!product) return;
        setAdding(true);
        try {
            await addToCart(product.id, quantity);
            await refreshCart(); // Update global cart state
            alert(`Added ${quantity} ${product.name} to cart!`);
        } catch (error) {
            alert("Failed to add product to cart");
        } finally {
            setAdding(false);
        }
    };

    const handleQuantityChange = (type: 'increase' | 'decrease') => {
        if (type === 'increase') {
            setQuantity(prev => prev + 1);
        } else if (type === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error || !product) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-red-500">
            <p className="text-xl font-semibold mb-4">Error: {error}</p>
            <Link to="/" className="text-blue-600 hover:underline">Go Home</Link>
        </div>
    );

    const isLiked = product ? isInWishlist(product.id) : false; // Determine if product is in wishlist

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <Link to="/" className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="font-medium">Home</span>
                </Link>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
                    <div className="md:flex">
                        {/* Image Section */}
                        <div className="md:w-1/2 bg-gray-100 dark:bg-gray-700 relative group">
                            {/* Wishlist Button */}
                            <button
                                onClick={() => product && toggleWishlist(product.id)}
                                className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg hover:scale-110 transition-transform group"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-8 w-8 transition-colors ${isLiked ? "text-red-500 fill-current" : "text-gray-400 dark:text-gray-300 group-hover:text-red-400"}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                            <img
                                src={product.image
                                    ? (product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`)
                                    : "/default-image.jpg"}
                                alt={product.name}
                                className="w-full h-[500px] object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>

                        {/* Details Section */}
                        <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                            <div className="uppercase tracking-wide text-sm text-indigo-600 dark:text-indigo-400 font-bold mb-2">
                                {product.category.name}
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                                {product.name}
                            </h1>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                                ${product.price}
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                                {product.description}
                            </p>

                            <div className="space-y-6">
                                {/* Quantity Selector */}
                                <div className="flex items-center space-x-4 mb-4">
                                    <span className="text-gray-700 dark:text-gray-200 font-bold">Quantity:</span>
                                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden shadow-sm">
                                        <button
                                            onClick={() => handleQuantityChange('decrease')}
                                            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border-r border-gray-300 dark:border-gray-600 font-bold"
                                        >
                                            -
                                        </button>
                                        <span className="px-6 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold min-w-[50px] text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => handleQuantityChange('increase')}
                                            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border-l border-gray-300 dark:border-gray-600 font-bold"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={adding}
                                        className={`flex-1 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 ${adding ? 'opacity-75 cursor-not-allowed' : ''}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span>{adding ? 'Adding...' : 'Add to Cart'}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>In stock and ready to ship</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
