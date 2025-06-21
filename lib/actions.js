'use server';

import { registerSchema } from "@/lib/zod";
import { hashSync } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/zod";
import { compareSync } from "bcryptjs";
import { signIn } from "next-auth/react";


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
                message: "Email already registered",
                errors: {},
            };
        }

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return {
            success: true,
            message: "Registration successful!",
            errors: {},
        };
    } catch (error) {
        console.error("Registration error:", error);
        return {
            success: false,
            errors: { message: "Something went wrong. Please try again." },
        };
    }
};


export const loginCredentials = async (_prevState, formData) => {
    const values = Object.fromEntries(formData.entries());
    const validation = loginSchema.safeParse(values);

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

    const { email, password } = validation.data;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !compareSync(password, user.password)) {
            return {
                success: false,
                message: "Invalid email or password.",
                errors: {},
            };
        }

        return {
            success: true,
            email,
            password,
            errors: {},
        };
    } catch (error) {
        console.error("Error during login:", error);
        return {
            success: false,
            message: "Something went wrong. Please try again.",
            errors: {},
        };
    }
};