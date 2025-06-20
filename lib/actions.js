'use server';

import { registerSchema } from "@/lib/zod";
import { hashSync } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const registerCredentials = async (_prevState, formData) => {
    const values = Object.fromEntries(formData.entries());

    const validation = registerSchema.safeParse(values);

    if (!validation.success) {
        const formattedErrors = {};
        validation.error.errors.forEach((err) => {
            formattedErrors[err.path[0]] = err.message;
        });

        return {
            success: false,
            errors: formattedErrors,
        };
    }

    const { email, name, password } = validation.data;
    const hashedPassword = hashSync(password, 10);

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return {
                success: false,
                errors: { email: "Email already registered" },
            };
        }

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return { success: true, errors: {} };
    } catch (error) {
        console.error("Registration error:", error);
        return {
            success: false,
            errors: { general: "Something went wrong. Please try again." },
        };
    }
};
