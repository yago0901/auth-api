import { z } from "zod";

export const registerUserSchema = z.object({

    first_name: z
        .string()
        .min(2, "The number must have more than 2 characters")
        .max(100, "First name must be at most 100 characters"),

    last_name: z
        .string()
        .trim()
        .min(2, "The number must have more than 2 characters")
        .max(100, "Last name must be at most 100 characters"),

    username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters long")
        .max(30, "Username must be at most 30 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "O username pode conter apenas letras, números e _"),

    gender: z
        .enum(["male", "female", "other", "prefer_not_to_say",], { error: "Gênero inválido", }),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email address")
        .max(255, "O e-mail deve ter no máximo 255 caracteres"),

    password: z
        .string()
        .min(8, "A senha deve ter pelo menos 8 caracteres")
        .max(72, "A senha deve ter no máximo 72 caracteres"),
});