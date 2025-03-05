import { Auth0User } from '@/interfaces/auth0.interfaces';
import { JwtPayload } from 'jsonwebtoken';
import { MulterS3 } from 'multer-s3';
declare module 'express-serve-static-core' {
    interface Request {
        file?: MulterS3.File;
        user?: Auth0User;
    }
}
