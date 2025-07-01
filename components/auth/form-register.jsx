"use client";

import { use, useActionState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { registerCredentials } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RegisterButton } from '../atoms/Button';

const initialState = {
    success: false,
    errors: {},
};

const FormRegister = () => {
    const [state, formAction] = useActionState(registerCredentials, initialState);
    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            router.push(`/verifyOtp?email=${encodeURIComponent(state.email)}`);
        }
    }, [state?.success, state?.email, router]);

    return (
        <form action={formAction} className="space-y-5">
            {state?.message && (
                <div className="p-4 mb-4 text-sm text-red-500 bg-red-100 rounded-md" role="alert" aria-live="polite" aria-atomic="true">
                    <span className="font-medium">{state.errors}</span>
                </div>
            )}

            <div className="mb-4">
                <Label htmlFor="name" className="mb-1 block">Name</Label>
                <Input type="text" id="name" name="name" placeholder="Enter your name" />
                <div aria-live='polite' className="text-sm text-gray-500 mt-1" aria-atomic="true">
                    <span className="text-red-500">{state?.errors?.name || ""}</span>
                </div>
            </div>

            <div className="mb-4">
                <Label htmlFor="email" className="mb-1 block">Email</Label>
                <Input type="email" id="email" name="email" placeholder="Enter your email" />
                <div aria-live='polite' className="text-sm text-gray-500 mt-1" aria-atomic="true">
                    <span className="text-red-500">{state?.errors?.email || ""}</span>
                </div>
            </div>

            <div className="mb-4">
                <Label htmlFor="password" className="mb-1 block">Password</Label>
                <Input type="password" id="password" name="password" placeholder="********" />
                <div aria-live='polite' className="text-sm text-gray-500 mt-1" aria-atomic="true">
                    <span className="text-red-500">{state?.errors?.password || ""}</span>
                </div>
            </div>

            <div className="mb-4">
                <Label htmlFor="confirmPassword" className="mb-1 block">Confirm Password</Label>
                <Input type="password" id="confirmPassword" name="confirmPassword" placeholder="********" />
                <div aria-live='polite' className="text-sm text-gray-500 mt-1" aria-atomic="true">
                    <span className="text-red-500">{state?.errors?.confirmPassword || ""}</span>
                </div>
            </div>
            <RegisterButton/>
            <div className="mt-4 text-sm text-gray-600">
                Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
            </div>
        </form>
    );
};

export default FormRegister;