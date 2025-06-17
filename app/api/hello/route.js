import { NextResponse } from 'next/server';
import { PrismaClient } from 'lib/generated/prisma'; // path custom sesuai output kamu

if (typeof window !== 'undefined') {
  throw new Error('Prisma Client is not supported in the browser.');
}

const prisma = new PrismaClient();
export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany();
    return NextResponse.json(recipes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
