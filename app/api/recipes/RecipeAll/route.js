export async function GET(request) {
    try {
        const searchParams = new URL(request.url).searchParams;
        const query = searchParams.get('query') || '';
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;

        // Fetch all recipes from the database
        const allRecipes = await prisma.recipe.findMany({
            include: {
                ingredients: true,
                steps: true,
                tags: true,
            },
            orderBy: [
                { reviews: { _count: 'asc' } }, // Order by review count
                { createdAt: 'asc' }
            ],
            take: 6,
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ],
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        return Response.json(allRecipes);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        return Response.json({ error: "Failed to fetch recipes" }, { status: 500 });
    }
}