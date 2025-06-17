'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RecipeCard from '@/components/RecipeCard';

export default function HomePage() {
  const dummyRecipes = [
    {
      id: 1,
      title: 'Rendang Sapi',
      description: 'Masakan khas Padang yang kaya rempah.',
      imageUrl: '/images/rendang.jpg',
    },
    {
      id: 2,
      title: 'Ayam Bakar Taliwang',
      description: 'Ayam pedas khas Lombok.',
      imageUrl: '/images/ayam.jpg',
    },
    // Tambah lebih banyak data dummy sesuai kebutuhan
  ];

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <input
            type="text"
            placeholder="cari resep"
            className="px-4 py-2 w-full md:w-96 rounded-full border focus:outline-none"
          />
        </div>

        {/* Section Pencarian Populer */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-2">Pencarian Populer</h2>
          <p className="mb-4 text-sm text-gray-500">menu menu populer yang orang cari</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {dummyRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>

        {/* Section Menu Rumahan */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-2">Menu Rumahan</h2>
          <p className="mb-4 text-sm text-gray-500">menu menu rumahan yang mudah</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {dummyRecipes.map((recipe) => (
              <RecipeCard key={recipe.id + 'rumah'} recipe={recipe} />
            ))}
          </div>
        </section>

        {/* Section Kategori */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-2">Kategori</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {dummyRecipes.map((recipe) => (
              <RecipeCard key={recipe.id + 'kategori'} recipe={recipe} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
