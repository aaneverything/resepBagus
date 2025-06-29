"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function PopularRecipes() {
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularRecipes = async () => {
      try {
        const res = await fetch("/api/recipes/popular");
        const data = await res.json();
        setPopularRecipes(data);
      } catch (error) {
        console.error("Error fetching popular recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularRecipes();
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading popular recipes...</div>;
  }

  if (popularRecipes.length === 0) {
    return <div className="text-gray-500">Belum ada resep populer.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {popularRecipes.map((recipe) => (
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
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>by {recipe.author?.name}</span>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              ⭐ {recipe.avgRating || 0} ({recipe.reviewCount || 0} reviews)
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
