import type { Products } from "./type";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

type props = {
    product: Products
}

function ProductCard({ product }: props) {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const isLiked = isInWishlist(product.id);

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product.id);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all duration-300 relative group border border-gray-100 dark:border-gray-700">
            {/* Wishlist Button */}
            <button
                onClick={handleWishlist}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 transition-colors ${isLiked ? "text-red-500 fill-current" : "text-gray-400 dark:text-gray-300 hover:text-red-400"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>

            <Link to={`/product/${product.id}`} className="block">
                <div className="relative overflow-hidden rounded-lg mb-4 h-56">
                    <img
                        src={product.image
                            ? (product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`)
                            : "/default-image.jpg"}
                        alt={product.name || "Product"}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                </div>

                <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-1">
                    {product.name}
                </h2>

                <p className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                    ${product.price}
                </p>
            </Link>
        </div>
    )
}

export default ProductCard;