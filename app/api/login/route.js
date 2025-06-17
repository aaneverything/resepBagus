// app/api/login/route.js
import { NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/db';

export async function POST(request) {
  const { email, password } = await request.json();

  const users = await getAllUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    return NextResponse.json({ success: true, message: 'Login successful', user });
  }

  return NextResponse.json({ success: false, message: 'Email atau password salah' }, { status: 401 });
}
