import Boom from '@hapi/boom';
import CartRepository from './CartRepository.js';
import { calculateOrderPrice, calculateOrderLinePrice } from '../../lib/priceUtils/orderPricing.js';
import { getUpdatedProducts } from './utils/cartUtils.js';

class CartProvider {
  constructor(service) {
    this.service = service;
    this.cartRepository = new CartRepository(this.service);
  }

  getOrderPrice(cartItemsWithProductDetails) {
    const orderLinesWithPrice = cartItemsWithProductDetails.map(l => {
        return {
            ...l,
            orderLinePrice: calculateOrderLinePrice(l)
        };
    })
    const orderPrice = calculateOrderPrice(orderLinesWithPrice);
    return {
        orderPrice,
        orderLines: orderLinesWithPrice
    }
  }

  async getCart(customerId) {
    const productProvider = await this.service.getProductProvider();
    const {_id: cartId, products: cartProducts } = await this.cartRepository.getCart(customerId); //ToDO
    const cartItems  = cartProducts.map(p => p.sku).join(',');
    const productDetails = await productProvider.getProductsBySkus(cartItems);
    const cartItemsWithProductDetails = cartProducts.map(i => {
        const product = productDetails.find(p => p.sku === i.sku);
        return {
            ...i,
            ...product
        }
    });
    const orderPrice =  this.getOrderPrice(cartItemsWithProductDetails);
    return {
        customerId,
        cartId,
        ...orderPrice,
    }
  }

  async addProductsToCart (token, headerCredentials, products) {
    const { customerId } = headerCredentials;
    const productsSkus = products.map(product => product.sku).join(',');
    const productProvider = await this.service.getProductProvider();
    const cartItemsWithProductDetails = await productProvider.getProductsBySkus(productsSkus);
    const isAllProductAvailable = cartItemsWithProductDetails.every(l => !l.isDeleted);
    if(!isAllProductAvailable) {
        throw Boom.badImplementation('All products not available');
    }
    const existingCart = await this.cartRepository.getCart('d363d232-38d5-41fd-8404-f3970b6fcb28'); //ToDO
    const productsInCart = existingCart ? existingCart.products : [];
    const updatedProducts = getUpdatedProducts(productsInCart, products);
    await this.cartRepository.updateProducts('d363d232-38d5-41fd-8404-f3970b6fcb28', updatedProducts);
    return await this.getCart('d363d232-38d5-41fd-8404-f3970b6fcb28');
  }

}

export default CartProvider;