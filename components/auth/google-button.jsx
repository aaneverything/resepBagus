"use client";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

const GoogleButton = () => {
  const handleSignIn = async () => {
    await signIn("google");
  };

  return (
    <Button
      onClick={(e) => { e.preventDefault(); handleSignIn(); }}
      className="px-4 py-2 rounded transition duration-200"
    >
      Login with Google
    </Button>
  );
};

export default GoogleButton;