import multer, { FileFilterCallback } from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import path from "path";
import { Request } from "express";
import mime from "mime-types"; 

// Configure LocalStack S3
const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
    },
    region: process.env.AWS_REGION || "us-east-1",
    endpoint: process.env.AWS_S3_ENDPOINT || "http://localhost:4566", // LocalStack S3 endpoint
    forcePathStyle: true, // Required for LocalStack
});

// Allowed file extensions
const allowedExtensions = [".png", ".jpg", ".jpeg", ".pdf"];

// File filter to allow only specific file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    const ext = mime.lookup(file.originalname).toLowerCase();
    if(ext){
        cb(null, true);
    }else {
        cb(new Error("Invalid file type!"));
    }
};

// Multer-S3 configuration
const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_S3_BUCKET_NAME || "prospects-files",
        contentType: (req, file, cb) => {
            const contentType = mime.lookup(file.originalname) || "application/octet-stream";
            cb(null, contentType);
        },        
        acl: "public-read", // Change as per requirement (e.g., "private")
        metadata: (req: Request, file: Express.Multer.File, cb: (error: any, metadata?: any) => void) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req: Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),
    fileFilter,
});

export default upload;