import { Request, Response, NextFunction } from 'express';
import {updateArticleSchema, createArticleSchema} from "../validators/article.validator"
import * as articleService from '../services/article.service'

export const  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = createArticleSchema.safeParse(req.body);
        if( !result.success ) {
            return res.status(400).json({ error: "Validation failed", issues: result.error.issues });
        }
        const {title, content, imgUrl, status, readingTime } = result.data;
        const finalImgUrl = req.file ? `/uploads/${req.file.filename}` : imgUrl;
        const article = await articleService.createArticle({title, content, imgUrl: finalImgUrl, status, readingTime }, res.locals.userId);
        res.status(201).json(article);
    } catch (error) {
            next(error);
   }
}

export const getArticlePage = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const article = await articleService.getArticlePage(page, limit)
        res.status(200).json(article)
    } catch (error){
        next(error)
    }
}

export const  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try { 
        const articles = await articleService.getAllArticle();
        res.status(200).json(articles);
    } catch (error) {
            next(error);
   }
}

export const getById = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try{
        const article = await articleService.getArticleById(req.params.id)
        res.status(200).json(article)
    } catch (error){
        next(error)
    }
}

export const update = async  (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try{
        const result = updateArticleSchema.safeParse(req.body);
        if( !result.success ) {
            return res.status(400).json({ error: "Validation failed", issues: result.error.issues });
        }
        const {title, content, imgUrl, status, readingTime } = result.data;
        const finalImgUrl = req.file ? `/uploads/${req.file.filename}` : imgUrl;
        const article = await articleService.updateArticle({title, content, imgUrl: finalImgUrl, status, readingTime }, req.params.id )
        res.status(200).json(article)
    } catch(error){
        next(error)
    }
}


export const remove = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try{
        const article = await articleService.deleteArticle(req.params.id)
        res.status(204).send()
    } catch (error){
        next(error)
    }
}

export const addFavorite = async (req: Request<{articleId: string}>, res: Response, next: NextFunction) => {
    try{
        const article = await articleService.addFavorite(res.locals.userId, req.params.articleId)
        res.status(201).send();
    } catch (error: any){
        if (error?.code === 'P2002') {
            return res.status(409).json({ error: "Article déjà en favoris" });
        }
        next(error)
    }
}

export const removeFavorite = async (req: Request<{articleId: string}>, res: Response, next: NextFunction) => {
    try{
        const article = await articleService.removeFavorite(res.locals.userId, req.params.articleId)
        res.status(204).send();
    } catch (error){
        next(error)
    }
}


export const getFavorites = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const articles = await articleService.getFavoritesArticles(res.locals.userId)
        res.status(200).json(articles);
    } catch (error){
        next(error)
    }
}

