import Joi from '@hapi/joi';

export const token = {
    path: '/v1.0/security/token',
    method: 'POST',
    options: {
        tags: ['api'],
        auth: false,
        validate: {
          payload: Joi.object().keys({
              sub: Joi.string().required()
            }).required(),
          failAction: (request, h, err) => { throw err; }
        }
      },
      handler: async (request, h) => {
        const { service } = request.server.app;
        const securityHandler = await service.getSecurityHandler();
        return securityHandler.generateToken(request);
    }
};

export const login = {
    method: 'POST',
    path: '/v1.0/security/login',
    options: {
      tags: ['api'],
      validate: {
        payload: Joi.object().keys({
            loginData: Joi.object({
                email: Joi.string().required(),
                password: Joi.string().required(),
                sub: Joi.string().required()
            }).required()
          }).required(),
        failAction: (request, h, err) => { throw err; }
      }
    },
    handler: async (request, h) => {
      const { service } = request.server.app;
      const securityHandler = await service.getSecurityHandler();
      const { email, password, sub } = request.payload.loginData;
      return securityHandler.login(email, password, sub);
    }
  };

