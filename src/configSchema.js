import Joi from '@hapi/joi';

export default Joi.object().keys({
  HOSTED_HOST: Joi.string().required(),
  HOSTED_PORT: Joi.number().required(),
  TOKEN_VALIDATIONKEY: Joi.string().required(),
  MONGO_DB_URL: Joi.string().required()
});
