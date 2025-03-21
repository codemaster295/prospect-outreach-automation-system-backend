import { request, Request, Response } from 'express';
import {
    getAllFiles,
    createFile,
    generatePresignedUrl,
    getFileFromS3,
} from './files.service';
import { CustomError } from '@/utils/custom-error';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { verifyJWT } from '@/middlewares/jwt.service';
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
        const file_key = `pre_md_files/${user}/${file_uuid}`;
        const file_name = req.query.fileName as string;
        const content_type = req.query.contentType as string;

        const presignedUrl = await generatePresignedUrl(
            file_key,
            content_type,
            'prospects-files',
        );
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
        const object_name = `pre_md_files/${user}/${file_uuid}`;
        const file_url = await getFileFromS3(object_name);
        res.redirect(file_url);
    } catch (error) {
        res.status(500).json({ error: 'Failed to redirect to file' });
    }
};
