import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
    try {
        const { categoryId } = params;

        const recipes = await prisma.recipe.findMany({
            where: {
                tags: {
                    some: { tagId: categoryId }
                }
            },
            include: {
                author: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 12
        });

        return Response.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes by category:', error);
        return Response.json({ error: 'Failed to fetch recipes by category' }, { status: 500 });
    }
}
