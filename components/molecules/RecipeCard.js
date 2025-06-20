// RecipeCard.js
import Tag from "../atoms/Tag";

export default function RecipeCard({ title, tags }) {
    return (
        <div className="recipe-card">
            <h3>{title}</h3>
            <div className="tags">
                {tags.map((tag, index) => (
                    <Tag key={index} label={tag} />
                ))}
            </div>
        </div>
    );
}
