'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  return (
    <header className="flex justify-between items-center px-6 py-4 shadow-md bg-white sticky top-0 z-50">
      <div className="text-xl font-bold">🥗 Resepku</div>
      <nav className="hidden md:flex gap-6 text-sm font-medium">
        <Link href="/">Home</Link>
        <Link href="/resep">Resep</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/about">About</Link>
      </nav>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button variant="default" asChild>
          <Link href="/resep/buat">Buat Resep</Link>
        </Button>
      </div>
    </header>
  );
}
