
import { z } from "zod";

export const createExerciseSchema  = z.object({
    name: z.string(),
    imgUrl: z.string().optional(),
    videoUrl: z.string().optional(), 
    duration: z.number().int(),
    benefits: z.string().optional(),
    level: z.number().int(),
    description: z.string()
});
 export const updateExerciseSchema = createExerciseSchema.partial();