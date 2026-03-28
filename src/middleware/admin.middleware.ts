import {Request, Response, NextFunction} from 'express';
 export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const role = res.locals.role;
    if (role !== 'admin') {
        return res.status(403).json({message: 'Access denied'});
    }
    next();
}