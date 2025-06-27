import { prisma } from "@/lib/prisma";
import FormData from "form-data";

// filepath: /home/jokowi/ourrecipes/app/api/search/route.js
export async function POST(req) {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file || ! typeof file === "object" || file.size === 0) {
        return Response.json({ message: "No image provided" }, { status: 400 });
    }

    const body = new FormData();
    body.append("image", file, file.name);

    const endpoint = process.env.NEXT_PUBLIC_FOTO_API;
    const res = await fetch(endpoint, {
        method: "POST",
        body: body,
        headers: body.getHeaders ? body.getHeaders() : {},
    });

    if (!res.ok) {
        const text = await res.text();
        console.error("Error processing image:", text);
        return Response.json({ message: "Failed to process image" }, { status: res.status });
    }


    const data = await res.json();

    return Response.json(data);
}