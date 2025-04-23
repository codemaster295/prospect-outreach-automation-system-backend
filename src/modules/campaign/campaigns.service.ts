import { DB } from '@database/index';
import { FindOptions, Op } from 'sequelize';
import { createScheduleBulk } from '../schedule/schedules.services';

const Campaign = DB.Campaigns;
const Template = DB.Templates;
export const getAllCampaign = async (query: FindOptions) => {
    return await Campaign.findAll(query);
};
export const getCampaign = async (query: FindOptions) => {
    return await Campaign.findOne(query);
};
export const createCampaign = async (data: any) => {
    return await Campaign.create(data);
};
export const getTotalCampaigns = async (query: FindOptions) => {
    return await Campaign.count(query);
};
export const bulkDeleteCampaigns = async (ids: string[], owner: string) => {
    return await Campaign.destroy({ where: { id: { [Op.in]: ids }, owner } });
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

export const createDefaultSchedule = async (campaignId: string) => {
    const days = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
    ];
    const defaultSchedule = days.map((day: string) => ({
        day,
        count: 5,
        delay: 300000, // 5 minutes
        campaign: campaignId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }));
    return await createScheduleBulk(defaultSchedule);
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
export const changeCampaignTemplate = async ({
    campaignId,
    templateId,
    owner,
}: {
    campaignId: string;
    templateId: string;
    owner: string;
}) => {
    const campaign = await Campaign.findOne({
        where: { id: campaignId, owner },
    });
    if (!campaign) {
        throw new Error('Campaign not found or unauthorized');
    }

    const template = await Template.findOne({
        where: { id: templateId, owner },
    });
    if (!template) {
        throw new Error('Template not found or unauthorized');
    }

    if (!template.subject?.trim() || !template.body?.trim()) {
        throw new Error('Template must have both subject and body');
    }

    await Campaign.update(
        { template: templateId },
        { where: { id: campaignId } },
    );

    const updated = await Campaign.findOne({ where: { id: campaignId } });
    return updated;
};
export const getPaginatedCampaign = (query: any) => {
    return Campaign.findAndCountAll(query);
};



export default {
    getAllCampaign,
    createCampaign,
    updateCampaignById,
    deleteCampaignById,
    campaignLaunch,
    changeCampaignTemplate,
};
