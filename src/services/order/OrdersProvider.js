import Boom from '@hapi/boom';
import OrdersRepository from './OrdersRepository.js';
import { newOrderPayloadMap } from './utils/orderUtils.js';
import random from 'lodash.random';

class OrdersProvider {
  constructor(service) {
    this.service = service;
    this.orderRepository = new OrdersRepository(this.service);
  }

  async getOrderReference() {
    const min = 100000;
    const max = 999999;
    const num1 = random(min, max);
    const num2 = random(min, max);
    const orderReference = `FH-${num1}-${num2}`;
    const order = await this.orderRepository.getOrderByOrderReference(orderReference);
    if (!order) {
      return orderReference;
    }
    return this.getOrderReference();
  }

  async saveOrderHelper(customerId, orderData) {
    const _customerId = 'd363d232-38d5-41fd-8404-f3970b6fcb28';
    const userProvider = await this.service.getUserProvider();
    const cartProvider = await this.service.getCartProvider();
    const [userData, cartData] = await Promise.all([
      userProvider.getUserByCustomerId(_customerId),
      cartProvider.getCart(_customerId),
    ]);

    const orderPayload = newOrderPayloadMap(orderData, cartData, userData);
    const orderReference = await this.getOrderReference();
    const createdOrder = await this.orderRepository.saveOrder({
      orderReference,
      ...orderPayload,
    });
    return createdOrder;
  }
  async saveOrder(customerId, orderData) {
    try {
      const order = await this.saveOrderHelper(customerId, orderData);
      const { orderReference } = order;
      return { orderReference };
    } catch (error) {
      console.error("Error saving order", error);
      throw Boom.badImplementation("Error saving order");
    }
  }

  async getOrderByReference (customerId, orderReference) {
    const order = await this.orderRepository.getOrderByReference('d363d232-38d5-41fd-8404-f3970b6fcb28', orderReference);
    return order;
  }
  async getCustomerOrders(customerId, limit, skip) {
    const order = await this.orderRepository.getCustomerOrders('d363d232-38d5-41fd-8404-f3970b6fcb28', limit, skip);
    return order;
  }
}

export default OrdersProvider;