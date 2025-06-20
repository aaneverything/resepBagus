'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { login } from '@/lib/auth'

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (form.password !== form.confirmPassword) {
      setMessage("Password tidak cocok")
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registrasi gagal')

      login({ name: form.name, email: form.email })
      router.push('/recipes')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 w-full flex flex-col md:flex-row items-center justify-between">
          
          {/* Gambar Kiri */}
          <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
            <Image
              src="https://www.thedailymeal.com/img/gallery/you-should-think-twice-about-bagging-your-own-groceries-at-the-store/intro-1681220544.jpg"
              alt="Grocery"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>

          {/* Form Kanan */}
          <div className="w-full md:w-1/2 max-w-md">
            <h2 className="text-2xl font-bold mb-6">Buat akunmu untuk menulis resep</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="">Name</Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Masukkan nama"
                />
              </div>
              <div>
                <Label htmlFor="">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="contoh@email.com"
                />
              </div>
              <div>
                <Label htmlFor="">Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="password"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Repeat Password</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="confirm password"
                />
              </div>

              <div className="flex items-center">
                <input type="checkbox" required className="mr-2" />
                <span className="text-sm">I agree to the term & policy</span>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Registering...' : 'Sign Up'}
              </Button>

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
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png"
                    alt="Facebook"
                    width={16}
                    height={16}
                    className="mr-1"
                  />
                  Facebook
                </Button>
              </div>

              {message && (
                <p className="text-sm text-red-500 text-center mt-2">{message}</p>
              )}

              <p className="text-sm text-center mt-4">
                Sudah punya akun?{' '}
                <a href="/login" className="text-blue-500 hover:underline">
                  Login di sini
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
