'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isLoggedIn } from '@/lib/auth'

export default function BuatResepPage() {
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/register') // Redirect ke register kalau belum login
    }
  }, [router])

  // NOTE: Tampilkan form hanya jika sudah login
  if (!isLoggedIn()) return null;

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Buat Resep Baru</h1>
      {/* Form buat resep di sini */}
    </main>
  )
}
