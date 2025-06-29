import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();

// GET single recipe
export async function GET(request, { params }) {
    try {
        const { id } = params;

        const recipe = await prisma.recipe.findUnique({
            where: { id },
            include: {
                ingredients: true,
                steps: { orderBy: { order: 'asc' } },
                tags: { include: { tag: true } },
                author: { select: { name: true } }
            }
        });

        if (!recipe) {
            return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
        }

        return NextResponse.json(recipe);
    } catch (error) {
        console.error('Error fetching recipe:', error);
        return NextResponse.json({ error: 'Failed to fetch recipe' }, { status: 500 });
    }
}

// PUT (Update) recipe
export async function PUT(request, { params }) {
    try {
        const session = await auth();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;

        // Check if recipe exists and user owns it
        const existingRecipe = await prisma.recipe.findUnique({
            where: { id },
            include: { author: true }
        });

        if (!existingRecipe) {
            return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
        }

        if (existingRecipe.author.email !== session.user.email) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Parse form data
        const formData = await request.formData();
        const judul = formData.get('judul');
        const description = formData.get('description') || '';
        const ingredientsRaw = formData.get('ingredients');
        const stepsRaw = formData.get('steps');
        const tagsRaw = formData.get('tags');
        const foto = formData.get('foto');

        let ingredientsArr = [];
        let stepsArr = [];
        let tagsArr = [];
        try {
            ingredientsArr = JSON.parse(ingredientsRaw);
            stepsArr = JSON.parse(stepsRaw);
            tagsArr = tagsRaw ? JSON.parse(tagsRaw) : [];
        } catch (e) {
            return NextResponse.json({ error: 'Format data tidak valid' }, { status: 400 });
        }

        if (!judul || !Array.isArray(ingredientsArr) || ingredientsArr.length === 0 || !Array.isArray(stepsArr) || stepsArr.length === 0) {
            return NextResponse.json({ error: 'Judul, bahan, dan langkah wajib diisi' }, { status: 400 });
        }

        // Handle photo upload
        let imagePath = existingRecipe.image; // Keep current image by default
        if (foto && typeof foto === 'object' && foto.size > 0) {
            const buffer = Buffer.from(await foto.arrayBuffer());
            const filename = `user_${session.user.email}_${Date.now()}.${foto.name.split('.').pop()}`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            await fs.mkdir(uploadDir, { recursive: true });
            imagePath = `/uploads/${filename}`;
            await fs.writeFile(path.join(uploadDir, filename), buffer);
        }

        // Update recipe in transaction
        const updatedRecipe = await prisma.$transaction(async (tx) => {
            // Delete old ingredients, steps, and tags
            await tx.ingredient.deleteMany({ where: { recipeId: id } });
            await tx.step.deleteMany({ where: { recipeId: id } });
            await tx.recipeTag.deleteMany({ where: { recipeId: id } });

            // Update recipe and create new relations
            const recipe = await tx.recipe.update({
                where: { id },
                data: {
                    title: judul,
                    description: description,
                    image: imagePath,
                    ingredients: {
                        create: ingredientsArr.map(name => ({ name })),
                    },
                    steps: {
                        create: stepsArr.map((content, idx) => ({ order: idx + 1, content })),
                    },
                    tags: {
                        create: tagsArr.map(tagName => ({
                            tag: {
                                connectOrCreate: {
                                    where: { name: tagName.trim() },
                                    create: { name: tagName.trim() }
                                }
                            }
                        }))
                    }
                },
                include: { ingredients: true, steps: true, tags: { include: { tag: true } } },
            });

            return recipe;
        });

        return NextResponse.json({ message: 'Recipe updated successfully', id: updatedRecipe.id });
    } catch (error) {
        console.error('Error updating recipe:', error);
        return NextResponse.json({ error: 'Gagal memperbarui resep', message: error?.message }, { status: 500 });
    }
}

// DELETE recipe
export async function DELETE(request, { params }) {
    try {
        const session = await auth();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;

        // Check if recipe exists and user owns it
        const existingRecipe = await prisma.recipe.findUnique({
            where: { id },
            include: { author: true }
        });

        if (!existingRecipe) {
            return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
        }

        if (existingRecipe.author.email !== session.user.email) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Delete recipe and all related data in transaction
        await prisma.$transaction(async (tx) => {
            // Delete all related data first
            await tx.review.deleteMany({ where: { recipeId: id } });
            await tx.recipeTag.deleteMany({ where: { recipeId: id } });
            await tx.ingredient.deleteMany({ where: { recipeId: id } });
            await tx.step.deleteMany({ where: { recipeId: id } });

            // Then delete the recipe
            await tx.recipe.delete({ where: { id } });
        });

        return NextResponse.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        return NextResponse.json({ error: 'Gagal menghapus resep' }, { status: 500 });
    }
}
