const transformCartPrice = (orderPrice) => {
    return {
      orderGrandTotalWithoutVat: orderPrice.cartGrandTotalWithoutVat,
      orderGrandTotalWithVat: orderPrice.cartGrandTotalWithVat
    };
};

const transformCartOrderLines = (orderLines) => {
    return orderLines.map(l => {
        return {
            sku: l.sku,
            quantity: l.quantity,
            brand: l.brand,
            category: l.category,
            description: l.description,
            name: l.name,
            productUrl: l.productUrl,
            price: l.price,
            orderLinePrice: l.orderLinePrice
        }
    })
}; 
export const newOrderPayloadMap = (orderData, cartData, userData) => {

    return {
        customerId: userData.customerId,
        shippingDetails: {
            shippingAddress: orderData.shippingDetails.shippingAddress
        },
        billingDetails: {
            billingAddress: orderData.billingDetails.billingAddress
        },
        currency: cartData.currency,
        orderPrice: transformCartPrice(cartData.orderPrice),
        orderLines: transformCartOrderLines(cartData.orderLines),
        createdAt: new Date(),
        status: 'order_processing'
    };
};