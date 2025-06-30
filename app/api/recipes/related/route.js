import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const recipeId = searchParams.get("recipeId");

    if (!recipeId) {
        return new Response(JSON.stringify({ error: "Recipe ID is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const recipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
            select: { title: true },
        });

        if (!recipe) {
            return new Response(JSON.stringify({ error: "Recipe not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const relatedRecipes = await prisma.recipe.findMany({
            where: {
                id: { not: recipeId },
                title: {
                    contains: recipe.title.split(" ")[0], // Match recipes with similar words in the title
                    mode: "insensitive",
                },
            },
            take: 3,
        });

        return new Response(JSON.stringify(relatedRecipes), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching related recipes:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}