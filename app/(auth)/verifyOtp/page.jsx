import { Suspense } from "react";
import VerifyClientWrapper from "./VerifyClientWrapper";

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyClientWrapper />
    </Suspense>
  );
}

