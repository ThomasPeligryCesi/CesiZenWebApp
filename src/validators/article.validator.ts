
import { z } from "zod";
import { stripHtml, isSafeUrl } from "../utils/sanitize";

export const createArticleSchema  = z.object({
    title: z.string().max(255).transform(stripHtml),
    content: z.string().max(10000).transform(stripHtml),
    imgUrl: z.string().refine(isSafeUrl, { message: "URL non autorisée" }).optional(),
    status: z.coerce.number().int(),
    readingTime: z.coerce.number().int()
});
 export const updateArticleSchema = createArticleSchema.partial();