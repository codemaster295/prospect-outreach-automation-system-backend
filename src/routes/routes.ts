import contactRouter from '@/modules/contacts/contact.routes';
import userRouter from '@/modules/user/user.routes';
import express from 'express';
import filesRouter from '@/modules/files/files.route';
import { requiresAuth } from '@/middlewares/auth0.middleware';
const router = express.Router();

router.use('/user', requiresAuth, userRouter);
router.use('/contacts', requiresAuth, contactRouter);
router.use('/files', filesRouter);
export default router;
