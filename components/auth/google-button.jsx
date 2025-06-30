"use client";
import { signIn } from "next-auth/react";

const GoogleButton = () => {
  const handleSignIn = async () => {
    await signIn("google");
  };

  return (
    <button
      onClick={(e) => { e.preventDefault(); handleSignIn(); }}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
    >
      Login with Google
    </button>
  );
};

export default GoogleButton;