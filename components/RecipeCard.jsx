import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/StarRating";

export default function RecipeCard({ recipe }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
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

          {recipe.avgRating > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={recipe.avgRating} size="sm" />
              <span className="text-sm text-muted-foreground">
                ({recipe.reviewCount} review{recipe.reviewCount !== 1 ? 's' : ''})
              </span>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={recipe.author?.image} />
              <AvatarFallback>{recipe.author?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {recipe.author?.name}
            </span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}