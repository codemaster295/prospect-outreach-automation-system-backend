import { NextFunction, Request, Response } from 'express';
import { getUserProfileService } from './user.service';
import { CustomError } from '@/utils/custom-error';

export const getUserProfileController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user = req.user?.sub;
        if (!user) {
            throw new CustomError('User not found', 401);
        }
        const response = await getUserProfileService(user);

        res.status(200).json({ message: 'User data fetched', data: response });
    } catch (error) {
        next(error);
    }
};
