import { authMiddleware } from '@/middlewares/auth.middleware';
import authRouter from '@/modules/auth/auth.routes';
import contactFilerouter from '@/modules/contactFiles/contactFiles.routes';
import contactRouter from '@/modules/contacts/contact.routes';
import userRouter from '@/modules/user/user.routes';
import express from 'express';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/contacts',authMiddleware, contactRouter);
router.use('/contactFile',authMiddleware, contactFilerouter);
export default router;
