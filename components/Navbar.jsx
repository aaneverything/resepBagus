// filepath: /home/jokowi/ourrecipes/components/Navbar.jsx
"use client";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Loader2 } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { Input } from "@/components/ui/input"

export default function Navbar() {
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <header className="shadow-md bg-background sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <Link href="/" className="text-xl font-bold text-primary hover:text-primary/80">
          Resepku
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-6">

        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          <div className="flex w-full max-w-sm items-center gap-2">
            <Button type="submit" variant="outline">
              <Link href="/search">
                <Search className="w-5 h-5" />
              </Link>

            </Button>
          </div>
          {status === "loading" ? (
            <Skeleton className="w-8 h-8 rounded-full" />
          ) : session?.user ? (
            <>
              <Button asChild>
                <Link href="/recipes/create">
                  Buat Resep
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image} alt={session.user.name} />
                      <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">Akun Saya</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/recipes/create">Buat Resep</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/register">Daftar</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}