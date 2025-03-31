import { config } from 'dotenv';

config();

export const { PORT, NODE_ENV, BASE_URL, JWT_REFRESH_TOKEN_SECRET } =
    process.env;

export const {
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    DB_HOST,
    DB_DIALECT,
    DB_DATABASE,
} = process.env;
