import { z } from "zod";

export const registerSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Le mot de passe requiert au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe requiert au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe requiert au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Le mot de passe requiert au moins un caractère spécial"),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});