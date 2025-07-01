"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";

export default function CategoryRecipes() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryRecipes, setCategoryRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/recipes/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const fetchCategoryRecipes = async (categoryId) => {
    setSelectedCategory(categoryId);
    try {
      const res = await fetch(`/api/recipes/by-category/${categoryId}`);
      const data = await res.json();
      setCategoryRecipes(data);
    } catch (error) {
      console.error("Error fetching category recipes:", error);
    }
  };

  if (loading) {
    // Show skeleton loading state while fetching categories
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => fetchCategoryRecipes(category.id)}
            className={`px-3 py-1 rounded-full text-sm transition ${selectedCategory === category.id
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {category.name} ({category._count.recipes})
          </button>
        ))}
      </div>

      {/* Category Recipes */}
      {selectedCategory && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryRecipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="border rounded-lg p-4 shadow-md block hover:bg-gray-50 transition"
            >
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}
              <h3 className="text-lg font-semibold mb-1">{recipe.title}</h3>
              <p className="text-sm text-gray-600 mb-1">{recipe.description}</p>
              <div className="text-xs text-gray-500">
                by {recipe.author?.name}
              </div>
            </Link>
          ))}
        </div>
      )}

      {selectedCategory && categoryRecipes.length === 0 && (
        <div className="text-gray-500 text-center py-8">
          Tidak ada resep dalam kategori ini.
        </div>
      )}
    </div>
  );
}
