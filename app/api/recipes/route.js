import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next';
import { auth } from "@/auth";
import authOptions from 'app/auth.config';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs/promises';

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
    // Proteksi: hanya user login
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ambil form data
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

    // Simpan foto jika ada
    let imagePath = null;
    if (foto && typeof foto === 'object' && foto.size > 0) {
      const buffer = Buffer.from(await foto.arrayBuffer());
      const filename = `user_${session.user.email}_${Date.now()}.${foto.name.split('.').pop()}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });
      imagePath = `/uploads/${filename}`;
      await fs.writeFile(path.join(uploadDir, filename), buffer);
    }

    // Temukan user
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 });

    // Simpan ke DB dengan tags
    const recipe = await prisma.recipe.create({
      data: {
        title: judul,
        description: description,
        image: imagePath,
        authorId: user.id,
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

    return NextResponse.json({ id: recipe.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json({ error: 'Gagal membuat resep', message: error?.message }, { status: 500 });
  }
}

