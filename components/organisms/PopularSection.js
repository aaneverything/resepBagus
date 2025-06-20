// PopularSection.js
import RecipeList from "./RecipeList";

export default function PopularSection({ popularRecipes }) {
    return (
        <section className="popular-section">
            <h2>Popular Recipes</h2>
            <RecipeList recipes={popularRecipes} />
        </section>
    );
}
