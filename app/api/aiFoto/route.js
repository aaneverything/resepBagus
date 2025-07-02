import { prisma } from "@/lib/prisma";

export async function POST(req) {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!(file instanceof File) || file.size === 0) {
        return Response.json({ message: "No image provided" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
        return Response.json({ message: "File terlalu besar" }, { status: 400 });
    }

    // 1. Siapkan data untuk AI API
    const buffer = Buffer.from(await file.arrayBuffer());

    // 2. Debug endpoint
    const endpoint = process.env.NEXT_PUBLIC_FOTO_API;
    if (!endpoint) {
        return Response.json({
            message: "AI Foto endpoint not configured"
        }, { status: 500 });
    }

    // 3. Kirim ke AI API langsung tanpa simpan file
    try {
        const aiFormData = new FormData();
        const blob = new Blob([buffer], { type: file.type });
        aiFormData.append("image", blob, file.name);

        const res = await fetch(endpoint, {
            method: "POST",
            body: aiFormData,
        });

        console.log("AI API status:", res.status);

        if (!res.ok) {
            const text = await res.text();
            console.error("AI API error:", res.status, text);
            return Response.json({
                message: "Failed to process image",
                error: text
            }, { status: res.status });
        }

        const data = await res.json();
        console.log("AI API response:", data);

        return Response.json(data);

    } catch (error) {
        console.error("Fetch error:", error);
        return Response.json({
            message: "Network error",
            error: error.message
        }, { status: 500 });
    }
}