import contactRouter from '@/modules/contacts/contact.routes';
import userRouter from '@/modules/user/user.routes';
import express from 'express';
import filesRouter from '@/modules/files/files.route';
import { requiresAuth } from '@/middlewares/auth0.middleware';
import variableRouter from '@/modules/variables/variables.routes';
import templateRouter from '@/modules/templates/templates.routes';
import campaignRouter from '@/modules/campaign/campaigns.routes';
const router = express.Router();

router.use('/user', requiresAuth, userRouter);
router.use('/contacts', requiresAuth, contactRouter);
router.use('/files', filesRouter);
router.use('/vairables', variableRouter);
router.use('/templates', templateRouter);
router.use('/campaigns', campaignRouter);
export default router;
