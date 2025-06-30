"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginCredentials } from "@/lib/actions";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        callbackUrl: "/",
      });
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      {state.message && (
        <div className="p-4 mb-4 text-sm text-red-500 bg-red-100 rounded-md" role="alert">
          <span className="font-medium">{state.message}</span>
        </div>
      )}

      <div className="mb-4">
        <Label htmlFor="email" className="mb-1 block">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
        />
        <div className="text-sm text-red-500 mt-1">{state.errors?.email || ""}</div>
      </div>

      <div className="mb-4">
        <Label htmlFor="password" className="mb-1 block">Password</Label>
        <Input
          type="password"
          id="password"
          name="password"
          placeholder="********"
        />
        <div className="text-sm text-red-500 mt-1">{state.errors?.password || ""}</div>
      </div>

      <LoginButton/>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm">
          <a href="/forgot" className="text-blue-500 hover:underline">
            Forgot password?
          </a>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Don&apos;t have an account yet?{" "}
        <a href="/register" className="text-blue-500 hover:underline">
          Register
        </a>
      </div>
    </form>
  );
};

export default FormLogin;
