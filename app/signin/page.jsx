import React from 'react'
import LoginButton from "@/components/loginButton"

const SigninPage = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
        <div className="bg-white w-96 mx-auto">
            <h1 className='text-4xl font-bold'>SigninPage</h1>
            <p className='mt-2 text-gray-600'>Please enter your credentials to sign in.</p>
            <div className="py-4 text-center">
                <LoginButton />
            </div>
        </div>
    </div>
  )
}

export default SigninPage