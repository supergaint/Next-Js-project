import {z} from "zod";


export const usernameValidation = z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(/^[a-zA-Z0-9]+$/, "Username must only contain letters and numbers");



    export const signUpSchema = z.object({
        username: usernameValidation,
        email: z
            .string()
            .email("Invalid email address")
            .min(3, "Email must be at least 3 characters long")
            .max(50, "Email must be at most 50 characters long"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .max(15, {message: "Password must be at most 15 characters long"}),
        verifyCode: z
            .string()
            .min(6, "Verify code must be at least 6 characters long")
            .max(6, "Verify code must be at most 6 characters long"),
    })