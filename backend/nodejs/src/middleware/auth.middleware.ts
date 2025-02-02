import { Request, Response, NextFunction } from 'express';

interface User {
    id: string;
    email?: string;
    role?: string;
}

interface AuthenticatedRequest extends Request {
    user?: User;
}

import { supabase } from '../config/supabase.config';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        (req as AuthenticatedRequest).user = session.user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid session' });
    }
};

interface AdminRequest extends AuthenticatedRequest {
    user: User; // Keep this as required since we check for it in isAdmin
}

export const isAdmin = (req: AdminRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};
