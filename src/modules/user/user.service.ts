import axios from 'axios';
import { CustomError } from '@/utils/custom-error';
import { getUserProfile } from './user.repo';

export const getUserProfileService = async (userId: string) => {
    const managementUrl = `${process.env.AUTH0_DOMAIN}/oauth/token`;
    console.log(managementUrl);
    const clientId = process.env.AUTH0_CLIENT_ID;
    const clientSecret = process.env.AUTH0_CLIENT_SECRET;
    const audience = process.env.AUTH0_DOMAIN + '/api/v2/';
    const token = await axios
        .post(managementUrl, {
            client_id: clientId,
            client_secret: clientSecret,
            audience,
            grant_type: 'client_credentials',
        })
        .catch(err => {
            console.log(err);
        });
    if (!token) {
        throw new CustomError('Token not found', 404);
    }
    const user = await getUserProfile(userId, token.data.access_token);
    if (!user) {
        throw new CustomError('User not found', 404);
    }

    return user;
};
