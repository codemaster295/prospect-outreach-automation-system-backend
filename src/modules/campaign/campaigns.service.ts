import { DB } from '@database/index';
import { FindOptions } from 'sequelize';

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

export const updateCampaignById = async (
    id: string,
    data: {
        audience?: string;
        name?: string;
        template?: string;
        delay?: { interval: number; unit: string };
        owner?: string;
        mailbox?: string;
    },
) => {
    return await Campaign.update(data, { where: { id } });
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
            throw new Error('Missing required fields: audience, template, or mailbox');
        }

        campaign.status = 'running';
        await campaign.save();

        return { message: 'Campaign launched successfully', campaign };
    } catch (error:any) {
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
    
    const campaign = await Campaign.findOne({ where: { id: campaignId, owner } });
    if (!campaign) {
      throw new Error('Campaign not found or unauthorized');
    }
  
    
    const template = await Template.findOne({ where: { id: templateId, owner } });
    if (!template) {
      throw new Error('Template not found or unauthorized');
    }
  
  
    if (!template.subject?.trim() || !template.body?.trim()) {
      throw new Error('Template must have both subject and body');
    }
  
    
    await Campaign.update(
      { template: templateId },
      { where: { id: campaignId } }
    );
  
  
    const updated = await Campaign.findOne({ where: { id: campaignId } });
    return updated;
  };


export default {
    getAllCampaign,
    createCampaign,
    updateCampaignById,
    deleteCampaignById,
    campaignLaunch,
    changeCampaignTemplate
};
