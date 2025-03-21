import { DB } from '@database/index';
import { verifyJWT } from '@/middlewares/jwt.service';
import { JWT_ACCESS_TOKEN_SECRET } from '@/config';

const Variable = DB.Variables;

export const createVariable = async (name: string, value: string) => {
    if (typeof name !== 'string' || typeof value !== 'string') {
        throw new Error('Name and Value must be strings');
    }
    return await Variable.create({ name, value });
};

// export const createVariableService = async (name: string, value: string) => {
//     return await Variable.create({ name, value });
// };

export const getAllVariable = async () => {
    return await Variable.findAll();
};

export default {
    createVariable,
    getAllVariable,
};

// export default new VariableService;
