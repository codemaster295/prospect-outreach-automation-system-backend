import {
    BlobServiceClient,
    StorageSharedKeyCredential,
} from '@azure/storage-blob';
import { QueueClient } from '@azure/storage-queue';

import dotenv from 'dotenv';
dotenv.config();
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

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

export const sendToAzureQueue = async (queueName: string, task: any) => {
    try {
        if (!connectionString) {
            throw new Error('Azure Storage connection string is not set');
        }
        const queueClient = new QueueClient(connectionString, queueName);

        await queueClient.createIfNotExists(); // optional: ensures queue exists

        const message = Buffer.from(JSON.stringify(task)).toString('base64');
        await queueClient.sendMessage(message);

        console.log(`✅ Message sent to queue "${queueName}"`);
    } catch (error) {
        console.error(
            '❌ Error sending to Azure Queue:',
            (error as Error).message,
        );
        throw error;
    }
};
