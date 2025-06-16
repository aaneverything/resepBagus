'use client'

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to Our Recipes!</h1>
      <p className="text-lg text-gray-600 mb-8">
        Discover and share amazing recipes from around the world.
      </p>
      <div className="space-x-4 mb-10">
        <Button onClick={() => router.push('/login')} variant="default">
          Login
        </Button>
        <Button onClick={() => router.push('/register')} variant="secondary">
          Register
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recipe cards will go here */}
      </div>
    </div>
  );
}
