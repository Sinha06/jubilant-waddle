class CartRepository {
    constructor(service) {
      this.service = service;
      this.cartCollection = "cart";
    }
  
    async getCart (customerId) {
      const db = await this.service.getMongoDb();
      return await db.collection(this.cartCollection).findOne({ customerId });
    }
    async updateProducts (customerId, updatedProducts) {
      const db = await this.service.getMongoDb();
      return await db.collection(this.cartCollection).updateOne(
        { customerId },
        {
          $set: { products: updatedProducts, modifiedAt: new Date() },
        },
        { upsert: true }
      );
    }

    async deleteCart (customerId) {
        const db = await this.service.getMongoDb();
        return await db.collection(this.cartCollection).deleteOne({
            customerId
          });
    }
  }
  
  export default CartRepository;