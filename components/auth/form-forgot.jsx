"use client";
import { useActionState } from "react";
import { requestPasswordReset } from "@/lib/actions";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const initialState = { success: false, message: "" };

export default function FormForgot() {
  const [state, formAction] = useActionState(requestPasswordReset, initialState);

  return (
    <form action={formAction} className="space-y-4 ">
      <Input type="email" name="email" placeholder="Email" required className="input" />
      <Button type="submit" className="btn">Kirim Link Reset</Button>
      {state.message && <div>{state.message}</div>}
    </form>
  );
}