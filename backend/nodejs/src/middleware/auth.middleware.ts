import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase.config';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        (req as any).user = session.user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid session' });
    }
};