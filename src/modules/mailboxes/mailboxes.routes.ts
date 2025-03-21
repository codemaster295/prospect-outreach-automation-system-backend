import express from 'express';
import { createMailbox, getMailboxes } from './mailboxes.controller';
import { requiresAuth } from '@/middlewares/auth0.middleware';
const mailboxRouter = express.Router();

mailboxRouter.post('/create', requiresAuth, createMailbox);
mailboxRouter.get('/:email', requiresAuth, getMailboxes);
export default mailboxRouter;
