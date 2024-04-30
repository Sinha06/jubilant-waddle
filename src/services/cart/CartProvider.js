import Boom from '@hapi/boom';
import CartRepository from './CartRepository.js';
import { calculateOrderPrice, calculateOrderLinePrice } from '../../lib/priceUtils/orderPricing.js';
import { getUpdatedProducts, removeProductFromCart } from './utils/cartUtils.js';

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
    const cart = await this.cartRepository.getCart(customerId); //ToDO
    if(!cart) {
        return {}
    }
    const cartItems  = cart.products.map(p => p.sku).join(',');
    const productDetails = await productProvider.getProductsBySkus(cartItems);
    const cartItemsWithProductDetails = cart.products.map(i => {
        const product = productDetails.find(p => p.sku === i.sku);
        return {
            ...i,
            ...product
        }
    });
    const orderPrice =  this.getOrderPrice(cartItemsWithProductDetails);
    return {
        customerId,
        cartId: cart._id,
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
    const existingCart = await this.cartRepository.getCart(customerId);
    const productsInCart = existingCart ? existingCart.products : [];
    const updatedProducts = getUpdatedProducts(productsInCart, products);
    await this.cartRepository.updateProducts(customerId, updatedProducts);
    return await this.getCart(customerId);
  }

  async removeProductFromCart (customerId, skuToRemove) {
    const existingCart = await this.cartRepository.getCart(customerId);
    if(!existingCart) {
        return {};
    }
    const updatedProducts = removeProductFromCart(existingCart.products, skuToRemove);
    if(!updatedProducts.length) {
        await this.cartRepository.deleteCart(customerId);
        return {};
    }
    await this.cartRepository.updateProducts(customerId, updatedProducts);
    return await this.getCart(customerId);
  }

  async clearCart (customerId) {
    const existingCart = await this.cartRepository.getCart(customerId);
    if(!existingCart) {
      return {};
  }
    return await this.cartRepository.deleteCart(customerId)
  }

}

export default CartProvider;