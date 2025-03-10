import { DB } from '@/database/index';
import { Files } from '@/interfaces/files.interfaces';
import { FindOptions } from 'sequelize';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '@/clients/AwsClients';
const File = DB.Files;
export const getAllFiles = async (query: FindOptions<Files>) => {
    try {
        const files = await File.findAll(query);
        return files;
    } catch (error) {
        console.error('Error fetching files:', error);
        throw new Error('Database query failed');
    }
};

export const createFile = async (data: Files) => {
    try {
        const file = await File.create(data);
        return file;
    } catch (error) {
        console.error('Error creating file:', error);
        throw new Error('Database query failed');
    }
};

export const getFile = async (id: string) => {
    try {
        const file = await File.findByPk(id);
        return file;
    } catch (error) {
        console.error('Error fetching file:', error);
        throw new Error('Database query failed');
    }
};

export const generatePresignedUrl = async (
    fileName: string,
    fileType: string,
    bucketName: string,
) => {
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
    }); // URL valid for 1 hour

    return signedUrl;
};

export const getFileFromS3 = async (object_name: string) => {
    const command = new GetObjectCommand({
        Bucket: 'prospects-files',
        Key: object_name,
    });
    console.log(command);
    const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
    });
    console.log(signedUrl);
    return signedUrl;
};
