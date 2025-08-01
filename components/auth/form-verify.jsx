"use client";

import { Suspense, useActionState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtp } from "@/lib/actions";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
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
      router.push(`/login`);
    }
  }, [state, router]);


  return (
    <Suspense fallback={<div>Loading...</div>}>
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
      </form>
    </Suspense>
  );
};

export default FormVerify;

