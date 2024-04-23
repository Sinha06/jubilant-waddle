const Joi = require('@hapi/joi');

module.exports = Joi.object({
  HOSTED_HOST: Joi.string().required(),
  HOSTED_PORT: Joi.number().required()
});
