import { prisma } from "@/lib/prisma";

// filepath: /home/jokowi/ourrecipes/app/api/search/route.js
export async function POST(req) {
    const body = await req.json();

    const endpoint = process.env.NEXT_PUBLIC_SEARCH_API;
    console.log("Endpoint:", endpoint);
    const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const data = await res.json();

    const result = Array.isArray(data) ? data : [data];

    const recipes = await prisma.recipe.findMany({
        where: {
            OR: result.map(item => ({
                title: {
                    contains: item.judul,
                    mode: 'insensitive',
                }
            }))
        },
        select: {
            id: true,
            title: true,
            description: true,
        }
    });

    const mergedResults = result.map(item => {
        const recipe = recipes.find(r => r.judul === item.judul);
        return { ...item, id: recipe?.id || null };
    });

    return Response.json(mergedResults);
}