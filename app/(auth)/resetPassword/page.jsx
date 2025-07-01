import { Suspense } from "react";
import ResetPasswordClientWrapper from "./ResetPasswordClientWrapper";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordClientWrapper />
    </Suspense>
  );
}

