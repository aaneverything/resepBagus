import { prisma } from "@/lib/prisma";

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
            take: 6, // Top 6 popular recipes
        });

        // Calculate average rating for each recipe
        const recipesWithRating = popularRecipes.map(recipe => {
            const totalRating = recipe.reviews.reduce((sum, review) => sum + review.rating, 0);
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

        return Response.json(recipesWithRating);
    } catch (error) {
        console.error('Error fetching popular recipes:', error);
        return Response.json({ error: 'Failed to fetch popular recipes' }, { status: 500 });
    }
}
