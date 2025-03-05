import { Request, Response } from "express";
import contactFilesService, { getContactService } from "./contactFiles.service";

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}



// export const getAllFilesController = async (req: Request, res: Response) => {
//     try {
//         const files = await contactFilesService.getAllFiles();
//         res.json(files);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching files", error });
//     }
// };


export const getAllFilesController = async (req: Request, res: Response): Promise<void> => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            res.status(404).json({ message: 'contactFile not found' });
            return;

        }
        const accessToken = authorization.split(' ')[1];

        const contactFiles = await getContactService(accessToken);
        res.status(200).json({ message: "Data retrieved successfully", contactFiles });
        console.log(contactFiles, "data get")
    } catch (error: any) {
        console.error('Error in getAllFilesController:', error);
        res.status(500).json({ error: 'Failed to retrieve contactFiles', details: error.message });
    }
};

export const getFileByIdController = async (req: Request, res: Response) => {
    try {
        const file = await contactFilesService.getFileById(req.params.id);
        if (!file) return res.status(404).json({ message: " File not found" });
        res.json(file);
    } catch (error) {
        res.status(500).json({ message: " Error fetching file", error });
    }
};

export const createFileController = async (req: Request, res: Response) => {
    try {
        if (!req.file) { res.status(400).json({ message: "File is required" }) };

        const fileUrl = (req.file as any)?.location || "";
        const uploadedBy = (req.context as any).userId;
        // console.log(fileUrl, uploadedBy,"fileUrl, uploadedBy")
        const file = await contactFilesService.createContact(fileUrl, uploadedBy);
        res.status(201).json(file);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error uploading file", error });
    }
};



