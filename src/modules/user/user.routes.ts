import express from 'express';
import { getUserProfiles } from './user.controller';
const userRouter = express.Router();

userRouter.get('/profile', getUserProfiles);

export default userRouter;
