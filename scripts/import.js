import fs from 'fs';
import path from 'path';
import { PrismaClient } from '../lib/generated/prisma/index.js';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

const filePath = path.join(process.cwd(), 'prisma', 'Indonesian_Food_Recipes.csv');

if (typeof window !== 'undefined') {
  throw new Error('Prisma Client is not supported in the browser.');
}

async function main() {
  const fileContent = fs.readFileSync(filePath);
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  const author = await prisma.user.upsert({
    where: { email: 'seeduser@example.com' },
    update: {},
    create: {
      name: 'Seed User',
      email: 'seeduser@example.com',
      password: 'dummyhash',
    },
  });

  for (const row of records) {
    const recipe = await prisma.recipe.create({
      data: {
        title: row['Title'],
        description: row['Category'] || 'Resep khas Indonesia',
        image: row['URL'] || null,
        authorId: author.id,
        ingredients: {
          create: row['Ingredients Cleaned']
            .split(',')
            .map(i => ({ name: i.trim() })),
        },
        steps: {
          create: row['Steps']
            .split(/\d+\)\s+/) // pisahkan berdasarkan nomor
            .filter(Boolean)
            .map((step, index) => ({
              order: index + 1,
              content: step.trim(),
            })),
        },
      },
    });

    console.log(`✔️ Resep "${recipe.title}" berhasil ditambahkan.`);
  }
}

main()
  .catch(err => {
    console.error('❌ Error import:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
