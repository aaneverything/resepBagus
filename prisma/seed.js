const { PrismaClient } = require('../lib/generated/prisma'); // ✅ SESUAI DENGAN output
const prisma = new PrismaClient();


async function main() {
  // Create users
  const user1 = await prisma.user.create({
    data: {
      id: "user1",
      name: "Aan Kruger",
      email: "aan@example.com",
      password: "hashed_password_aan"
    }
  });

  const user2 = await prisma.user.create({
    data: {
      id: "user2",
      name: "Sari Dewi",
      email: "sari@example.com",
      password: "hashed_password_sari"
    }
  });

  const user3 = await prisma.user.create({
    data: {
      id: "user3",
      name: "Bayu Nugraha",
      email: "bayu@example.com",
      password: "hashed_password_bayu"
    }
  });

  // Create recipes
  await prisma.recipe.createMany({
    data: [
      {
        id: "recipe1",
        title: "Nasi Goreng Spesial",
        description: "Nasi goreng dengan telur, ayam, dan bumbu lengkap.",
        authorId: "user1"
      },
      {
        id: "recipe2",
        title: "Soto Ayam Bening",
        description: "Soto ayam khas Jawa Tengah, ringan dan segar.",
        authorId: "user2"
      },
      {
        id: "recipe3",
        title: "Pisang Goreng Renyah",
        description: "Pisang goreng dengan balutan tepung krispi.",
        authorId: "user1"
      }
    ]
  });

  // Ingredients
  await prisma.ingredient.createMany({
    data: [
      { id: "ing1", name: "Nasi Putih", recipeId: "recipe1" },
      { id: "ing2", name: "Telur", recipeId: "recipe1" },
      { id: "ing3", name: "Ayam Suwir", recipeId: "recipe1" },
      { id: "ing4", name: "Bihun", recipeId: "recipe2" },
      { id: "ing5", name: "Pisang Raja", recipeId: "recipe3" },
      { id: "ing6", name: "Tepung Terigu", recipeId: "recipe3" }
    ]
  });

  // Steps
  await prisma.step.createMany({
    data: [
      { id: "step1", order: 1, content: "Panaskan minyak.", recipeId: "recipe1" },
      { id: "step2", order: 2, content: "Tumis bumbu, masukkan nasi dan ayam.", recipeId: "recipe1" },
      { id: "step3", order: 1, content: "Rebus ayam dengan rempah.", recipeId: "recipe2" },
      { id: "step4", order: 2, content: "Masukkan bihun dan daun seledri.", recipeId: "recipe2" },
      { id: "step5", order: 1, content: "Campur tepung dengan air.", recipeId: "recipe3" },
      { id: "step6", order: 2, content: "Goreng pisang hingga keemasan.", recipeId: "recipe3" }
    ]
  });

  // Reviews
  await prisma.review.createMany({
    data: [
      {
        id: "rev1",
        content: "Rasanya enak banget, bumbunya pas!",
        rating: 5,
        userId: "user2",
        recipeId: "recipe1"
      },
      {
        id: "rev2",
        content: "Cocok untuk makan siang.",
        rating: 4,
        userId: "user3",
        recipeId: "recipe1"
      },
      {
        id: "rev3",
        content: "Segar dan gurih!",
        rating: 5,
        userId: "user1",
        recipeId: "recipe2"
      },
      {
        id: "rev4",
        content: "Pisangnya manis dan renyah.",
        rating: 4,
        userId: "user2",
        recipeId: "recipe3"
      }
    ]
  });

  // Tags
  await prisma.tag.createMany({
    data: [
      { id: "tag1", name: "cepat" },
      { id: "tag2", name: "vegan" },
      { id: "tag3", name: "tradisional" }
    ]
  });

  // RecipeTag
  await prisma.recipeTag.createMany({
    data: [
      { recipeId: "recipe1", tagId: "tag1" },
      { recipeId: "recipe2", tagId: "tag3" },
      { recipeId: "recipe3", tagId: "tag1" }
    ]
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
