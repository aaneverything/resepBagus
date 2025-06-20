// CategorySection.js
export default function CategorySection({ categories }) {
    return (
        <div className="category-section">
            {categories.map((category, index) => (
                <div key={index} className="category">
                    {category}
                </div>
            ))}
        </div>
    );
}
