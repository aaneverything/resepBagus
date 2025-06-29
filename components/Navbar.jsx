"use client";
import React, { useState } from 'react';
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';

const PLACEHOLDER = "https://ui-avatars.com/api/?name=User&background=random";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <header className="shadow-md bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-2">
        <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
          Resepku
        </Link>

        {/* Right side - Auth Section */}
        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          ) : session?.user ? (
            <>
              <Link 
                href="/recipes/create"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm font-medium"
              >
                Buat Resep
              </Link>

              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition"
                >
                  <img
                    src={session.user.image || "/placeholder.png"} 
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border py-1 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                      <p className="text-xs text-gray-500">{session.user.email}</p>
                    </div>
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Akun Saya
                    </Link>
                    <Link
                      href="/recipes/create"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Buat Resep
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Link 
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
              >
                Login
              </Link>
              <Link 
                href="/register"
                className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition text-sm font-medium"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* responsive dikit */}
      <div className="md:hidden border-t bg-gray-50 px-4 py-2">
        <nav className="flex justify-center gap-6 text-sm">
          <Link href="/" className="text-gray-700">Home</Link>
          <Link href="/recipes" className="text-gray-700">Resep</Link>
          <Link href="/blog" className="text-gray-700">Blog</Link>
          <Link href="/about" className="text-gray-700">About</Link>
        </nav>
      </div>

      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsProfileOpen(false)}
        ></div>
      )}
    </header>
  );
}