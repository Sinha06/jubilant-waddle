
export const getUpdatedProducts = (productsInCart, products) => {
    const updatedProductsSet = new Set(productsInCart.map(product => product.sku));

    products.forEach(product => {
        if (updatedProductsSet.has(product.sku)) {
            const existingProductIndex = productsInCart.findIndex(p => p.sku === product.sku);
            productsInCart[existingProductIndex].quantity += product.quantity;
        } else {
            productsInCart.push({ sku: product.sku, quantity: product.quantity });
            updatedProductsSet.add(product.sku);
        }
    });

    return productsInCart;
};
