const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateImages() {
  const updates = [];

  fs.createReadStream('./recipes_with_single_image.csv') // Ganti dengan path file CSV Anda
    .pipe(csv())
    .on('data', (row) => {
      const { Title, Image_Sources } = row;

      // Tambahkan operasi update ke array
      updates.push(
        prisma.recipe.updateMany({
          where: { title: Title },
          data: { image: Image_Sources },
        })
      );
    })
    .on('end', async () => {
      console.log('CSV file successfully processed.');

      try {
        // Jalankan semua operasi update
        await Promise.all(updates);
        console.log('Database updated successfully.');
      } catch (error) {
        console.error('Error updating database:', error);
      } finally {
        await prisma.$disconnect();
      }
    });
}

updateImages();