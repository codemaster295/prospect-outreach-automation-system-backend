import { Request, Response } from 'express';
import {
    createCampaign,
    getAllCampaign,
    deleteCampaignById,
    updateCampaignById,
    getCampaign,
    campaignLaunch,
    changeCampaignTemplate,
    bulkDeleteCampaigns,
    getPaginatedCampaign,
    createDefaultSchedule,
} from './campaigns.service';
import { getUserProfile } from '../user/user.service';
import { Op } from 'sequelize';
import { getSentEmail } from '../sent-emails/sent-email.services';

export const getAllCampaigns = async (
    req: Request,   
    res: Response,
): Promise<void> => {
    try {
        const owner = req.user?.sub;
        const search = (req.query.search as string) || '';
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const isPagination = !!req.query.page || !!req.query.limit;
        const offset = (page - 1) * limit;
        if (!owner) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { rows: campaigns, count: total } = await getPaginatedCampaign({
            where: {
                owner,
                name: {
                    [Op.like]: `%${search}%`,
                },
            },
            include: [
                {
                    association: 'sending_account',
                    attributes: ['id', 'senderEmail'],
                },
            ],
            attributes: [
                'id',
                'name',
                'createdAt',
                'updatedAt',
                'status',
                'audience',
                'template',
            ],
            offset,
            limit,
            order: [['createdAt', 'DESC']],
        });
        const user = await getUserProfile(owner);
        const campaignsData = [];
        for (const campaign of campaigns) {
            campaignsData.push({
                ...campaign.dataValues,
                created_by: user.nickname,
            });
        }
        res.status(200).json({
            message: 'Campaigns retrieved successfully',
            campaigns: campaignsData,
        hasMore: page < Math.ceil(total / limit),

            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                perPage: limit,
            },
        });
    } catch (error: any) {
        console.error('Error in getAllCampaigns:', error);
        res.status(500).json({
            error: 'Failed to retrieve campaigns',
            details: error.message,
        });
    }
};
export const bulkDeleteCampaignsByIds = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { ids } = req.body;
        const owner = req.user?.sub;
        if (!owner) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        await bulkDeleteCampaigns(ids, owner);
        res.status(200).json({ message: 'Campaigns deleted successfully' });
    } catch (error: any) {
        console.error('Error in bulkDeleteCampaigns:', error);
        res.status(500).json({
            error: 'Failed to delete campaigns',
            details: error.message,
        });
    }
};
export const getSentEmailForContact = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id, contactId } = req.params;
        const owner = req.user?.sub;
        if (!owner) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const sentEmail = await getSentEmail({
            where: {
                to: contactId,
                campaignId: id,
                owner,
            },
            include: [
                {
                    association: 'base_template',
                    attributes: ['id', 'name'],
                },
            ],
        });
        res.status(200).json({
            message: 'Sent email retrieved successfully',
            sentEmail,
        });
    } catch (error: any) {
        console.error('Error in getSentEmail:', error);
        res.status(500).json({
            error: 'Failed to retrieve sent email',
            details: error.message,
        });
    }
};

export const getCampaignId = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;
        const owner = req.user?.sub;
        if (!owner) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const campaign = await getCampaign({
            where: {
                id,
                owner,
            },
            attributes: [
                'id',
                'name',
                'audience',
                'template',
                'mailbox',
                'status',
                'createdAt',
                'updatedAt',
            ],
        });

        if (!campaign) {
            res.status(404).json({ message: 'Campaign not found' });
            return;
        }

        res.status(200).json({
            message: 'Campaign retrieved successfully',
            campaign,
        });
    } catch (error: any) {
        console.error('Error in getCampaignId:', error);
        res.status(500).json({
            error: 'Failed to retrieve campaign',
            details: error.message,
        });
    }
};
export const createCampaigns = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { name } = req.body;

        if (!name) {
            res.status(400).json({ message: 'Name is required' });
            return;
        }
        const owner = req.user?.sub;
        if (!owner) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // Pass individual arguments instead of an object
        const newCampaign = await createCampaign({
            name,
            owner,
        });
        if (newCampaign.id) {
            await createDefaultSchedule(newCampaign.id);
        }
        res.status(201).json({
            message: 'Campaign created successfully',
            campaign: newCampaign,
        });
    } catch (error: any) {
        console.error('Error in createCampaign:', error);
        res.status(500).json({
            error: 'Failed to create campaign',
            details: error.message,
        });
    }
};
export const updateCampaign = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;
        const owner = req.user?.sub;
        if (!owner) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const updatedCampaign = await updateCampaignById(id, req.body);

        res.status(200).json({
            message: 'Campaign updated successfully',
            campaign: updatedCampaign,
        });
    } catch (error: any) {
        console.error('Error in updateCampaign:', error);
        res.status(500).json({
            error: 'Failed to update campaign',
            details: error.message,
        });
    }
};
export const deleteCampaign = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;

        const owner = req.user?.sub;
        if (!owner) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const campaign = await getCampaign({
            where: {
                id,
                owner,
            },
        });
        if (!campaign) {
            res.status(404).json({ message: 'Campaign not found' });
            return;
        }
        await deleteCampaignById(id);
        res.status(200).json({
            message: 'Campaign deleted successfully',
        });
    } catch (error: any) {
        console.error('Error in deleteCampaigns:', error);
        res.status(500).json({
            error: 'Failed to delete campaign',
            details: error.message,
        });
    }
};
export const launchCampaign = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;
        const owner = req.user?.sub;
        if (!owner) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const campaign = await getCampaign({
            where: {
                id,
                owner,
            },
        });
        if (!campaign) {
            res.status(404).json({ message: 'Campaign not found' });
            return;
        }
        if (!id) {
            res.status(400).json({ error: 'campaignId is required' });
            return;
        }
        const result = await campaignLaunch(id);
        res.status(200).json(result);
        return;
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        return;
    }
};

export const updateCampaignTemplate = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id: campaignId, templateId } = req.params;
        const owner = req.user?.sub;

        if (!owner) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const updatedCampaign = await changeCampaignTemplate({
            campaignId,
            templateId,
            owner,
        });

        res.status(200).json({
            message: 'Campaign template updated successfully',
            campaign: updatedCampaign,
        });
    } catch (error: any) {
        console.error('Error in updateCampaignTemplate:', error);
        res.status(400).json({
            error: error.message || 'Failed to update campaign template',
        });
    }
};
export default {
    getAllCampaigns,
    getCampaignId,
    createCampaigns,
    updateCampaign,
    deleteCampaign,
    launchCampaign,
};
