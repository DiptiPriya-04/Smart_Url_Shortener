import { z } from "zod";

export const signupBodySchema = z.object({
    firstname: z.string(),
    lastname: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
});

export const loginBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(3),
});

export const shortenBodySchema = z.object({
    url: z.string().url(),
    code: z.string().optional(),
});

export const acceptCodeSchema = z.object({
    email: z.string().email(),
    providedCode: z.number().int(),
});

export const changePasswordSchema = z.object({
    oldPassword: z.string().min(3),
    newPassword: z.string().min(3),
});

export const acceptFPCodeSchema = z.object({
    email: z.string().email(),
    providedCode: z.number().int(),
    newPassword: z.string().min(3),
});

export const changeNameSchema = z.object({
    firstname: z
        .string()
        .min(2, "First name must have at least 2 characters.")
        .max(55, "First name must not exceed 55 characters."),
    lastname: z
        .string()
        .max(55, "Last name must not exceed 55 characters.")
        .optional()
        .or(z.literal("")), // allows empty string
});
