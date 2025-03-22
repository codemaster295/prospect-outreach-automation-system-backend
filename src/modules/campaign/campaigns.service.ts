import { DB } from '@database/index';
import { verifyJWT } from '@/middlewares/jwt.service';
import { JWT_ACCESS_TOKEN_SECRET } from '@/config';
import { FindOptions } from 'sequelize';

const Campaign = DB.Campaigns;

export const getAllCampaign = async (query: FindOptions) => {
    return await Campaign.findAll(query);
};
export const getCampaign = async (query: FindOptions) => {
    return await Campaign.findOne(query);
};
export const createCampaign = async (data: any) => {
    return await Campaign.create(data);
};

export const updateCampaignById = async (
    id: string,
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
    createCampaign,
    updateCampaignById,
    deleteCampaignById,
};
