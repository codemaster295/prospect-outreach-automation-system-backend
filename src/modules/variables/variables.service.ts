import { DB } from '@database/index';
import { verifyJWT } from '@/middlewares/jwt.service';
import { JWT_ACCESS_TOKEN_SECRET } from '@/config';

const Variable = DB.Variables;


export const getVariableService =  async (accessToken: string) => {
    const decodeToken = await verifyJWT(
        accessToken,
        JWT_ACCESS_TOKEN_SECRET as string,
    );

    const variableid = decodeToken.variableid;
    try {
        const Variables = await Variable.findAll(variableid);
        return Variables;
    } catch (error) {
        console.error('Error fetching Variables:', error);
        throw new Error('Database query failed');
    }
};

// class VariableService{
//     async getAllvariable() {
//         try {
//             const Variables = await Variable.findAll();
//             return Variables;
//         } catch (error) {
//             console.error('Error fetching Variables:', error);
//             throw new Error('Database query failed');
//         }
//     }

//     async getVariableById (id:string)  {
//         return await Variable.findByPk(id);
//       };

    
//       async createVariable(name: string, value: string) {
//         return await Variable.create({ name, value });
//       };

// }
export const createVariableService = async (name: string, value: string) => {
    if (typeof name !== 'string' || typeof value !== 'string') {
        throw new Error('Name and Value must be strings');
    }
    return await Variable.create({ name, value });
};

// export const createVariableService = async (name: string, value: string) => {
//     return await Variable.create({ name, value });
// };


export const getAllVariables= async() =>{
    return await Variable.findAll();
  }



export default {
    getVariableService,
    createVariableService,
    getAllVariables
};

// export default new VariableService;