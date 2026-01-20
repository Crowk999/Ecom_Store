import React from "react";

interface CartItemProps {
    item: any;
    onRemove: (id: number) => void;
    onUpdateQuantity: (id: number, action: "increase" | "decrease") => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onUpdateQuantity }) => {
    return (
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 py-4 last:border-b-0 animate-fade-in bg-white dark:bg-gray-800 p-4 rounded-lg transition-colors">
            <div className="flex items-center gap-4">
                {item.product_image ? (
                    <img
                        src={`http://127.0.0.1:8000${item.product_image}`}
                        alt={item.product_name}
                        className="h-20 w-20 rounded-md object-cover shadow-sm bg-gray-100"
                    />
                ) : (
                    <div className="h-20 w-20 rounded-md bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                        No Image
                    </div>
                )}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.product_name}</h3>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                            <button
                                onClick={() => onUpdateQuantity(item.id, "decrease")}
                                className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-md transition-colors"
                                disabled={item.quantity <= 1}
                            >
                                -
                            </button>
                            <span className="px-2 text-sm font-medium text-gray-900 dark:text-white border-x border-gray-300 dark:border-gray-600">
                                {item.quantity}
                            </span>
                            <button
                                onClick={() => onUpdateQuantity(item.id, "increase")}
                                className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-md transition-colors"
                            >
                                +
                            </button>
                        </div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            ${Number(item.product_price * item.quantity).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
            <button
                onClick={() => onRemove(item.id)}
                className="rounded-md bg-red-50 dark:bg-red-900/20 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
                Remove
            </button>
        </div>
    );
};

export default CartItem;
