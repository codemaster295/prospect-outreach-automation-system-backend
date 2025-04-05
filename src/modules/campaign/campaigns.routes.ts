import express from 'express';
import {
    getAllCampaigns,
    getCampaignId,
    createCampaigns,
    updateCampaign,
    deleteCampaign,
    launchCampaign,
} from './campaigns.controller';
import { requiresAuth } from '@/middlewares/auth0.middleware';

const campaignRouter = express.Router();

// Get all campaigns
campaignRouter.get('/', requiresAuth, getAllCampaigns);

// Get campaign by ID
campaignRouter.get('/:id', requiresAuth, getCampaignId);

// Create a new campaign
campaignRouter.post('/create', requiresAuth, createCampaigns);

// Update a campaign
campaignRouter.put('/:id', requiresAuth, updateCampaign);

// Delete a campaign
campaignRouter.delete('/:id', requiresAuth, deleteCampaign);

campaignRouter.post('/launch/:id', requiresAuth, launchCampaign);

export default campaignRouter;
