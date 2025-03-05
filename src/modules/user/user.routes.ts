import express from 'express';
import { getUserProfileController } from './user.controller';
const userRouter = express.Router();

userRouter.get('/profile', getUserProfileController);

export default userRouter;
