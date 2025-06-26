import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import { prisma } from "@/lib/prisma"; // Pastikan prisma sudah di-setup
import Link from "next/link";
import RecipeList from "@/components/organisms/RecipeList";
// import PopularRecipes from "@/components/PopularRecipes";
// import CategoryRecipes from "@/components/CategoryRecipes";

export default async function Home() {
  


  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      title: true,
      image: true,
    },
  });

  console.log("RESEP DI HOMEPAGE:", recipes);
  if (!recipes || recipes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Navbar />
        <main>
          <h1 className="text-2xl font-bold mb-4">Tidak ada resep ditemukan</h1>
          <Link href="/recipes/create" className="text-blue-500 underline">
            kosong cokkkk
          </Link>
        </main>
        <Footer />
      </div>
    );
  }
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <SearchBar />
        <h2 className="text-xl font-bold mt-6 mb-2">Resep Terpopuler</h2>
        {/* <PopularRecipes /> */}
        <h2 className="text-xl font-bold mt-6 mb-2">Semua Resep</h2>
        <RecipeList recipes={recipes} />
        <h2 className="text-xl font-bold mt-6 mb-2">Resep per Kategori</h2>
        {/* <CategoryRecipes /> */}
      </main>
      <Footer />
    </>
  );
}