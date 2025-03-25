import { DB } from '@database/index';
import { verifyJWT } from '@/middlewares/jwt.service';
import { FindOptions } from 'sequelize';

const Template = DB.Templates;

export const getAllTemplate = async () => {
    return await Template.findAll();
};

export const getTemplateById = async (id: string) => {
    return await Template.findByPk(id);
};

export const getTemplate = async (query: FindOptions) => {
    return await Template.findAll(query);
};
export const getTemplatesByUser = async (userId: string) => {
    return await Template.findAll({
        where: { owner: userId },
    });
};

export const createTemplate = async (data: any) => {
    return await Template.create(data);
};

export const updateTemplateById = async (id: string, data: any) => {
    return await Template.update(data, { where: { id } });
};

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
