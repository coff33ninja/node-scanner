import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

interface TokenPayload {
    id: string;
    role: string;
}

export const generateTokens = (user: IUser) => {
    const payload: TokenPayload = {
        id: user._id.toString(),
        role: user.role
    };

    // For admin users, don't set an expiration
    const tokenExpiration = user.role === 'admin' ? undefined : '1h';
    const refreshTokenExpiration = user.role === 'admin' ? undefined : '7d';

    const token = jwt.sign(payload, JWT_SECRET, tokenExpiration ? { expiresIn: tokenExpiration } : undefined);
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, refreshTokenExpiration ? { expiresIn: refreshTokenExpiration } : undefined);

    // Calculate expiration date for refresh token (if not admin)
    const refreshTokenExpiresAt = user.role === 'admin' 
        ? undefined 
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    return {
        token,
        refreshToken,
        refreshTokenExpiresAt
    };
};

export const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
    return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
};