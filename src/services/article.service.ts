import prisma from "../config/prisma";
import { createArticleSchema, updateArticleSchema } from "../validators/article.validator";
import { z } from "zod";


export async function getArticleById(id: string) {

    const article = await prisma.article.findUnique({
        where: { id },
    });
    if (!article) {
        throw new Error("Article not found");
    }
    return article;
}

export async function getAllArticle() {

    const article = await prisma.article.findMany({
        where: { status: 1},
    });
    return article;
}

export async function getArticlePage(page: number, limit: number) {
    const articles = await prisma.article.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
            published: "desc",
        },
    });
    return articles;
}

export async function createArticle(data: z.infer<typeof createArticleSchema>, authorId: string ) {
    const article = await prisma.article.create({
        data:{
            ...data,
            authorId
        }
    })
    return article;
}

export async function updateArticle(data: z.infer<typeof updateArticleSchema>, id: string ) {
    const article = await prisma.article.update({
        where: {id},
        data:{
            ...data,
        }
    })
    return article;
}


export async function deleteArticle(id: string) {

    const article = await prisma.article.delete({
        where: { id },
    });
    return article;
}


export async function getFavoritesArticles(userId: string){
    const articles = await prisma.favoriteArticles.findMany({
        where:{userId},
        include:{article: true}
    })
    return articles
}

export async function addFavorite(userId: string, articleId: string){
    const article = await prisma.favoriteArticles.create({
        data:{
            userId,
            articleId
        }
    })
    return article
}

export async function removeFavorite(userId: string, articleId: string){
    const article = await prisma.favoriteArticles.delete({
        where:{userId_articleId: {userId, articleId}}
    })
    return article
}
