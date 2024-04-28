class PriceRepository {
  constructor(service) {
    this.service = service;
    this.priceCollection = "prices";
  }

  async updateProductsPrice(prices) {
    if(!prices.length) {
        return [];
    }
    const db = await this.service.getMongoDb();
    const priceBulkUpdate = db
      .collection(this.priceCollection)
      .initializeUnorderedBulkOp();
    for (const price of prices) {
      const updatedAt = new Date();
      const {
        sku,
        currency,
        promoStartDate,
        promoEndDate,
        promoLabel,
        promoPrice,
        promoUrl,
        sellingPrice,
        vat,
        vatCode
      } = price;
      priceBulkUpdate.find({ sku }).upsert().updateOne({
        $set: {
          sku,
          currency,
          promoStartDate,
          promoEndDate,
          promoLabel,
          promoPrice,
          promoUrl,
          sellingPrice,
          vat,
          vatCode,
          updatedAt,
        },
      });
    }

    await priceBulkUpdate.execute();
    return prices.map((p) => p.sku);
  }

  async getProductPrice (sku) {
    const db = await this.service.getMongoDb();
    return await db.collection(this.priceCollection).findOne({ sku });
  }
}

export default PriceRepository;