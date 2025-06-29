import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Create a new review
export async function POST(request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { recipeId, rating, content } = await request.json();

        // Validate input
        if (!recipeId || !rating || rating < 1 || rating > 5) {
            return NextResponse.json({
                error: 'Invalid data. Rating must be between 1-5'
            }, { status: 400 });
        }

        // Check if recipe exists
        const recipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
        });

        if (!recipe) {
            return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
        }

        // Get user by email
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if user already reviewed this recipe
        const existingReview = await prisma.review.findFirst({
            where: {
                userId: user.id,
                recipeId: recipeId,
            },
        });

        if (existingReview) {
            return NextResponse.json({
                error: 'You have already reviewed this recipe'
            }, { status: 400 });
        }

        // Create review
        const review = await prisma.review.create({
            data: {
                content: content || '',
                rating: parseInt(rating),
                userId: user.id,
                recipeId: recipeId,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json({ review }, { status: 201 });
    } catch (error) {
        console.error('Error creating review:', error);
        return NextResponse.json({
            error: 'Internal server error'
        }, { status: 500 });
    }
}
