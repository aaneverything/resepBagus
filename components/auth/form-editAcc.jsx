"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Camera } from "lucide-react"; // pastikan lucide-react sudah terpasang
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function EditAccountForm({ user }) {
  const [name, setName] = useState(user.name);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(user.image || "https://ui-avatars.com/api/?name=User&background=random");
  const fileInputRef = useRef();
  const [image, setImage] = useState(user.image || "https://ui-avatars.com/api/?name=User&background=random");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (fileInputRef.current.files[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }

    const res = await fetch("/api/account", {
      method: "PUT",
      body: formData,
    });

    let data = {};
    try {
      data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage("Gagal update akun. Pastikan API mengembalikan JSON.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
    <div className="mx-auto mb-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/account">Resep</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      </div>
    
    <Card className="p-6 max-w-lg mx-auto space-y-4 shadow">

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar Preview */}
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={preview} />
            <AvatarFallback>{name?.[0] || "U"}</AvatarFallback>
          </Avatar>
<div>
  <input
    type="file"
    accept="image/*"
    ref={fileInputRef}
    onChange={handleImageChange}
    className="hidden"
    id="upload-photo"
  />
  
  <label
    htmlFor="upload-photo"
    className="cursor-pointer flex items-center justify-center gap-2 border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm rounded-lg px-4 py-3 transition-colors"
  >
    <Camera className="w-5 h-5" />
    <span>Upload Foto</span>
  </label>
</div>

        </div>

        {/* Input Nama */}
        <div>
          <Label htmlFor="name">Nama</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Simpan Perubahan
        </Button>

        {/* Feedback Message */}
        {message && (
          <div
            className={`text-sm px-3 py-2 rounded mt-2 ${res.ok ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`}
          >
            {message}
          </div>
        )}
      </form>
    </Card>
    </>
  );
}
