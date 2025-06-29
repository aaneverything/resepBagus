import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/atoms/Button";
import MyRecipeCard from "@/components/MyRecipeCard";
import Link from "next/link";

const PLACEHOLDER = "https://ui-avatars.com/api/?name=User&background=random";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // Ambil data user dari database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true, image: true },
  });

  // Ambil resep-resep user
  const userRecipes = await prisma.recipe.findMany({
    where: { authorId: user.id },
    include: {
      ingredients: true,
      tags: { include: { tag: true } },
      _count: { select: { reviews: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Akun Saya</h1>
      
      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={user.image || PLACEHOLDER}
            alt="Foto Profil"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 mt-1">{userRecipes.length} resep dibuat</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link 
            href="/account/edit" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Edit Profil
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* My Recipes Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Resep Saya</h2>
          <Link 
            href="/recipes/create" 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            + Buat Resep Baru
          </Link>
        </div>
        
        {userRecipes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">Anda belum membuat resep apapun.</p>
            <Link 
              href="/recipes/create"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Buat Resep Pertama
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userRecipes.map((recipe) => (
              <MyRecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}