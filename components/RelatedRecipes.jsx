"use client"
import React from 'react'
import Link from 'next/link';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from './ui/skeleton';

const RelatedRecipes = ({recipeId}) => {
  const [relatedRecipes, setRelatedRecipes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");

React.useEffect(() => {
  if (!recipeId) {
    setError("Recipe ID is required");
    setLoading(false);
    return;
  }

  const fetchRelatedRecipes = async () => {
    try {
      const res = await fetch('/api/recipes/related?recipeId=' + recipeId);
      if (!res.ok) throw new Error('Failed to fetch related recipes');
      console.log('Fetching related recipes for recipeId:', recipeId);
      const data = await res.json();
      setRelatedRecipes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchRelatedRecipes();
}, [recipeId]); // Tambahkan recipeId di sini
    if (loading) {
        console.log('Loading related recipes for recipeId:', recipeId);
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
                    <Skeleton key={index} className="h-60 w-full rounded-lg" />
                ))}
            </div>
        );
    }
    if (error) {
        console.error('Error fetching related recipes:', error);
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
    <>
      {relatedRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedRecipes.map((recipe) => (
           <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/recipes/${recipe.id}`}>
        {recipe.image && (
          <div className="aspect-video overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <CardHeader className="pb-2">
          <h3 className="font-semibold text-lg line-clamp-2">{recipe.title}</h3>
          {recipe.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {recipe.description}
            </p>
          )}
        </CardHeader>
        <CardContent className="pb-2">
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {recipe.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag.tag.name}
                </Badge>
              ))}
              {recipe.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{recipe.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No related recipes found.</div>
      )}
    </>
  )
}

export default RelatedRecipes