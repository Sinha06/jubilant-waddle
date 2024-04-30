import Joi from '@hapi/joi';

const sharedRouteConfig = {
    auth: 'jwt_strategy'
  };


export const getCart = {
  path: "/v1.0/cart",
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
    const headerCredentials = request.auth.credentials;
    const { customerId } = headerCredentials;
    const cartProvider = await service.getCartProvider();
    return await cartProvider.getCart(customerId);
  },
};

export const addProductsToCart = {
  path: "/v1.0/cart/add-products",
  method: "POST",
  options: {
    tags: ["api"],
    ...sharedRouteConfig,
    validate: {
      payload: Joi.object()
        .keys({
          products: Joi.array().items(Joi.object({
            sku: Joi.string().required(),
            quantity: Joi.number().required()
          })).required(),
        })
        .required(),
      failAction: (request, h, err) => {
        throw err;
      },
    },
  },
  handler: async (request, h) => {
    const { service } = request.server.app;
    const headerCredentials = request.auth.credentials;
    const token = request.headers.authorization;
    const {products} = request.payload;
    const cartProvider = await service.getCartProvider();
    return await cartProvider.addProductsToCart(token, headerCredentials, products);
  },
};

export const removeProductFromCart = {
  path: "/v1.0/cart/products",
  method: "DELETE",
  options: {
    tags: ["api"],
    ...sharedRouteConfig,
    validate: {
      payload: Joi.object()
        .keys({
            sku: Joi.string().required(),
        })
        .required(),
      failAction: (request, h, err) => {
        throw err;
      },
    },
  },
  handler: async (request, h) => {
    const { service } = request.server.app;
    const headerCredentials = request.auth.credentials;
    const {customerId} = headerCredentials;
    const token = request.headers.authorization;
    const {sku} = request.payload;
    const cartProvider = await service.getCartProvider();
    return await cartProvider.removeProductFromCart(customerId, sku);
  },
};