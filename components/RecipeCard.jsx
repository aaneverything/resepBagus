import Link from 'next/link';
import StarRating from './StarRating';

export default function RecipeCard({ recipe }) {
  return (
    <Link href={`/recipes/${recipe.id}`}>
      <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
        {(recipe.image || recipe.imageUrl) && (
          <img 
            src={recipe.image || recipe.imageUrl} 
            alt={recipe.title}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}
        <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
        <p className="text-gray-600 mb-3 line-clamp-2">{recipe.description}</p>
        
        {/* Author and Rating */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {recipe.author?.name && `By ${recipe.author.name}`}
          </div>
          <StarRating 
            rating={recipe.avgRating || 0} 
            reviewCount={recipe.reviewCount || 0}
            showCount={false}
          />
        </div>
      </div>
    </Link>
  );
}
