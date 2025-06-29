import { prisma } from "@/lib/prisma";

export async function POST(req) {
    const body = await req.json();
    const { bahan = [], judul = "", top_n = 5 } = body;

    // === Search by judul only ===
    if (judul && bahan.length === 0) {
        const recipes = await prisma.recipe.findMany({
            where: {
                title: {
                    contains: judul,
                    mode: "insensitive",
                },
            },
            include: {
                ingredients: true,
                author: { select: { name: true } },
            },
            take: top_n,
        });

        const results = recipes.map((recipe) => ({
            id: recipe.id,
            judul: recipe.title,
            bahan: recipe.ingredients.map((ing) => ing.name).join(", "),
            author: recipe.author?.name,
        }));

        return Response.json(results);
    }

    // === Search by bahan ===
    if (bahan.length > 0) {
        const endpoint = process.env.NEXT_PUBLIC_SEARCH_API;
        console.log("Search API body:", body);
        if (!endpoint) {
            return Response.json(
                { error: "Search API endpoint not configured" },
                { status: 500 }
            );
        }

        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            return Response.json(
                { error: "Failed to fetch from AI Search API" },
                { status: 500 }
            );
        }

        const data = await res.json();
        console.log("AI Search response:", data);
        const result = Array.isArray(data) ? data : [data];
        console.log("AI Search results:", result);

        const allRecipes = await prisma.recipe.findMany({
            include: {
                ingredients: true,
                author: { select: { name: true } },
            },
        });

        const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9\s]/g, "");

        const matched = result.map((item) => {
            const normJudulAI = normalize(item.judul || "");
            const match = allRecipes.find((r) =>
                normalize(r.title).includes(normJudulAI) ||
                r.ingredients.some(ing => normalize(item.bahan || "").includes(normalize(ing.name)))
            );
            return {
                ...item,
                id: match?.id || null,
                author: match?.author?.name || null,
            };
        });

        return Response.json(matched);
    }

    // === Jika tidak ada input ===
    return Response.json([]);
}
