// RecipeList.js
import RecipeCard from "../molecules/RecipeCard";

export default function RecipeList({ recipes }) {
    return (
        <div className="recipe-list">
            {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} title={recipe.title} tags={recipe.tags} />
            ))}
        </div>
    );
}
