import Link from "next/link";

export default function RecipeList({ recipes }) {
    console.log("DAFTAR RESEP:", recipes);
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
                <Link
                    key={recipe.id}
                    href={`/recipes/${recipe.id}`}
                    style={{ border: "4px solid red", background: "yellow" }}
                    className="block"
                >

                    {recipe.image && (
                        <img
                            src={recipe.image}
                            alt={recipe.title}
                            width={300}
                            height={200}
                            className="rounded w-full h-40 object-cover"
                        />
                    )}
                    <div className="mt-2 font-semibold text-center">
                        {recipe.title}
                    </div>

                </Link>
            ))}
        </div>
    );
}
