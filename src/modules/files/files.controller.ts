import { request, Request, Response } from 'express';
import {
    getAllFiles,
    createFile,
    generatePresignedUrl,
    getFileFromAzure,
    getAllFilesData,
    deleteFilesByIds,
} from './files.service';
import { v4 as uuidv4 } from 'uuid';
import { CustomError } from '@/utils/custom-error';
import jwt from 'jsonwebtoken';
import { verifyJWT } from '@/middlewares/jwt.service';
import { updateCampaignById } from '@/modules/campaign/campaigns.service';
import { Op, where, fn, col } from 'sequelize';
import { deleteContactsBulk } from '../contacts/contacts.service';
export const getAllfiledata = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const owner = req.user?.sub;
        if (!owner) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const search = (req.query.search as string) || '';
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = 0 + (page - 1) * limit;

        const searchFilter = search
            ? {
                  [Op.or]: [
                      where(
                          fn('LOWER', col('fileName')),
                          'LIKE',
                          `%${search.toLowerCase()}%`,
                      ),
                      where(
                          fn('LOWER', col('fileUrl')),
                          'LIKE',
                          `%${search.toLowerCase()}%`,
                      ),
                  ],
              }
            : {};

        const { rows: files, count: total } = await getAllFilesData({
            where: {
                uploadedBy: owner,
                ...searchFilter,
            },
            offset,
            limit,
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            message: 'Files retrieved successfully',
            files,
            hasMore:  page < Math.ceil(total / limit),
            pagination: {
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                perPage: limit,
            },
        });
    } catch (error: any) {
        console.error('Error in getAllfiledata:', error);
        res.status(500).json({
            error: 'Failed to retrieve files',
            details: error.message,
        });
    }
};

export const getAllFile = async (req: Request, res: Response) => {
    try {
        const user = req.user?.sub;
        if (!user) {
            throw new CustomError('User not found', 401);
        }
        const files = await getAllFiles({
            where: {
                uploadedBy: user,
            },
        });
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get files' });
    }
};

export const generatePresignedByUrl = async (req: Request, res: Response) => {
    try {
        const user = req.user?.sub;
        if (!user) {
            throw new CustomError('User not found', 401);
        }
        const file_uuid = uuidv4();
        const file_key = `contact_files/${user}/${file_uuid}`;
        const file_name = req.query.fileName as string;
        const content_type = req.query.contentType as string;

        const presignedUrl = await generatePresignedUrl(file_key, content_type);
        const token = jwt.sign(
            { file_uuid, file_name },
            process.env.JWT_SECRET as string,
        );
        res.status(200).json({
            presignedUrl,
            token,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate presigned url' });
    }
};

export const createFiles = async (req: Request, res: Response) => {
    try {
        const user = req.user?.sub;
        const campaignId = req.params.campaignId;
        if (!user) {
            throw new CustomError('User not found', 401);
        }
        if (!req.body.payload) {
            throw new CustomError('Payload not found', 401);
        }
        const payload = await verifyJWT(
            req.body.payload,
            process.env.JWT_SECRET as string,
        );
        const file_uuid = payload.file_uuid;
        const file_name = payload.file_name;
        // const file_path = `pre_md_files/${user}/${file_uuid}`;
        const frontend_url = `${process.env.FRONTEND_URL}/s/${user}/${file_uuid}/${file_name}`;
        const fileData = await createFile({
            fileUrl: frontend_url,
            uploadedBy: user,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: undefined,
        });

        await updateCampaignById(campaignId, {
            audience: fileData.id,
        });

        res.status(200).json(fileData);
    } catch (error) {
        console.log(error, 'error');
        res.status(500).json({ error: 'Failed to upload file' });
    }
};

export const redirectToFile = async (req: Request, res: Response) => {
    try {
        const user = req.params.userId;
        const file_uuid = req.params.uuid;
        const object_name = `contact_files/${user}/${file_uuid}`;
        const file_url = await getFileFromAzure(object_name);
        res.redirect(file_url);
    } catch (error) {
        res.status(500).json({ error: 'Failed to redirect to file' });
    }
};
export const deleteFilesBulk = async (req: Request, res: Response) => {
    try {
        const user = req.user?.sub;
        const fileIds: string[] = req.body.fileIds;

        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (!Array.isArray(fileIds) || fileIds.length === 0) {
            res.status(400).json({ message: 'No file IDs provided' });
            return;
        }
        await deleteContactsBulk({
            where: {
                fileId: {
                    [Op.in]: fileIds,
                },
                userId: user,
            },
        });
        await deleteFilesByIds({
            where: {
                id: {
                    [Op.in]: fileIds,
                },
                uploadedBy: user,
            },
        });
        res.status(200).json({ message: 'Files deleted successfully' });
    } catch (error: any) {
        console.error('Error in deleteFilesBulk:', error);
        res.status(500).json({
            error: 'Failed to delete files',
            details: error.message,
        });
    }
};
