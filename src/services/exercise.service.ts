import prisma from "../config/prisma";
import { createExerciseSchema, updateExerciseSchema } from "../validators/exercise.validator";
import { z } from "zod";


export async function getExerciseById(id: string) {

    const exercise = await prisma.breathingExercise.findUnique({
        where: { id },
    });
    if (!exercise) {
        throw new Error("Exercise not found");
    }
    return exercise;
}

export async function getAllExercises() {
    return prisma.breathingExercise.findMany()
}

export async function getExercisesPage(page: number, limit: number) {
    const exercises = await prisma.breathingExercise.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
            level: "desc",
        },
    });
    return exercises;
}

export async function createExercise(data: z.infer<typeof createExerciseSchema>) {
    const exercise = await prisma.breathingExercise.create({
        data:{
            ...data
        }
    })
    return exercise;
}

export async function updateExercise(data: z.infer<typeof updateExerciseSchema>, id: string ) {
    const exercise = await prisma.breathingExercise.update({
        where: {id},
        data:{
            ...data,
        }
    })
    return exercise;
}


export async function deleteExercise(id: string) {

    const exercise = await prisma.breathingExercise.delete({
        where: { id },
    });
    return exercise;
}


export async function getFavoritesExercises(userId: string){
    const exercises = await prisma.favoriteExercises.findMany({
        where:{userId},
        include:{exercise: true}
    })
    return exercises
}

export async function addFavorite(userId: string, exerciseId: string){
    const exercise = await prisma.favoriteExercises.create({
        data:{
            userId,
            exerciseId
        }
    })
    return exercise
}

export async function removeFavorite(userId: string, exerciseId: string){
    const exercise = await prisma.favoriteExercises.delete({
        where:{userId_exerciseId: {userId, exerciseId}}
    })
    return exercise
}
