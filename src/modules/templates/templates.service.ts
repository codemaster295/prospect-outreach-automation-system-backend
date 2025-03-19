import { DB } from '@database/index';
import { verifyJWT } from '@/middlewares/jwt.service';
import { JWT_ACCESS_TOKEN_SECRET } from '@/config';

const Template = DB.Templates;


export const getAllTemplate = async () => {
    return await Template.findAll();
};

export const getTemplateById = async (id: string) => {
    return await Template.findByPk(id);
};
export const getTemplatesByUser = async (userId: string) => {
    return await Template.findAll({
        where: { owner: userId },
    });
};

export const createTemplate = async (
    subject: string,
    body: string,
    owner: string,
   ) => {
    return await Template.create({ subject, body, owner });
};

export const updateTemplateById = async (
    id: string,
    subject: string,
    body: string,
) => {
    const template = await Template.findByPk(id);
    if (!template) return null;

    await template.update({ subject, body });
    return template;
};
// export const updateTemplateById = async (id:string) => {
//     return await Template.findByPk(id);
//     // if (!template) return null;

//     // await template.update({ subject, body, owner });
//     // return template;
// };

export const deleteTemplate = async (id: string) => {
    const template = await Template.findByPk(id);
    if (!template) return null;

    await template.destroy(); // Soft delete due to `paranoid: true`
    return template;
};

export default {
    createTemplate,
    getAllTemplate,
    getTemplateById,
    updateTemplateById,
    deleteTemplate,
};
