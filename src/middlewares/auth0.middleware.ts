import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import dotenv from 'dotenv';
import { Auth0User } from '@/interfaces/auth0.interfaces';
dotenv.config();

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || '';
const API_AUDIENCE = process.env.API_AUDIENCE || '';

const client = jwksClient({
    jwksUri: `${AUTH0_DOMAIN}/.well-known/jwks.json`,
});

function getKey(
    header: any,
    callback: (err: Error | null, key?: string) => void,
): void {
    client.getSigningKey(header.kid, (err, key) => {
        if (err || !key) {
            return callback(new Error('Signing key not found'));
        }
        callback(null, key.getPublicKey());
    });
}

export const requiresAuth = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'Authorization header is missing' });
        return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Token is missing' });
        return;
    }

    jwt.verify(
        token,
        getKey,
        {
            audience: API_AUDIENCE,
            issuer: `${AUTH0_DOMAIN}/`,
            algorithms: ['RS256'],
        },
        (err, decoded) => {
            if (err || !decoded) {
                res.status(401).json({
                    error: 'Invalid token',
                    details: err?.message,
                });
                return;
            }

            req.user = decoded as Auth0User;
            next();
        },
    );
};
