// "use client" tetap dipakai karena ini komponen client
"use client";
import { signIn } from "../app/auth.client";

const LoginButton = () => {
  const handleSignIn = async () => {
    await signIn("google");
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSignIn(); }}>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
      >
        Login with Google
      </button>
    </form>
  );
};

export default LoginButton;
