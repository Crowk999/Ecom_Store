import { useEffect, useState } from "react";
import ProductCard from "../component/ProductCard";


function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/products/")
        .then((response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })).then((data) => {
            setProducts(data);
            setLoading(false);
        }).catch((error) => {
            setError(error.message);
            setLoading(false);
        });
    }, []);
    if (loading) {
        return <div>Loading...</div>;
    }   
    if (error) {
        return <div>Error: {error}</div>;
    }
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <h1 className="text-3xl font-bold text-center py-6 bg-slate-100 shadow-md">Products List</h1>
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-5">
                    {products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (<p className="text-center col-span-full text-gray-600">No products available.</p>)}
        </div>
    );
};

export default ProductList;