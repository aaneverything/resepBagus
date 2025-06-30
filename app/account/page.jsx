import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/atoms/Button";
import MyRecipeCard from "@/components/MyRecipeCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PLACEHOLDER = "https://ui-avatars.com/api/?name=User&background=random";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true, image: true },
  });

  const userRecipes = await prisma.recipe.findMany({
    where: { authorId: user.id },
    include: {
      ingredients: true,
      tags: { include: { tag: true } },
      reviews: true,
      _count: { select: { reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const recipesWithRating = userRecipes.map((recipe) => {
    const totalRating = recipe.reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = recipe.reviews.length > 0 ? totalRating / recipe.reviews.length : 0;
    return { ...recipe, avgRating, reviews: undefined };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Akun Saya</h1>
          <p className="text-gray-500">Kelola profil dan resep buatanmu</p>
        </div>

        {/* Profile Card */}
        <Card className="p-6 flex flex-col md:flex-row items-center gap-6 shadow-lg">
          <Avatar className="h-24 w-24 border shadow-md">
            <AvatarImage src={user.image || PLACEHOLDER} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
              {user.name?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
              <div>
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {recipesWithRating.length} resep dibuat
                </p>
              </div>

              <div className="mt-4 sm:mt-0 flex gap-3">
                <Link href="/account/edit">
                  <Button variant="outline">Edit Profil</Button>
                </Link>
                <LogoutButton />
              </div>
            </div>
          </div>
        </Card>

        {/* Resep Saya */}
        <Card className="p-6 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Resep Saya</h2>
            <Link href="/recipes/create">
              <Button className="bg-green-600 hover:bg-green-700 text-white shadow">
                + Buat Resep Baru
              </Button>
            </Link>
          </div>

          {recipesWithRating.length === 0 ? (
            <div className="text-center text-gray-500 py-10 space-y-4">
              <p>Anda belum membuat resep apapun.</p>
              <Link href="/recipes/create">
                <Button>📖 Buat Resep Pertama</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recipesWithRating.map((recipe) => (
                <MyRecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
