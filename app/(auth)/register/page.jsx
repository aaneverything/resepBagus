import React from 'react'
import FormRegister from "@/components/auth/form-register"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const Register = () => {
  return (
    <>
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <h1 className="text-xl font-bold text-center">Create Account</h1>
        </CardHeader>
        <CardContent>
          <FormRegister />
        </CardContent>
      </Card>
    </>
  )
}

export default Register