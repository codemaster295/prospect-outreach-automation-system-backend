import { DB } from '@database/index';
import { FindOptions, UpdateOptions } from 'sequelize';

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
        mailbox?: string | null;
    },
) => {
    return await Campaign.update(data, { where: { id } });
};

export const updateCampaign = async (fields: any, where: any) => {
    return await Campaign.update(fields ?? {}, { where });
};
export const deleteCampaignById = async (id: string) => {
    return await Campaign.destroy({ where: { id } });
};

export const campaignLaunch = async (id: string) => {
    try {
        const campaign = await Campaign.findOne({ where: { id } });

        if (!campaign) {
            throw new Error('Campaign not found');
        }

        if (!campaign.audience || !campaign.template || !campaign.mailbox) {
            throw new Error(
                'Missing required fields: audience, template, or mailbox',
            );
        }

        campaign.status = 'running';
        await campaign.save();

        return { message: 'Campaign launched successfully', campaign };
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export default {
    getAllCampaign,
    createCampaign,
    updateCampaignById,
    deleteCampaignById,
    campaignLaunch,
};
