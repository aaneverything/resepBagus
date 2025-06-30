import FormVerify from '@/components/auth/form-verify';
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const Verify = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <h1 className="text-xl font-bold text-center">Verify Your Account</h1>
        </CardHeader>
        <CardContent>
          <FormVerify />
        </CardContent>
      </Card>
    </div>
  );
};

export default Verify;