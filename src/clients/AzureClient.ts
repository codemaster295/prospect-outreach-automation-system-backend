import {
    BlobServiceClient,
    StorageSharedKeyCredential,
} from '@azure/storage-blob';
import dotenv from 'dotenv';
dotenv.config();
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

if (!accountName || !accountKey || !containerName) {
    throw new Error('Azure Storage credentials are not set');
}

export const sharedKeyCredential = new StorageSharedKeyCredential(
    accountName,
    accountKey,
);
const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential,
);
export const containerClient =
    blobServiceClient.getContainerClient(containerName);
