import num from 'num';

const PENNY = '0.01';
const getUnitPriceWithVat = (price) => {
    const vatDecimal = num(price.vat).mul(PENNY);
    return num(price.sellingPrice).mul(vatDecimal.add(1)).toString();
};

export const calculateProductPrice = (price) => {
    return { 
        ...price,
        productPriceWithVat : getUnitPriceWithVat(price)
    };
};