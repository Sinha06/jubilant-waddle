import Joi from '@hapi/joi';

const sharedRouteConfig = {
    auth: 'jwt_strategy'
  };


export const getOrderByReference = {
  path: "/v1.0/orders/{id}",
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
    const orderReference = request.params.id;
    const orderProvider = await service.getOrderProvider();
    return await orderProvider.getOrderByReference(customerId, orderReference);
  },
};

export const saveOrder = {
  path: "/v1.0/orders",
  method: "POST",
  options: {
    tags: ["api"],
    ...sharedRouteConfig,
    validate: {
      payload: Joi.object()
        .keys({
          order: Joi.object({
            shippingDetails: Joi.object({
              shippingAddress: Joi.object({
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                addressLine1: Joi.string().required(),
                postalCode: Joi.string().required(),
                city: Joi.string().required(),
              })
            }).required(),
            billingDetails: Joi.object({
              billingAddress: Joi.object({
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                addressLine1: Joi.string().required(),
                postalCode: Joi.string().required(),
                city: Joi.string().required(),
              })
            }).required(),
          }).required(),
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
    const {order} = request.payload;
    const { customerId } = headerCredentials;
    const orderProvider = await service.getOrderProvider();
    return await orderProvider.saveOrder(customerId, order);
  },
};

export const getCustomerOrders = {
  path: "/v1.0/orders",
  method: "GET",
  options: {
    tags: ["api"],
    ...sharedRouteConfig,
    validate: {
      query: Joi.object({
        limit: Joi.number().required(),
        skip: Joi.number().required()
      }),
      failAction: (request, h, err) => {
        throw err;
      },
    },
  },
  handler: async (request, h) => {
    const { service } = request.server.app;
    const headerCredentials = request.auth.credentials;
    const { customerId } = headerCredentials;
    const { limit, skip } = request.query;
    const orderProvider = await service.getOrderProvider();
    return await orderProvider.getCustomerOrders(customerId, limit, skip);
  },
};
