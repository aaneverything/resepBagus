"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Clock } from "lucide-react";

export default function PopularRecipes() {
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularRecipes = async () => {
      try {
        const res = await fetch("/api/recipes/popular");
        const data = await res.json();
        setPopularRecipes(data);
      } catch (error) {
        console.error("Error fetching popular recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularRecipes();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} className="h-60 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (popularRecipes.length === 0) {
    return <div className="text-gray-500">Belum ada resep populer.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {popularRecipes.map((recipe) => (
        <Card
          key={recipe.id}
          className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50"
        >
          <Link href={`/recipes/${recipe.id}`} className="block h-full">
            <div className="relative aspect-[4/3] overflow-hidden">
              {recipe.image ? (
                <>
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}

              {/* Rating Badge */}
              {recipe.avgRating > 0 && (
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-lg">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-medium text-gray-800">
                    {recipe.avgRating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 flex flex-col h-[calc(100%-12rem)]">
              {/* Header */}
              <div className="flex-1">
                <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200 mb-2">
                  {recipe.title}
                </h3>

                {recipe.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {recipe.description}
                  </p>
                )}

                {recipe.tags && recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {recipe.tags.slice(0, 3).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        {tag.tag ? tag.tag.name : tag.name}
                      </Badge>
                    ))}
                    {recipe.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{recipe.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Author */}
              <div className="flex items-center gap-2 pt-2">
                <Avatar className="h-7 w-7 border-2 border-white shadow-sm">
                  <AvatarImage src={recipe.author?.image} />
                  <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-primary/20 to-primary/10">
                    {recipe.author?.name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {recipe.author?.name || "Unknown"}
                  </p>
                </div>

                {/* Action indicator */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg
                    className="w-4 h-4 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  );
}
