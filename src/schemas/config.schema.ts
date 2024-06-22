import * as Joi from 'joi';

export const configSchemaValidation = Joi.object({
  PORT: Joi.number().default(5000).required(),
  MONGO_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES: Joi.string().required(),
  // DEBUG: Joi.number().default(0).required(),
});
