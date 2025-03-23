import { NextFunction, Request, Response } from 'express';
import { getUserProfile } from './user.service';
import { CustomError } from '@/utils/custom-error';

export const getUserProfiles = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user = req.user?.sub;
        if (!user) {
            throw new CustomError('User not found', 401);
        }
        const response = await getUserProfile(user);

        res.status(200).json({ message: 'User data fetched', data: response });
    } catch (error) {
        next(error);
    }
};
