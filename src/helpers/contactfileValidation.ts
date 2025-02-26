// eslint-disable-next-line no-unused-vars
import { Schema, ValidateOptions } from 'yup';

function contactfileValidation<T>(schema: Schema<T>, value: T | any, options?: ValidateOptions): T {
  return schema.validateSync(value, {
    abortEarly: false,
    stripUnknown: true,
    ...options,
  });
}

export default contactfileValidation;
