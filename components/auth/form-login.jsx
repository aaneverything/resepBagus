"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginCredentials } from "@/lib/actions";
import { signIn } from "next-auth/react";
import { LoginButton } from "../atoms/Button";

const initialState = {
  success: false,
  errors: {},
  email: "",
  password: "",
  message: "",
};

const FormLogin = () => {
  const [state, formAction] = useActionState(loginCredentials, initialState);
  const router = useRouter();

  useEffect(() => {
    // Pastikan state sukses dan ada email & password
    if (state.success && state.email && state.password) {
      signIn("credentials", {
        email: state.email,
        password: state.password,
        callbackUrl: "/dashboard",
      });
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      {state.message && (
        <div className="p-4 mb-4 text-sm text-red-500 bg-red-100 rounded-md" role="alert">
          <span className="font-medium">{state.message}</span>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <div className="text-sm text-red-500 mt-1">{state.errors?.email || ""}</div>
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="********"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <div className="text-sm text-red-500 mt-1">{state.errors?.password || ""}</div>
      </div>
      <LoginButton />
      <div className="mt-4 text-sm text-gray-600">
        Don&apos;t have an account yet?{" "}
        <a href="/auth/register" className="text-blue-500 hover:underline">
          Register
        </a>
      </div>
    </form>
  );
};

export default FormLogin;
