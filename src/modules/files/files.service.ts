import { DB } from '@/database/index';
import { Files } from '@/interfaces/files.interfaces';
import { FindAndCountOptions, FindOptions, DestroyOptions } from 'sequelize';
import { containerClient, sharedKeyCredential } from '@/clients/AzureClient';
import {
    BlobSASPermissions,
    generateBlobSASQueryParameters,
} from '@azure/storage-blob';
const File = DB.Files;
const Contact = DB.Contacts;
export const getAllFiles = async (query: FindOptions<Files>) => {
    try {
        const files = await File.findAll(query);
        return files;
    } catch (error) {
        console.error('Error fetching files:', error);
        throw new Error('Database query failed');
    }
};
export const getAllFilesData = async (options: FindAndCountOptions) => {
    return File.findAndCountAll(options);
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
) => {
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    if (!process.env.AZURE_STORAGE_CONTAINER_NAME) {
        throw new Error('Azure Storage container name is not set');
    }
    const sasOptions = {
        containerName: process.env.AZURE_STORAGE_CONTAINER_NAME,
        blobName: fileName,
        permissions: BlobSASPermissions.parse('cw'), // Create and Write permissions
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // 1 hour
        contentType: fileType,
    };
    const sasToken = generateBlobSASQueryParameters(
        sasOptions,
        sharedKeyCredential,
    ).toString();
    const sasUrl = `${blockBlobClient.url}?${sasToken}`;
    return sasUrl;
};

export const getFileFromAzure = async (object_name: string) => {
    const blockBlobClient = containerClient.getBlockBlobClient(object_name);
    const exists = await blockBlobClient.exists();
    if (!exists) {
        throw new Error('File does not exist');
    }
    // Create a SAS token for reading
    const sasOptions = {
        containerName: process.env.AZURE_STORAGE_CONTAINER_NAME || '',
        blobName: object_name,
        permissions: BlobSASPermissions.parse('r'), // Read permission only
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // 1 hour
    };

    // Generate SAS token
    const sasToken = generateBlobSASQueryParameters(
        sasOptions,
        sharedKeyCredential,
    ).toString();

    // Construct the URL with SAS token
    const sasUrl = `${blockBlobClient.url}?${sasToken}`;
    console.log(`Generated read URL for ${object_name}: ${sasUrl}`);
    return sasUrl;
};

export const deleteFilesByIds = async (query: DestroyOptions) => {
    const deletedCount = await File.destroy(query);
    return deletedCount;
};
