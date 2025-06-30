import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PopularRecipes from "@/components/PopularRecipes";
import CategoryRecipes from "@/components/CategoryRecipes";
import RecipeList from "@/components/RecipeList";
import { Heading } from "@/components/ui/heading";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export default async function Home() {

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Heading level={2} className="mt-6 mb-2 text-xl font-bold">
          Resep Terpopuler
        </Heading>
        <PopularRecipes />
        <Heading level={2} className="mt-6 mb-2 text-xl font-bold">
          Semua Resep
        </Heading>
        <RecipeList />
        <Heading level={2} className="mt-6 mb-2 text-xl font-bold">
          Resep per Kategori
        </Heading>
        <CategoryRecipes />
      </div>
      <Footer />
    </>
  );
}