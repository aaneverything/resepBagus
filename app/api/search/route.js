import { prisma } from "@/lib/prisma";

// filepath: /home/jokowi/ourrecipes/app/api/search/route.js
export async function POST(req) {
    const body = await req.json();

    const endpoint = process.env.NEXT_PUBLIC_SEARCH_API;
    const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    const { bahan = [], judul = "", top_n = 5 } = await req.json();


    const result = Array.isArray(data) ? data : [data];

    const where = {};
    if (bahan.length > 0) {
        where.bahan = { hasSome: bahan }; // atau logika pencarian bahan kamu
    }
    if (judul) {
        where.title = { contains: judul, mode: "insensitive" };
    }

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