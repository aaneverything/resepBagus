'use client';

import FormResetPassword from "@/components/auth/form-reset-password";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ResetPasswordClientWrapper = () => {
  return (
    <div className="flex items-center justify-center ">
      <Card className="w-full max-w-md shadow-lg ">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Reset Password
          </h1>
        </CardHeader>
        <CardContent>
          <FormResetPassword />
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordClientWrapper;
