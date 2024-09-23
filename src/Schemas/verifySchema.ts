import {z} from "zod";


export const verifySchema = z.object({
    verifyCode: z
        .string()
        .min(6, "Verify code must be at least 6 characters long")
        .max(6, "Verify code must be at most 6 characters long"),
})