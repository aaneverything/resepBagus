"use client";

import { useFormStatus } from "react-dom";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export const RegisterButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full"
      disabled={pending}
    >
      {pending ? "Registering..." : "Register"}
    </Button>
  );
};

export const LoginButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full"
      disabled={pending}
    >
      {pending ? "Logging in..." : "Login"}
    </Button>
  );
};

export const ResetPasswordButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
      disabled={pending}
    >
      {pending ? "Resetting Password..." : "Reset Password"}
    </Button>
  );
};

export const LogoutButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="button"
      className="bg-red-700 hover:bg-red-600 focus:ring-red-500"
      disabled={pending}
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      {pending ? "Logging out..." : "Logout"}
    </Button>
  );
};