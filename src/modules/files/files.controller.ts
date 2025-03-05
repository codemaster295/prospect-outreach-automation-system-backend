import { Request, Response } from 'express';
import { getAllFiles, createFile } from './files.service';
import { CustomError } from '@/utils/custom-error';
export const getAllFilesController = async (req: Request, res: Response) => {
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

export const createFileController = async (req: Request, res: Response) => {
    try {
        const user = req.user?.sub;
        const { location = '' } = req.file;
        if (!user) {
            throw new CustomError('User not found', 401);
        }
        const fileData = await createFile({
            fileUrl: location,
            uploadedBy: user,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: undefined,
        });
        res.status(200).json(fileData);
    } catch (error) {
        console.error('Error creating file:', error);
        res.status(500).json({ error: 'Failed to create file' });
    }
};
