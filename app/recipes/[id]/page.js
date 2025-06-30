import { PrismaClient } from "@prisma/client";
import ReviewSection from '@/components/ReviewSection';
import StarRating from '@/components/StarRating';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import RelatedRecipes from "@/components/RelatedRecipes";
import Footer from "@/components/Footer";

const prisma = new PrismaClient();

export default async function RecipeDetail({ params }) {
  const { id } = await params;

  // Ambil data resep dari database
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      ingredients: true,
      steps: true,
      author: { select: { name: true } },
      tags: { include: { tag: true } },
      reviews: true,
      _count: { select: { reviews: true } }
    },
  });

  if (!recipe) {
    return <div className="p-8 text-center text-red-500">Resep tidak ditemukan.</div>;
  }

  // Calculate average rating
  const totalRating = recipe.reviews.reduce((sum, review) => sum + review.rating, 0);
  const avgRating = recipe.reviews.length > 0 ? totalRating / recipe.reviews.length : 0;

  return (
    <div>
    
    <div className="mx-auto max-w-4xl p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/recipes">Resep</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-6">
        <CardHeader>
          <h1 className="text-2xl font-bold mb-2">{recipe.title}</h1>
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-600">Oleh: {recipe.author?.name || "Unknown"}</div>
            <StarRating
              rating={avgRating}
              reviewCount={recipe._count.reviews}
              showCount={true}
              size="md"
            />
          </div>
        </CardHeader>
        <CardContent>
          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((recipeTag) => (
                  <Badge key={recipeTag.tag.id} variant="secondary">
                    {recipeTag.tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {recipe.image && (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-64 object-cover rounded mb-4"
            />
          )}
          {recipe.description && <p className="mb-4 text-gray-700">{recipe.description}</p>}

          <Separator className="my-6" />

          <h2 className="font-semibold mt-4 mb-2">Bahan:</h2>
          <ul className="list-disc list-inside mb-4">
            {recipe.ingredients.map((ing) => (
              <li key={ing.id}>{ing.name}</li>
            ))}
          </ul>

          <h2 className="font-semibold mt-4 mb-2">Langkah-langkah:</h2>
          <ol className="list-decimal list-inside">
            {recipe.steps
              .sort((a, b) => a.order - b.order)
              .map((step) => (
                <li key={step.id} className="mb-2">{step.content}</li>
              ))}
          </ol>
        </CardContent>
      </Card>
      {/* Related Recipes */}
      <div className="mt-6">
        <h1 className="text-xl font-semibold mb-4">Resep Terkait</h1>

        <RelatedRecipes recipeId={id} />
      </div>

      {/* Review Section */}
      <div className="mt-8 pt-8">
        <ReviewSection recipeId={recipe.id} />
      </div>
    </div>
       <Footer />
    </div>
  );
}