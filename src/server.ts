import express from 'express';
import cors from 'cors';
import router from '@routes/routes';
import logger from '@utils/logger';
import { DB } from '@database/index';
import { PORT } from './config';
import { errorHandler } from './utils/error-handler';
import { swaggerSpec, swaggerUi } from './utils/swagger';
import cron from 'node-cron';
import axios from 'axios';

const PING_URL = 'https://prospect-ai-backend.codesprintconsulting.com/ping';

const appServer = express();
const port = PORT || 5050;

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};
// appServer.use('/api/contacts', contactRouter);
appServer.use((req, res, next) => {
    const startTime = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

        if (res.statusCode >= 500) {
            logger.error(message);
        } else if (res.statusCode >= 400) {
            logger.warn(message);
        } else {
            logger.info(message);
        }
    });

    next();
});

// Enable CORS
appServer.use(cors(corsOptions));
appServer.options('*', cors(corsOptions));

// Middleware for parsing JSON and URL-encoded bodies
appServer.use(express.json());
appServer.use(express.urlencoded({ extended: true }));

appServer.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use the router with the /api prefix
appServer.use('/', router);
appServer.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' });
});
cron.schedule('*/5 * * * *', async () => {
    try {
        const response = await axios.get(PING_URL);
        console.log(
            `[${new Date().toISOString()}] Pinged successfully: ${
                response.status
            }`,
        );
    } catch (error: any) {
        console.error(
            `[${new Date().toISOString()}] Failed to ping:`,
            error.message,
        );
    }
});
appServer.use(errorHandler);

appServer.all('*', (req, res) => {
    res.status(404).json({ message: 'Sorry! Page not found' });
});

DB.sequelize
    .authenticate()
    .then(() => {
        logger.info('Database connected successfully!');
        appServer.listen(port, () => {
            logger.info(`Server is running on http://localhost:${port}`);
        });
    })
    .catch(error => {
        logger.error('Unable to connect to the database:', error);
    });
