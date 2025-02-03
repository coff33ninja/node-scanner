import { Request, Response } from 'express';

export const auditLogger = (req: Request, res: Response, next: Function) => {
    // Log the request details
    console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
    next();
};
