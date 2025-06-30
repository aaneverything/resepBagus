import FormForgot from "@/components/auth/form-forgot";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ForgotPage() {
  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md ">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Forgot Password
          </h1>
        </CardHeader>
        <CardContent>
          <FormForgot />
        </CardContent>
      </Card>
    </div>
  );
}