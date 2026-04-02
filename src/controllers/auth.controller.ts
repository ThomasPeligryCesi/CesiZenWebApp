import { Request, Response, NextFunction } from 'express';
import {registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema} from "../validators/auth.validator"
import * as authService from '../services/auth.service'

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = registerSchema.safeParse(req.body);
        if( !result.success ) {
            return res.status(400).json({ error: "Validation failed", issues: result.error.issues });
        }
        const { email, password} = result.data;
        const { accessToken, refreshToken, role } = await authService.register(email, password);
        res.status(201).json({ message: "User registered successfully", token: accessToken, refreshToken, role });   
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
        const { accessToken, refreshToken, role } = await authService.login(email, password);
        res.status(200).json({ message: "User logged in successfully", token: accessToken, refreshToken, role });
    } catch (error) {
                if(error instanceof Error && error.message == "Identifiants inconnus") {
            return res.status(401).json({ error: error.message });
        }
            next(error);
   }
}

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ error: "Refresh token requis" });
        }
        const tokens = await authService.refresh(refreshToken);
        res.status(200).json({ token: tokens.accessToken, refreshToken: tokens.refreshToken });
    } catch (error) {
        if (error instanceof Error && error.message === "Refresh token invalide ou expiré") {
            return res.status(401).json({ error: error.message });
        }
        next(error);
    }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            await authService.logout(refreshToken);
        }
        res.status(200).json({ message: "Déconnexion réussie" });
    } catch (error) {
        next(error);
    }
}

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = forgotPasswordSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: "Validation failed", issues: result.error.issues });
        }
        await authService.forgotPassword(result.data.email);
        res.status(200).json({ message: "Si cet email a un compte CesiZen associé, un lien de réinitialisation a été envoyé" });
    } catch (error) {
        next(error);
    }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = resetPasswordSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: "Validation failed", issues: result.error.issues });
        }
        await authService.resetPassword(result.data.token, result.data.password);
        res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
    } catch (error) {
        if (error instanceof Error && error.message === "Token de réinitialisation invalide ou expiré") {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
}