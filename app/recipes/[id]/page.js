import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function RecipeDetail({ params }) {
  const { id } = params;

  // Ambil data resep dari database
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      ingredients: true,
      steps: true,
      author: { select: { name: true } },
      tags: { include: { tag: true } },
    },
  });

  if (!recipe) {
    return <div className="p-8 text-center text-red-500">Resep tidak ditemukan.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-2">{recipe.title}</h1>
      <div className="mb-2 text-gray-600">Oleh: {recipe.author?.name || "Unknown"}</div>

      {/* Tags */}
      {recipe.tags && recipe.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((recipeTag) => (
              <span
                key={recipeTag.tag.id}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {recipeTag.tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}
      {recipe.description && <p className="mb-4 text-gray-700">{recipe.description}</p>}
      <h2 className="font-semibold mt-4 mb-2">Bahan:</h2>
      <ul className="list-disc list-inside mb-4">
        {recipe.ingredients.map((ing) => (
          <li key={ing.id}>{ing.name}</li>
        ))}
      </ul>
      <h2 className="font-semibold mt-4 mb-2">Langkah-langkah:</h2>
      <ol className="list-decimal list-inside">
        {recipe.steps
          .sort((a, b) => a.order - b.order)
          .map((step) => (
            <li key={step.id} className="mb-2">{step.content}</li>
          ))}
      </ol>
    </div>
  );
}