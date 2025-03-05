import Joi from 'joi';

const options = {
    errors: {
        wrap: {
            label: '',
        },
    },
};

export const validateContacts = (contactData: any) => {
    const schema = Joi.object({
        id: Joi.string()
            .guid({ version: 'uuidv4' })
            .optional()
            .messages({ 'string.guid': 'Contact Id must be in UUID Formate' }),
        userId: Joi.string().required().messages({
            'any.required': 'UserId is required',
        }),
        fileId: Joi.string().required().messages({
            'any.required': 'fileId is required',
        }),
        lastName: Joi.string().required().messages({
            'any.required': 'lastName is required',
        }),
        title: Joi.string().required().messages({
            'any.required': 'title is required',
        }),
        companyName: Joi.string().required().messages({
            'any.required': 'companyName is required',
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Email format is invalid',
            'any.required': 'Email is required',
        }),
        firstPhone: Joi.string().required().messages({
            'any.required': 'firstPhone is required',
        }),
        employees: Joi.string().required().messages({
            'any.required': 'employees is required',
        }),
        industry: Joi.string().required().messages({
            'any.required': 'industry is required',
        }),
        personLinkedinUrl: Joi.string().required().messages({
            'any.required': 'personLinkedinUrl is required',
        }),
        website: Joi.string().required().messages({
            'any.required': 'website is required',
        }),
        companyLinkedinUrl: Joi.string().required().messages({
            'any.required': 'companyLinkedinUrl is required',
        }),
        companyAddress: Joi.string().required().messages({
            'any.required': 'companyLinkedinUrl is required',
        }),
        companyCity: Joi.string().required().messages({
            'any.required': 'companyLinkedinUrl is required',
        }),
        companyState: Joi.string().required().messages({
            'any.required': 'companyLinkedinUrl is required',
        }),
        companyCountry: Joi.string().required().messages({
            'any.required': 'companyLinkedinUrl is required',
        }),
    });
    return schema.validate(contactData, options);
};
