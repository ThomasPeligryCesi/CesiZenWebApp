
import { z } from "zod";

export const createArticleSchema  = z.object({
    title: z.string(),
    content: z.string(),
    imgUrl: z.string().optional(),
    status: z.number().int(),
    readingTime: z.number().int()
});
 export const updateArticleSchema = createArticleSchema.partial();