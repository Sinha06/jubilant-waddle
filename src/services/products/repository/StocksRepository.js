class StockRepository {
  constructor(service) {
    this.service = service;
    this.stocksCollection = "stocks";
  }

  async updateStocks (stockSupplierData) {
    try {
      if(!stockSupplierData.length) {
        return [];
      }
      const db = await this.service.getMongoDb();
      const stockBulkUpdate = db.collection(this.stocksCollection).initializeUnorderedBulkOp();

      for (const stock of stockSupplierData) {
        console.info(`Updating stock supplier data for ${stock.supplierCode} & ${stock.supplierSku}`);
        const updatedAt = new Date();
        stockBulkUpdate
          .find({ supplierCode: stock.supplierCode, supplierSku: stock.supplierSku })
          .upsert()
          .updateOne({
            $set: {
              ...stock,
              updatedAt
            }
          });
      }
      await stockBulkUpdate.execute();
      return stockSupplierData.map((s) => s.supplierSku);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getStockBySku (sku) {
    const db = await this.service.getMongoDb();
    return await db.collection(this.stocksCollection).findOne({ sku });
  }
}

export default StockRepository;