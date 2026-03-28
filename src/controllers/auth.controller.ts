import { Request, Response, NextFunction } from 'express';
import {registerSchema, loginSchema} from "../validators/auth.validator"
import * as authService from '../services/auth.service'

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try { 
        const result = registerSchema.safeParse(req.body);
        if( !result.success ) {
            return res.status(400).json({ error: "Validation failed", issues: result.error.issues });
        }
        const { email, password } = result.data;
        const token = await authService.register(email, password);
        res.status(201).json({ message: "User registered successfully", token: token });
    } catch (error) {
        if(error instanceof Error && error.message == "Email déjà utilisé") {
            return res.status(409).json({ error: error.message });
        }
            next(error);
   }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try { 
        const result = loginSchema.safeParse(req.body);
        if( !result.success ) {
            return res.status(400).json({ error: "Validation failed", issues: result.error.issues });
        }
        const { email, password } = result.data;
        const token = await authService.login(email, password);
        res.status(200).json({ message: "User logged in successfully", token: token });
    } catch (error) {
                if(error instanceof Error && error.message == "Identifiants inconnus") {
            return res.status(401).json({ error: error.message });
        }
            next(error);
   }
}