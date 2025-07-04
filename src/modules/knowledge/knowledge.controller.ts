
import { Request, Response } from 'express';
import { crawlAndStoreKnowledge } from './knowledge.service';

import { DB } from '@database/index';
import { logger } from '@/utils/logger';

/**
 * POST /api/knowledge/crawl
 * Body: { urls: string[], campaign_id: string, contact_id: string }
 */
export const createKnowledge = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const userId = req.user?.sub || 'test-user';
   
    const { urls, campaign_id, contact_id } = req.body;

    // Basic validation
    if (!Array.isArray(urls) || urls.length === 0) {
      res.status(400).json({ error: 'Please provide a non-empty array of URLs' });
      return;
    }

    if (!campaign_id || !contact_id) {
      res.status(400).json({ error: 'campaign_id and contact_id are required' });
      return;
    }

    // Validate if campaign_id and contact_id exist
    const campaign = await DB.Campaigns.findByPk(campaign_id);
    const contact = await DB.Contacts.findByPk(contact_id);

    if (!campaign || !contact) {
      res.status(400).json({ error: 'Invalid campaign_id or contact_id' });
      return;
    }

    const savedPages = await crawlAndStoreKnowledge(urls, campaign_id, contact_id);

    res.status(201).json({
      message: 'Knowledge entries created successfully',
      totalSaved: savedPages.length,
      savedPages,
    });
  } catch (error: any) {
    logger.error('❌ Error in createKnowledge controller:', error);
    res.status(500).json({
      error: 'Failed to create knowledge entries',
      details: error.message,
    });
  }
};