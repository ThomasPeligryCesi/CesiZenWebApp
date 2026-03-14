import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
 export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const authorization = req.headers.authorization;
    const token = authorization?.slice("Bearer ".length).trim();
    if (!authorization || !token) {
        return res.status(401).json({message: 'No token provided'});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        if(typeof decoded === 'string') {
            return res.status(401).json({
                message: 'Invalid token',
                success: false
            });
        }
        res.locals.userId = decoded.userId;
        res.locals.role = decoded.role;
        next();
    } catch (error) {
        return res.status(401).json({message: 'Invalid token'});
    }
}