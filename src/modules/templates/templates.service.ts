import { DB } from '@database/index';
import { verifyJWT } from '@/middlewares/jwt.service';
import { JWT_ACCESS_TOKEN_SECRET } from '@/config';

const Template = DB.Templates;

// export const getAllTemplatesService =  async (accessToken: string) => {
//     const decodeToken = await verifyJWT(
//         accessToken,
//         JWT_ACCESS_TOKEN_SECRET as string,
//     );

//     const templateid = decodeToken.templateid;
//     try {
//         const Templates = await Template.findAll(templateid);
//         return Templates;
//     } catch (error) {
//         console.error('Error fetching Templates:', error);
//         throw new Error('Database query failed');
//     }
// };
export const getAllTemplatesService = async () => {
    return await Template.findAll();
  };
  
export const getTemplateByIdService = async (id: string) => {
    return await Template.findByPk(id);
  };
  
export const createTemplateService = async (subject: string, body: string, owner: string) => {
    return await Template.create({ subject, body, owner });
};

  export const updateTemplateService = async (id: string, subject: string, body: string, owner: string) => {
    const template = await Template.findByPk(id);
    if (!template) return null;
  
    await template.update({ subject, body, owner });
    return template;
  };

  export const deleteTemplateService = async (id: string) => {
    const template = await Template.findByPk(id);
    if (!template) return null;
  
    await template.destroy(); // Soft delete due to `paranoid: true`
    return template;
  };

  export default {
    createTemplateService,
    getAllTemplatesService,
    getTemplateByIdService,
    updateTemplateService,
    deleteTemplateService,
  };