export const runtime = 'nodejs'
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import path from "path";
import { writeFile } from "fs/promises";

export async function PUT(req) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const image = formData.get("image");
  const name = formData.get("name");

  let imagePath = null;
  if (image && typeof image === "object" && image.size > 0) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `user_${session.user.id}_${Date.now()}.${image.name.split(".").pop()}`;
    const uploadPath = path.join(process.cwd(), "public", "uploads", filename);
    await writeFile(uploadPath, buffer);
    imagePath = `/uploads/${filename}`;
  }
  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      name,
      ...(imagePath && { image: imagePath }),
    },
  });
  return Response.json({ message: "Akun berhasil diupdate" });
}
