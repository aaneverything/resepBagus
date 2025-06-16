import { NextResponse } from 'next/server'

export async function POST(request) {
  const { email, password } = await request.json()

  // Contoh validasi sederhana
  if (email === 'admin@gmail.com' && password === '123') {
    return NextResponse.json({ success: true, message: 'Login berhasil' })
  }

  return NextResponse.json({ success: false, message: 'Email atau password salah' }, { status: 401 })
}
