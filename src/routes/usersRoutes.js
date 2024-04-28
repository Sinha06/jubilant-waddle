import Joi from '@hapi/joi';

const sharedRouteConfig = {
    auth: 'jwt_strategy'
  };


export const newUser = {
    path: '/v1.0/users',
    method: 'POST',
    options: {
        tags: ['api'],
        ...sharedRouteConfig,
        validate: {
          payload: Joi.object().keys({
              email: Joi.string().required(),
              password: Joi.string().required(),
              firstName: Joi.string().required(),
              lastName: Joi.string().required()
            }).required(),
          failAction: (request, h, err) => { throw err; }
        }
      },
      handler: async (request, h) => {
        const { service } = request.server.app;
        const userPayload = request.payload;
        const headerCredentials = request.auth.credentials;
        const userProvider = await service.getUserProvider();
        return userProvider.createNewUser(userPayload, headerCredentials);
    }
};