import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

export const updateRole = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {
        const { role } = req.body;
        if (!role || !['user', 'admin'].includes(role)) {
            return res.status(400).json({ error: "Role invalide (user ou admin)" });
        }
        const user = await userService.updateUserRole(req.params.id, role);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

export const updateState = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {
        const { state } = req.body;
        if (state !== 0 && state !== 1) {
            return res.status(400).json({ error: "State invalide (0 ou 1)" });
        }
        const user = await userService.updateUserState(req.params.id, state);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}
