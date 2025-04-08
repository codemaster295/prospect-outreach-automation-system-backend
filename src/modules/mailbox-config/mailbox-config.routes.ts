import express from 'express';
import { requiresAuth } from '@/middlewares/auth0.middleware';
import { createMailboxConfig, disconnectMailbox } from './mailbox-config.controller';
const mailboxConfigRouter = express.Router();

mailboxConfigRouter.post(
    '/create/:mailboxId',
    requiresAuth,
    createMailboxConfig,
);
mailboxConfigRouter.delete('/:mailboxId',requiresAuth,disconnectMailbox)

export default mailboxConfigRouter;
