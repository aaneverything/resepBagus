export default function RecipeDetail({ params }) {
  return (
    <div>
      <h1>Recipe {params.id}</h1>
      <p>Details for recipe with ID: {params.id}</p>
    </div>
  );
}
