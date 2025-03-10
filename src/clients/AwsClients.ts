import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
console.log(region, accessKeyId, secretAccessKey);
if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error('AWS credentials are not set');
}

export const s3Client = new S3Client({
    region,
    endpoint: 'http://localhost.localstack.cloud:4566',
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
    forcePathStyle: true,
});
