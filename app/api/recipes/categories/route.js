import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const categories = await prisma.tag.findMany({
            include: {
                _count: { select: { recipes: true } }
            },
            orderBy: { name: 'asc' }
        });

        return Response.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return Response.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}
