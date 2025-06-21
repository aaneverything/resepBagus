import { object, string } from 'zod';

export const registerSchema = object({
    email: string().email(),
    name: string().min(2, { message: "Name must be at least 2 characters long" }).max(100),
    password: string().min(6, { message: "Password must be at least 6 characters long" }).max(32),
    confirmPassword: string().min(6, { message: "Confirm Password must be at least 6 characters long" }).max(32),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
export const loginSchema = object({
    email: string().email(),
    password: string().min(6, { message: "Password must be at least 6 characters long" }).max(32),
});