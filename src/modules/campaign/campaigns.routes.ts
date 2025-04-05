import express from 'express';
import {
    getAllCampaigns,
    getCampaignId,
    createCampaigns,
    updateCampaign,
    deleteCampaign,
    launchCampaign,
    updateCampaignTemplate,
} from './campaigns.controller';

const campaignRouter = express.Router();

// Get all campaigns
campaignRouter.get('/', getAllCampaigns);

// Get campaign by ID
campaignRouter.get('/:id', getCampaignId);

// Create a new campaign
campaignRouter.post('/create', createCampaigns);

// Update a campaign
campaignRouter.put('/:id', updateCampaign);

// Delete a campaign
campaignRouter.delete('/:id', deleteCampaign);

campaignRouter.post('/launch/:id', launchCampaign);

campaignRouter.put('/:id/change-template/:templateId', updateCampaignTemplate);

export default campaignRouter;
