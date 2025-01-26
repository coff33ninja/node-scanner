import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user as any).role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
};

export const isModerator = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && ['admin', 'moderator'].includes((req.user as any).role)) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
};
