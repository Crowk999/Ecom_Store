// Currency configuration
export const CURRENCY = {
    symbol: '$',
    code: 'USD',
    name: 'US Dollar',
    decimalPlaces: 2,
};

// Format price with currency
export const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `${CURRENCY.symbol}${numPrice.toFixed(CURRENCY.decimalPlaces)}`;
};

// Format price for display in checkout/orders
export const formatOrderPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `${CURRENCY.symbol}${numPrice.toFixed(CURRENCY.decimalPlaces)}`;
};
