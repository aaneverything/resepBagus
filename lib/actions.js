'use server';

import { registerSchema } from "@/lib/zod";
import { hashSync } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/zod";
import { compareSync } from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from 'crypto';

function generateOTP(length = 6) {
    return Math.random().toString().slice(-length);
}

async function sendOTPEmail(email, otp) {
    // Konfigurasi transporter sesuai SMTP Anda
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}`,
    });
}


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
            if (!existingUser.emailVerified) {
                const otp = generateOTP();
                const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
                await prisma.user.update({
                    where: { email },
                    data: {
                        otp,
                        otpExpires,
                    },
                });
                await sendOTPEmail(email, otp);
                return {
                    success: true,
                    message: "OTP sent to your email. Please verify.",
                    errors: {},
                    email, // Return email for redirection
                };

            }
            return {
                success: false,
                message: "Email already registered",
                errors: {},
            };


        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                otp,
                otpExpires,
            },
        });

        await sendOTPEmail(email, otp);

        return {
            success: true,
            message: "Registration successful!",
            errors: {},
            email,
        };
    } catch (error) {
        console.error("Registration error:", error);
        return {
            success: false,
            errors: { message: "Something went wrong. Please try again." },
        };
    }
};

// verif otp cik
export const verifyOtp = async (_prevState, formData) => {
    const email = formData.get("email");
    const otp = formData.get("otp");

    if (!email || !otp) {
        return {
            success: false,
            message: "Email dan OTP wajib diisi.",
            errors: {},
        };
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (
        !user ||
        !user.otp ||
        !user.otpExpires ||
        user.otp !== otp ||
        user.otpExpires < new Date()
    ) {
        return {
            success: false,
            message: "Invalid or expired OTP.",
            errors: {},
        };
    }

    await prisma.user.update({
        where: { email },
        data: {
            otp: null,
            otpExpires: null,
            emailVerified: true, // Tandai email sudah diverifikasi
        },
    });

    return {
        success: true,
        message: "OTP verified successfully.",
        errors: {},
    };
};

export const resetPassword = async (_prevState, formData) => {
    const email = formData.get("email");
    const token = formData.get("token");
    const password = formData.get("password");

    if (!email || !token || !password) return { success: false, message: "Data tidak lengkap." };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.resetToken !== token || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
        return { success: false, message: "Token tidak valid atau kadaluarsa." };
    }

    await prisma.user.update({
        where: { email },
        data: {
            password: hashSync(password, 10),
            resetToken: null,
            resetTokenExpiry: null,
        },
    });

    return { success: true, message: "Password berhasil direset. Silakan login." };
};

export const requestPasswordReset = async (_prevState, formData) => {
    const email = formData.get("email");
    if (!email) return { success: false, message: "Email wajib diisi." };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { success: false, message: "Email tidak ditemukan." };

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

    await prisma.user.update({
        where: { email },
        data: { resetToken, resetTokenExpiry },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/resetPassword?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Kirim email
    await sendOTPEmail(email, `Klik link berikut untuk reset password: ${resetUrl}`);

    return { success: true, message: "Link reset password telah dikirim ke email Anda." };
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