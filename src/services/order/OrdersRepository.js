class OrdersRepository {
    constructor(service) {
      this.service = service;
      this.ordersCollection = "orders";
    }
  
    async getOrderByOrderReference (orderReference) {
      const db = await this.service.getMongoDb();
      return await db.collection(this.ordersCollection).findOne({ orderReference });
    }
    async getOrderByMongoId (orderId) {
      const db = await this.service.getMongoDb();
      return db.collection(this.ordersCollection).findOne({ _id: orderId });
    }
    async saveOrder(order) {
      const db = await this.service.getMongoDb();
      const result = await db.collection(this.ordersCollection).insertOne(order);
      return await this.getOrderByMongoId(result.insertedId);
    }

    async getOrderByReference (customerId, orderReference) {
      const db = await this.service.getMongoDb();
      return db.collection(this.ordersCollection).findOne({ customerId, orderReference});
    }
    async getCustomerOrders (customerId, limit, skip) {
      const db = await this.service.getMongoDb();
      return db.collection(this.ordersCollection)
      .find({customerId})
      .skip(skip * limit)
      .limit(parseInt(limit))
      .sort('createdAt')
      .toArray();
    }
  }
  
  export default OrdersRepository;