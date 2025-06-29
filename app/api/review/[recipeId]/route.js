import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get reviews for a specific recipe
export async function GET(request, { params }) {
    try {
        const { recipeId } = params;

        const reviews = await prisma.review.findMany({
            where: { recipeId },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Calculate average rating
        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
            : 0;

        return NextResponse.json({
            reviews,
            avgRating: Math.round(avgRating * 10) / 10,
            totalReviews: reviews.length
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({
            error: 'Internal server error'
        }, { status: 500 });
    }
}
