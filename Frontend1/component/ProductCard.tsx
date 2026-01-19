import type { Products } from "./type";

type props = {
    product: Products
}
function ProductCard({ product }: props) {
    return (
        <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg hover:scale-105 
                transition-transform duration-300">
            <img
                src={product.image
                    ? (product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`)
                    : "/default-image.jpg"}
                alt={product.name || "Product"}
                className="w-full h-56 object-cover rounded-lg mb-4"
            />

            <h2 className="text-lg font-semibold text-gray-900 truncate">
                {product.name}
            </h2>

            <p className="text-gray-700 font-medium ">
                ${product.price}
            </p>

        </div>
    )
}

export default ProductCard;