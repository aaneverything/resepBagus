import { NextResponse } from 'next/server';

import { getRecipes } from '../../../lib/db';
import { PrismaClient } from '@prisma/client'; // ✅ default path
// path custom sesuai output kamu

if (typeof window !== 'undefined') {
  throw new Error('Prisma Client is not supported in the browser.');
}

const prisma = new PrismaClient();
export async function GET(request) {
  try {
const recipes = await prisma.recipe.findMany();
    return NextResponse.json({
      success: true,
      data: recipes,
      count: recipes.length
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch recipes',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description || !body.ingredients || !body.instructions) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Title, description, ingredients, and instructions are required'
        },
        { status: 400 }
      );
    }

    // Create new recipe with current timestamp
    const newRecipe = {
      ...body,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // For now, we'll use the mock createRecipe function
    // In production, this would save to a real database
    const { createRecipe } = await import('../../../lib/db');
    const createdRecipe = await createRecipe(newRecipe);
    
    return NextResponse.json({
      success: true,
      data: createdRecipe,
      message: 'Recipe created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating recipe:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create recipe',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

