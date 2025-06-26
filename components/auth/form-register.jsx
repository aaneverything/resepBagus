"use client";

import { use, useActionState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { registerCredentials } from '@/lib/actions';
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
        <form action={formAction} className="space-y-4">
            {state?.message ? (
                <div className="p-4 mb-4 text-sm text-red-500 bg-red-100 rounded-md" role="alert" aria-live="polite" aria-atomic="true">
                    <span className="font-medium">{state.message}</span>
                </div>
            ) : (
            ""
            )}
        
            
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="name" name="name" placeholder="Enter your name" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                <div aria-live='polite' className="text-sm text-gray-500 mt-1" aria-atomic="true">
                    <span className="text-red-500">
                        {state?.errors?.name || ""}
                    </span>
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                <div aria-live='polite' className="text-sm text-gray-500 mt-1" aria-atomic="true">
                    <span className="text-red-500">
                        {state?.errors?.email || ""}
                    </span>
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="password" name="password" placeholder="********" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                <div aria-live='polite' className="text-sm text-gray-500 mt-1" aria-atomic="true">
                    <span className="text-red-500">
                        {state?.errors?.password || ""}
                    </span>
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="********" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                <div aria-live='polite' className="text-sm text-gray-500 mt-1" aria-atomic="true">
                    <span className="text-red-500">
                        {state?.errors?.confirmPassword || ""}
                    </span>
                </div>
            </div>
<RegisterButton />
            <div className="mt-4 text-sm text-gray-600">
                Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
            </div>
        </form>
    );
};

export default FormRegister;