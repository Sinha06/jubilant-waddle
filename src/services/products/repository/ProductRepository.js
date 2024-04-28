class ProductRepository {
  constructor(service) {
    this.service = service;
    this.productCollection = "products";
  }

  async updateProducts(products) {
    if(!products.length) {
        return [];
    }
    const db = await this.service.getMongoDb();
    const productBulkUpdate = db
      .collection(this.productCollection)
      .initializeUnorderedBulkOp();
    for (const product of products) {
      const updatedAt = new Date();
      const {
        sku,
        name,
        description,
        productUrl,
        isDeleted,
        keywords,
        tags,
        brand,
        category,
      } = product;
      productBulkUpdate
        .find({ sku: product.sku })
        .upsert()
        .updateOne({
          $set: {
            sku,
            name,
            description,
            productUrl,
            isDeleted,
            keywords,
            tags,
            brand,
            category,
            updatedAt
          },
        });
    }

    await productBulkUpdate.execute();
    return products.map((p) => p.sku);
  }

  async getProductBySku (sku) {
    const db = await this.service.getMongoDb();
    return await db.collection(this.productCollection).findOne({ sku });
  }
}

export default ProductRepository;