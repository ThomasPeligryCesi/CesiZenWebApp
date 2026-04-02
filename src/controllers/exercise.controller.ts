import { Request, Response, NextFunction } from 'express';
import {updateExerciseSchema, createExerciseSchema} from "../validators/exercise.validator"
import * as exerciseService from '../services/exercise.service'

export const  create = async (req: Request, res: Response, next: NextFunction) => {
    try { 
        const result = createExerciseSchema.safeParse(req.body);
        if( !result.success ) {
            return res.status(400).json({ error: "Validation failed", issues: result.error.issues });
        }
        const {name, videoUrl, duration, benefits, level, description, steps } = result.data;
        const exercise = await exerciseService.createExercise({name, videoUrl, duration, benefits, level, description, steps });
        res.status(201).json(exercise);
    } catch (error) {
            next(error);
   }
}


export const  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try { 
        const exercises = await exerciseService.getAllExercises();
        res.status(200).json(exercises);
    } catch (error) {
            next(error);
   }
}

export const getById = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try{
        const exercise = await exerciseService.getExerciseById(req.params.id)
        res.status(200).json(exercise)
    } catch (error){
        next(error)
    }
}

export const update = async  (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try{
        const result = updateExerciseSchema.safeParse(req.body);
        if( !result.success ) {
            return res.status(400).json({ error: "Validation failed", issues: result.error.issues });
        }
        const {name, videoUrl, duration, benefits, level, description, steps  } = result.data;
        const exercise = await exerciseService.updateExercise({name, videoUrl, duration, benefits, level, description, steps }, req.params.id )
        res.status(200).json(exercise)
    } catch(error){
        next(error)
    }
}


export const remove = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try{
        const exercise = await exerciseService.deleteExercise(req.params.id)
        res.status(204).send()
    } catch (error){
        next(error)
    }
}

export const addFavorite = async (req: Request<{exerciseId: string}>, res: Response, next: NextFunction) => {
    try{
        const exercise = await exerciseService.addFavorite(res.locals.userId, req.params.exerciseId)
        res.status(201).send();
    } catch (error){
        next(error)
    }
}

export const removeFavorite = async (req: Request<{exerciseId: string}>, res: Response, next: NextFunction) => {
    try{
        const exercise = await exerciseService.removeFavorite(res.locals.userId, req.params.exerciseId)
        res.status(204).send();
    } catch (error){
        next(error)
    }
}


export const getFavorites = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const exercises = await exerciseService.getFavoritesExercises(res.locals.userId)
        res.status(200).json(exercises);
    } catch (error){
        next(error)
    }
}

