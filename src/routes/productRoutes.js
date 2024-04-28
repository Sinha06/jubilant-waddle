import Joi from "@hapi/joi";

const sharedRouteConfig = {
  auth: "jwt_strategy",
};

export const getProducts = {
  path: "/v1.0/products/{id}",
  method: "GET",
  options: {
    tags: ["api"],
    ...sharedRouteConfig,
    validate: {
      failAction: (request, h, err) => {
        throw err;
      },
    },
  },
  handler: async (request, h) => {
    const { service } = request.server.app;
    const productId = request.params.id;
    const productProvider = await service.getProductProvider();
    return await productProvider.getProductBySku(productId);
  },
};
export const updateProducts = {
  path: "/v1.0/products",
  method: "POST",
  options: {
    tags: ["api"],
    ...sharedRouteConfig,
    validate: {
      payload: Joi.array().items(
        Joi.object({
          sku: Joi.string().required(),
          name: Joi.string().required(),
          description: Joi.string().allow(""),
          productUrl: Joi.string().required(),
          isDeleted: Joi.boolean().required(),
          keywords: Joi.object({
            nouns: Joi.array().items(Joi.string().allow("")),
          }),
          tags: Joi.array().items(Joi.string().allow("")),
          brand: Joi.object({
            brandId: Joi.string().allow(""),
            brandName: Joi.string().allow(""),
            brandUrl: Joi.string().allow(""),
          }),
          category: Joi.object({
            categoryId: Joi.string().allow(""),
            categoryName: Joi.string().allow(""),
          }),
        })
      ),
      failAction: (request, h, err) => { throw err; },
    },
  },
  handler: async (request, h) => {
    const { service } = request.server.app;
    const products = request.payload;
    const productProvider = await service.getProductProvider();
    return await productProvider.updateProducts(products);
  },
};
export const updateProductsPrice = {
  path: "/v1.0/products/price",
  method: "POST",
  options: {
    tags: ["api"],
    ...sharedRouteConfig,
    validate: {
      payload: Joi.array().items(
        Joi.object({
          sku: Joi.string().required(),
          currency: Joi.string().required(),
          promoStartDate: Joi.date().allow(null),
          promoEndDate: Joi.date().allow(null),
          promoLabel: Joi.string().allow(null),
          promoPrice: Joi.number().allow(null),
          promoUrl: Joi.string().allow(null),
          sellingPrice: Joi.number().required(),
          vat: Joi.number().required(),
          vatCode: Joi.number().required()
        })
      ),
      failAction: (request, h, err) => { throw err; },
    },
  },
  handler: async (request, h) => {
    const { service } = request.server.app;
    const products = request.payload;
    const productProvider = await service.getProductProvider();
    return await productProvider.updateProductsPrices(products);
  },
};

export const updateStocks = {
  path: "/v1.0/products/stocks",
  method: "POST",
  options: {
    tags: ["api"],
    ...sharedRouteConfig,
    validate: {
      payload: Joi.array().items(
        Joi.object({
          sku: Joi.string().required(),
          supplierCode: Joi.string().required(),
          supplierSku: Joi.string().required(),
          title: Joi.string().allow(""),
          shortDescription: Joi.string().allow(null),
          longDescription: Joi.string().allow(null),
          costPrice: Joi.number().required(),
          leadTime: Joi.object({
            from: Joi.string().allow(null),
            to: Joi.string().allow(null)
          }),
          workingDays: Joi.array().items(Joi.string()).allow(null),
          businessStartTime: Joi.number().allow(null),
          businessEndTime: Joi.number().allow(null),
          deliveryCharge: Joi.number().allow(null),
        })
      ),
      failAction: (request, h, err) => {
        throw err;
      },
    },
  },
  handler: async (request, h) => {
    const { service } = request.server.app;
    const stocks = request.payload;
    const productProvider = await service.getProductProvider();
    return await productProvider.updateStocks(stocks);
  },
};
