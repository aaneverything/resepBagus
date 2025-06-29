"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import StarRating from "./StarRating";

export default function MyRecipeCard({ recipe }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Yakin ingin menghapus resep "${recipe.title}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/recipes/${recipe.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh(); // Refresh the page to update the list
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menghapus resep');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat menghapus resep');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-32 object-cover rounded mb-2"
        />
      )}
      <h3 className="font-semibold mb-1">{recipe.title}</h3>
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{recipe.description}</p>
      
      {/* Tags */}
      {recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {recipe.tags.slice(0, 3).map((recipeTag) => (
            <span
              key={recipeTag.tag.id}
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
            >
              {recipeTag.tag.name}
            </span>
          ))}
          {recipe.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{recipe.tags.length - 3} lainnya</span>
          )}
        </div>
      )}

      <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
        <span>{recipe.ingredients.length} bahan</span>
        <span>{recipe._count.reviews} review</span>
      </div>

      {/* Rating */}
      <div className="mb-3">
        <StarRating 
          rating={recipe.avgRating || 0}
          reviewCount={recipe._count.reviews}
          showCount={true}
          size="sm"
        />
      </div>

      <div className="flex gap-2">
        <Link
          href={`/recipes/${recipe.id}`}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
        >
          Lihat
        </Link>
        <Link
          href={`/recipes/edit/${recipe.id}`}
          className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition"
        >
          Edit
        </Link>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition disabled:opacity-50"
        >
          {isDeleting ? 'Menghapus...' : 'Hapus'}
        </button>
      </div>
    </div>
  );
}
