import { DB } from '@database/index';
import { verifyJWT } from '@/middlewares/jwt.service';
import { JWT_ACCESS_TOKEN_SECRET } from '@/config';

const Campaign = DB.Campaigns;


export const getAllCampaign = async () => {
    return await Campaign.findAll();
};
export const getCampaignById = async (id: number) => {
    return await Campaign.findByPk(id);
};
export const createCampaign = async (name: string) => {
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
    getAllCampaign,
    getCampaignById,
    createCampaign,
    updateCampaignById,
    deleteCampaignById,
};
