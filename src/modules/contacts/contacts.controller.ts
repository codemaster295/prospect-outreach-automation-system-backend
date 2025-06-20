import { Request, Response } from 'express';
import axios from 'axios';
import { getFile } from '../files/files.service';
import * as ContactService from './contacts.service';
import { Op, fn, col, where } from 'sequelize';
import Papa from 'papaparse';
export const getAllContacts = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?.sub;
        const { fileId } = req.params;
        const campaignId = req.query.campaignId as string;
        if (!userId) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const search = (req.query.search as string) || '';
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const isPagination = !!req.query.page || !!req.query.limit;
        console.log('is pagination', isPagination);
        const offset = 0 + (page - 1) * limit;

        const searchFilter = search
            ? {
                  [Op.or]: [
                      where(
                          fn('LOWER', col('firstName')),
                          'LIKE',
                          `%${search.toLowerCase()}%`,
                      ),
                      where(
                          fn('LOWER', col('lastName')),
                          'LIKE',
                          `%${search.toLowerCase()}%`,
                      ),
                      where(
                          fn('LOWER', col('email')),
                          'LIKE',
                          `%${search.toLowerCase()}%`,
                      ),
                      where(
                          fn('LOWER', col('title')),
                          'LIKE',
                          `%${search.toLowerCase()}%`,
                      ),
                      where(
                          fn('LOWER', col('companyName')),
                          'LIKE',
                          `%${search.toLowerCase()}%`,
                      ),
                  ],
              }
            : {};
        // Handle paginated + searchable response
        const { rows: contacts, count: total } =
            await ContactService.getPaginatedContacts({
                where: {
                    fileId,
                    userId,
                    ...searchFilter,
                },
                include: {
                    association: 'emailSent',
                    attributes: ['id'],
                    where: {
                        campaignId,
                    },
                    required: false,
                    as: 'emailSent',
                },
                offset,
                limit,
                order: [['createdAt', 'DESC']],
            });

        res.status(200).json({
            message: 'Data retrieved successfully',
            data: contacts,
            hasMore: page < Math.ceil(total / limit),

            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                perPage: limit,
            },
        });
    } catch (error: any) {
        console.error('Error in getAllContacts:', error);
        res.status(500).json({
            error: 'Failed to retrieve contacts',
            details: error.message,
        });
    }
};

export const getCountOfContacts = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const { fileId } = req.params;
    const count = await ContactService.getCountOfContacts(fileId);
    res.status(200).json({
        message: 'Count of contacts retrieved successfully',
        count,
    });
};
export const createContact = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?.sub;
        const { fileId } = req.params;

        if (!userId) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const { mappings } = req.body;
        if (!mappings) {
            res.status(400).json({ error: 'Mappings are required' });
            return;
        }
        const file = await getFile(fileId);
        if (!file) {
            res.status(404).json({ error: 'File not found' });
            return;
        }
        const fileUrl = file.fileUrl;
        //check if file is a csv file and if not return error
        const fileData = await axios.get(fileUrl, {
            responseType: 'arraybuffer',
        });
        const fileType = fileData.headers['content-type'];
        if (fileType !== 'text/csv') {
            res.status(400).json({ error: 'Invalid file type' });
            return;
        }
        const csvData = new TextDecoder().decode(fileData.data);

        //reverse the mappings
        const reverseMapping: any = {};
        Object.keys(mappings).forEach(key => {
            reverseMapping[mappings[key]] = key;
        });
        //read the buffer as CSV and parse it
        Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            transformHeader: (header: string) => {
                return reverseMapping[header] || header;
            },
            complete: async (results: any) => {
                if (results.errors.length) {
                    res.status(400).json({ error: 'Invalid file format' });
                    return;
                }
                console.log(
                    results.data?.every((row: any) =>
                        new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(
                            row.email,
                        ),
                    ),
                );
                const prepareData = results.data.map((row: any) => {
                    return {
                        ...row,
                        userId: userId,
                        fileId: fileId,
                    };
                });
                await ContactService.createBulkContacts(prepareData);
                res.status(200).json({
                    message: 'Contacts created successfully',
                });
            },
        });
    } catch (error: any) {
        console.error('Error in createContact:', error);
        res.status(500).json({
            error: 'Failed to create contact',
            details: error.message,
        });
    }
};

export const getContactByFileId = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const { fileId } = req.params;
    const owner = req.user?.sub;
    if (!owner) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    const contacts = await ContactService.getAllContacts({
        where: { fileId, userId: owner },
    });
    res.status(200).json(contacts);
};

export const deleteContactsBulk = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?.sub;
        const { ids } = req.body;

        if (!userId) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (!Array.isArray(ids) || ids.length === 0) {
            res.status(400).json({ error: 'No contact IDs provided' });
            return;
        }

        const deletedCount = await ContactService.deleteContactsBulk({
            where: {
                id: {
                    [Op.in]: ids,
                },
                userId,
            },
        });
        res.status(200).json({
            message: 'Contacts deleted successfully',
            deletedCount,
        });
    } catch (error: any) {
        console.error('Error in deleteContactsBulk:', error);
        res.status(500).json({
            error: 'Failed to delete contacts',
            details: error.message,
        });
    }
};
export const updateAudienceForCampaignByFileId = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?.sub;
        const { fileId } = req.params;
        const { audience } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

        if (!fileId || !audience) {
            res.status(400).json({ error: 'Missing fileId or audience' });
            return;
        }

        const updatedCount = await ContactService.updateAudienceByFileId({
            fileId,
            userId,
            audience,
        });

        res.status(200).json({
            message: 'Campaign audience updated successfully',
            updatedCount,
        });
    } catch (error: any) {
        console.error('Error in updateAudienceForCampaignByFileId:', error);
        res.status(500).json({
            error: 'Failed to update campaign audience',
            details: error.message,
        });
    }
};
