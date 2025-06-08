export default function RecipeCard({ recipe }) {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      {recipe.imageUrl && (
        <img 
          src={recipe.imageUrl} 
          alt={recipe.title}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}
      <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
      <p className="text-gray-600">{recipe.description}</p>
    </div>
  );
}
