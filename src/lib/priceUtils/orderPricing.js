
import { calculateProductPrice } from './productPricing.js';
import num from 'num';


export const calculateOrderLinePrice = (orderLine) => {
    const {price, quantity } = orderLine;
    const productPrice = calculateProductPrice(price);

    const unitPriceWithoutVat = productPrice.sellingPrice;
    const unitPriceWithVat = productPrice.productPriceWithVat;
    const orderLinePriceWithoutVat = num(unitPriceWithoutVat).mul(quantity).round(2).toString();
    const orderLinePriceWithVat = num(unitPriceWithVat).mul(quantity).round(2).toString();
    return {
        unitPriceWithoutVat,
        unitPriceWithVat,
        orderLinePriceWithoutVat,
        orderLinePriceWithVat,
        vatRate: price.vat
    }
};

export const calculateOrderPrice = (orderLines) => {
    const orderPrice = {
        cartGrandTotalWithoutVat: 0,
        cartGrandTotalWithVat: 0,
    };
    for (const { orderLinePrice } of orderLines) {
        orderPrice.cartGrandTotalWithoutVat += Number(orderLinePrice.orderLinePriceWithoutVat);
        orderPrice.cartGrandTotalWithVat += Number(orderLinePrice.orderLinePriceWithVat);
    }
    return orderPrice;
};