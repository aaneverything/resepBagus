import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import {LogoutButton} from "@/components/atoms/Button";
import Link from "next/link";

const PLACEHOLDER = "https://ui-avatars.com/api/?name=User&background=random";


export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // Ambil data user dari database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true, image: true },
  });

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Akun Saya</h1>
      <div className="mb-4">
                <img
          src={user.image || PLACEHOLDER}
          alt="Foto Profil"
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div><b>Nama:</b> {user.name}</div>
        <div><b>Email:</b> {user.email}</div>
      </div>
      <div className="mt-6 gap-4 flex">
           <Link
          href="/account/edit"
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Edit Akun
        </Link>
        <LogoutButton />
      </div>
    </div>
  );
}