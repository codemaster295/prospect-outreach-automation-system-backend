import { CustomError } from '@/utils/custom-error';
import axios from 'axios';

export const getUserProfile = async (userId: string, accessToken: string) => {
    console.log(accessToken, userId, 'accessToken');
    const user = axios
        .get(
            `https://${process.env.AUTH0_DOMAIN}/users/${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        )
        .catch(err => {
            console.log(err);
        });
    if (!user) {
        throw new CustomError('User not found', 404);
    }
    return user;
};
