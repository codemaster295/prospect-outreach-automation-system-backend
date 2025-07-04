import Joi from 'joi';

export const crawlRequestSchema = Joi.object({
  urls: Joi.array()
    .items(Joi.string().uri().label('URL'))
    .min(1)
    .required()
    .label('URLs')
    .messages({
      'array.base': `"urls" should be an array of valid URLs`,
      'array.min': `"urls" must contain at least one URL`,
      'string.uri': `"urls" must contain only valid URLs`,
      'any.required': `"urls" is required`,
    }),
});