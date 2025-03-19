import { CustomError } from '@/utils/custom-error';
import axios from 'axios';

export const getUserProfile = async (userId: string, accessToken: string) => {
    try {
        const user = await axios.get(
            `${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        return user.data;
    } catch (error) {
        console.log(error);
        throw new CustomError('User not found', 404);
    }
};
