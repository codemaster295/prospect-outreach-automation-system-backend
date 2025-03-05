
import Joi from "joi";

const options = {
    errors:{
        wrap:{
            label:'',
        },
    },
};

export const validateContacts = (contactFileData: any) =>{
    const schema = Joi.object({
        id:Joi.string()
        .guid({version:'uuidv4'})
        .optional()
        .messages({'string.guid':'Contact Id must be in UUID Formate'}),
        fileUrl:Joi.string().required()
        .messages({
            'any.required':"UserId is required"
        }),
        uploadedBy:Joi.string().required()
        .messages({
            'any.required':"fileId is required"
        }),
       
    });
    return schema.validate(contactFileData,options);
};