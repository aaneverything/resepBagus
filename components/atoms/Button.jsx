"use client"

import { useFormStatus } from "react-dom"

export const RegisterButton = ()=> {
    const { pending } = useFormStatus()
    
    return (
        <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        disabled={pending}
        >
        {pending ? "Registering..." : "Register"}
        </button>
    )
    }

export const LoginButton = ()=> {
    const { pending } = useFormStatus()
    
    return (
        <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        disabled={pending}
        >
        {pending ? "Logging in..." : "Login"}
        </button>
    )
    }
export const LogoutButton = ()=> {
    const { pending } = useFormStatus()
    
    return (
        <button
        type="submit"
        className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        disabled={pending}
        >
        {pending ? "Logging out..." : "Logout"}
        </button>
    )
}