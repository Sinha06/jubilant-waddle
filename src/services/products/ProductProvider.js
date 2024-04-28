import Boom from '@hapi/boom';
import ProductRepository from './repository/ProductRepository.js';
import PriceRepository from './repository/PriceRepository.js';
import StocksRepository from './repository/StocksRepository.js';
import { isValidSku } from './utils/productUtils.js';
import { calculateProductPrice } from '../../lib/priceUtils/productPricing.js';

class ProductProvider {
  constructor(service) {
    this.service = service;
    this.productRepository = new ProductRepository(this.service);
    this.priceRepository = new PriceRepository(this.service);
    this.stocksRepository = new StocksRepository(this.service);
  }

  async getProductBySku(sku) {
    const product = await this.productRepository.getProductBySku(sku);
    const price = await this.priceRepository.getProductPrice(sku);
    const productPrice = calculateProductPrice(price)
    const stock = await this.stocksRepository.getStockBySku(sku);

    return { ...product, price: productPrice, stock};
  }

  async getProductsBySkus(skus) {
    const splittedSkus = skus.split(',');
    return await Promise.all(splittedSkus.map(sku => this.getProductBySku(sku)));
  }

  async updateProducts(products) {
    const validProducts = products.filter(isValidSku);
    const joinedSkus = validProducts.join(",");
    try {
      const updatedProductSkus = await this.productRepository.updateProducts(
        validProducts
      );
      return { skus: updatedProductSkus };
    } catch (error) {
      const errorMessage = `Error updating products for skus ${joinedSkus}`;
      throw Boom.badImplementation(errorMessage, error);
    }
  }

  async updateProductsPrices(products) {
    const validProducts = products.filter(isValidSku);
    const joinedSkus = validProducts.join(",");
    try {
      const updatedProductSkus = await this.priceRepository.updateProductsPrice(validProducts);
      return { skus: updatedProductSkus };
    } catch (error) {
      const errorMessage = `Error updating products for skus ${joinedSkus}`;
      throw Boom.badImplementation(errorMessage, error);
    }
  }

  async updateStocks(stocks) {
    const validProducts = stocks.filter(isValidSku);
    const joinedSkus = validProducts.join(",");
    try {
      const updatedProductSkus = await this.stocksRepository.updateStocks(validProducts);
      return { skus: updatedProductSkus };
    } catch (error) {
      const errorMessage = `Error updating stocks for skus ${joinedSkus}`;
      throw Boom.badImplementation(errorMessage, error);
    }
  }
}

export default ProductProvider;