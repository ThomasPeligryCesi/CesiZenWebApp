
import { z } from "zod";
import { stripHtml, isSafeUrl } from "../utils/sanitize";

export const createExerciseSchema  = z.object({
    name: z.string().max(255).transform(stripHtml),
    imgUrl: z.string().refine(isSafeUrl, { message: "URL non autorisée" }).optional(),
    videoUrl: z.string().refine(isSafeUrl, { message: "URL non autorisée" }).optional(),
    duration: z.coerce.number().int(),
    benefits: z.string().max(1000).transform(stripHtml).optional(),
    level: z.coerce.number().int(),
    description: z.string().max(5000).transform(stripHtml),
    steps: z.preprocess((val) => typeof val === "string" ? JSON.parse(val) : val, z.array(z.number().int()))
});
 export const updateExerciseSchema = createExerciseSchema.partial();