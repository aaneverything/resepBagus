import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const popularRecipes = await prisma.recipe.findMany({
            include: {
                author: { select: { name: true } },
                reviews: true,
                _count: { select: { reviews: true } }
            },
            orderBy: [
                { reviews: { _count: 'desc' } }, // Order by review count
                { createdAt: 'desc' }
            ],
            take: 8, // Top 6 popular recipes

        });

        // Fallback to ensure popularRecipes is an array
        const safePopularRecipes = Array.isArray(popularRecipes) ? popularRecipes : [];

        // Calculate average rating for each recipe
        const recipesWithRating = safePopularRecipes.map(recipe => {
            const totalRating = Array.isArray(recipe.reviews)
                ? recipe.reviews.reduce((sum, review) => sum + review.rating, 0)
                : 0;
            const avgRating = recipe.reviews.length > 0 ? (totalRating / recipe.reviews.length).toFixed(1) : 0;

            return {
                id: recipe.id,
                title: recipe.title,
                description: recipe.description,
                image: recipe.image,
                author: recipe.author,
                avgRating: parseFloat(avgRating),
                reviewCount: recipe._count.reviews,
            };
        });
        return NextResponse.json(Array.isArray(recipesWithRating) ? recipesWithRating : []);
    } catch (error) {
        console.error('Error fetching popular recipes:', error);
        return NextResponse.json({ error: 'Failed to fetch popular recipes' }, { status: 500 });
    }
}
