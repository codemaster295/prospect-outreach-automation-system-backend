import express from 'express';
import { requiresAuth } from '@/middlewares/auth0.middleware';
import { createMailboxConfig } from './mailbox-config.controller';
const mailboxConfigRouter = express.Router();

mailboxConfigRouter.post(
    '/create/:mailboxId',
    requiresAuth,
    createMailboxConfig,
);
export default mailboxConfigRouter;
