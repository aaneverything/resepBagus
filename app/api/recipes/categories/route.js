import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const categories = await prisma.tag.findMany({
            include: {
                _count: { select: { recipes: true } }
            },
            orderBy: { name: 'asc' }
        });

        // Fallback to ensure categories is an array
        const safeCategories = Array.isArray(categories) ? categories : [];

        return NextResponse.json(safeCategories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}
