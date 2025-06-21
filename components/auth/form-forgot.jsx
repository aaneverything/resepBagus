"use client";
import { useActionState } from "react";
import { requestPasswordReset } from "@/lib/actions";

const initialState = { success: false, message: "" };

export default function FormForgot() {
  const [state, formAction] = useActionState(requestPasswordReset, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="email" name="email" placeholder="Email" required className="input" />
      <button type="submit" className="btn">Kirim Link Reset</button>
      {state.message && <div>{state.message}</div>}
    </form>
  );
}