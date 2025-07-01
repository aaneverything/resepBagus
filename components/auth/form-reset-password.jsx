"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { use, useActionState } from "react";
import { resetPassword } from "@/lib/actions";
import { useEffect, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ResetPasswordButton } from "../atoms/Button";

const initialState = { success: false, message: "" };

export default function FormResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [state, formAction] = useActionState(resetPassword, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push(`/login`);
    }
  }, [state.success, router]);

  if (!token || !email)
    return <div className="text-red-500">Token tidak valid.</div>;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <form
        action={formAction}
        className="space-y-6 rounded-lg shadow-md max-w-md mx-auto"
      >
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="email" value={email} />

        <div className="">
          <Label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password Baru
          </Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Masukkan password baru"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <ResetPasswordButton />
      </form>
    </Suspense>
  );
}
