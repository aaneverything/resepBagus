"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { use, useActionState } from "react";
import { resetPassword } from "@/lib/actions";
import { useEffect } from "react";

const initialState = { success: false, message: "" };

export default function FormResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [state, formAction] = useActionState(resetPassword, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      // Redirect ke login setelah reset password sukses
      router.push(`/login`);
    }
  }, [state.success, router]);

  if (!token || !email) return <div>Token tidak valid.</div>;

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="email" value={email} />
      <input type="password" name="password" placeholder="Password baru" required className="input" />
      <button type="submit" className="btn">Reset Password</button>
      {state.message && <div>{state.message}</div>}
    </form>
  );
}