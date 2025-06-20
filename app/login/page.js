'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setErrorMsg(data.message || 'Login gagal')
    } else {
      setErrorMsg('')
      router.push('/')
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 w-full flex flex-col md:flex-row items-center justify-between">
          {/* Left Side Image */}
          <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
            <Image
              src="https://www.thedailymeal.com/img/gallery/you-should-think-twice-about-bagging-your-own-groceries-at-the-store/intro-1681220544.jpg"
              alt="Grocery"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>

          {/* Right Side Form */}
          <div className="w-full md:w-1/2 max-w-md">
            <h2 className="text-2xl font-bold mb-6">Login ke akunmu</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
              {errorMsg && (
                <p className="text-sm text-red-500 text-center">{errorMsg}</p>
              )}
              <Button type="submit" className="w-full">
                Login
              </Button>

              {/* Social buttons */}
              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 text-sm justify-center px-2 py-1"
                >
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                    alt="Google"
                    width={16}
                    height={16}
                    className="mr-1"
                  />
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 text-sm justify-center px-2 py-1"
                >
                  <Image
                    src="/https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png"
                    alt="Facebook"
                    width={16}
                    height={16}
                    className="mr-1"
                  />
                  Facebook
                </Button>
              </div>

              {/* Link to Register */}
              <p className="text-sm text-center mt-4">
                Belum punya akun?{' '}
                <a href="/register" className="text-blue-500 hover:underline">
                  Daftar di sini
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
