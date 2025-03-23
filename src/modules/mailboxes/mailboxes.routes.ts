import express from 'express';
import {
    createMailbox,
    getMailboxes,
    getAllMailboxes,
    assignMailbox,
    getMailboxById,
} from './mailboxes.controller';
import { requiresAuth } from '@/middlewares/auth0.middleware';
const mailboxRouter = express.Router();

mailboxRouter.post('/create', requiresAuth, createMailbox);
mailboxRouter.get('/:email', requiresAuth, getMailboxes);
mailboxRouter.get('/', requiresAuth, getAllMailboxes);
mailboxRouter.get('/mailbox/:id', requiresAuth, getMailboxById);
mailboxRouter.post('/assign', requiresAuth, assignMailbox);
export default mailboxRouter;
