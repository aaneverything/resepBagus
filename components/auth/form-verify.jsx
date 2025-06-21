"use client";

import { useActionState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtp } from "@/lib/actions";
import { signIn } from "next-auth/react";
import { LoginButton } from "../atoms/Button";


const initialState = {
  success: false,
  errors: {},
  message: "",
};

const FormVerify = () => {
      const router = useRouter();
  const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

  const [state, formAction] = useActionState(verifyOtp, initialState);


  useEffect(() => {
    if (state.success) {
      // Redirect ke login setelah verifikasi sukses
      router.push(`/login`);
    }
  }, [state, router]);


  return (
    <form action={formAction} className="space-y-4">
      {state.message && (
        <div className="p-4 mb-4 text-sm text-red-500 bg-red-100 rounded-md" role="alert">
          <span className="font-medium">{state.message}</span>
        </div>
      )}

      <input type="hidden" name="email" value={email} />

      <div className="mb-4">
        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
          OTP
        </label>
        <input
          type="text"
          id="otp"
          name="otp"
          placeholder="Enter your OTP"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <div className="text-sm text-red-500 mt-1">{state.errors?.otp || ""}</div>
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

export default FormVerify;
