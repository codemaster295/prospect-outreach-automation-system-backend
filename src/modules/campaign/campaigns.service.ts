import { DB } from '@database/index';
import { verifyJWT } from '@/middlewares/jwt.service';
import { JWT_ACCESS_TOKEN_SECRET } from '@/config';

const Campaign = DB.Campaigns;

// export const getAllCampaignService =  async (accessToken: string) => {
//     const decodeToken = await verifyJWT(
//         accessToken,
//         JWT_ACCESS_TOKEN_SECRET as string,
//     );

//     const campaignsid = decodeToken.campaignsid;
//     try {
//         const Campaigns = await Campaign.findAll(campaignsid);
//         return Campaigns;
//     } catch (error) {
//         console.error('Error fetching Campaigns:', error);
//         throw new Error('Database query failed');
//     }
// };

export const getAllCampaignService = async () => {
    return await Campaign.findAll();
};
export const getCampaignByIdService = async (id: number) => {
    return await Campaign.findByPk(id);
};
export const createCampaignService = async (name: string) => {
    return await Campaign.create({
        name,
    });
};

export const updateCampaignById = async (
    id: number,
    data: {
        audience?: string;
        name?: string;
        template?: string;
        delay?: { interval: number; unit: string };
        owner?: string;
    },
) => {
    return await Campaign.update(data, { where: { id } });
};

export const deleteCampaignById = async (id: string) => {
    return await Campaign.destroy({ where: { id } });
};
export default {
    getAllCampaignService,
    getCampaignByIdService,
    createCampaignService,
    updateCampaignById,
    deleteCampaignById,
};
