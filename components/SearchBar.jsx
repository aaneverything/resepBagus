"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "./ui/skeleton";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export default function SearchBar() {
  const [bahan, setBahan] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const bahanArr = bahan.includes(",")
      ? bahan.split(",").map((b) => b.trim()).filter(Boolean)
      : [];
    const judul = !bahan.includes(",") ? bahan.trim() : "";

    if (!bahan.trim()) {
      setErrorMsg("Masukkan bahan atau judul terlebih dahulu.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bahan: bahanArr, judul, top_n: 5 }),
      });
      const data = await res.json();
      setResults(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setErrorMsg("Gagal mencari resep. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const aiRes = await fetch("/api/aiFoto", {
        method: "POST",
        body: formData,
      });

      if (!aiRes.ok) {
        setErrorMsg("Gagal memproses gambar. Silakan coba lagi.");
        setLoading(false);
        return;
      }

      const aiData = await aiRes.json();
      let ingredients = Array.isArray(aiData)
        ? aiData.map((item) => item.label).filter(Boolean)
        : [];

      if (ingredients.length === 0) {
        setErrorMsg("Gambar tidak dikenali atau bahan tidak ditemukan.");
        setResults([]);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bahan: ingredients, top_n: 5 }),
      });

      if (!res.ok) {
        setErrorMsg("Gagal mencari resep. Silakan coba lagi.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setResults(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setErrorMsg("Terjadi kesalahan saat pencarian.");
    } finally {
      setLoading(false);
    }
  };
return (
  <div className="max-w-3xl mx-auto px-4 py-6">
    <form onSubmit={handleSearch} className="flex gap-2 mb-4">
      <Input
        type="text"
        value={bahan}
        onChange={(e) => setBahan(e.target.value)}
        placeholder="Cari resep dengan bahan (pisahkan koma) atau judul"
      />
      <Button type="submit" className="text-white">
        Cari
      </Button>
      <Button
        type="button"
        variant="outline"
        className="p-2"
        onClick={() => fileInputRef.current?.click()}
        title="Cari dengan Foto"
      >
        <Camera className="w-5 h-5" />
      </Button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
      />
    </form>

    {/* Error Message */}
    {errorMsg && (
      <div className="text-red-600 bg-red-100 p-3 rounded mb-4 text-sm">
        {errorMsg}
      </div>
    )}

    {/* Loading Indicator */}
    {loading && (
      <div className="flex items-center gap-2 text-blue-600 mb-4">
        <Loader2 className="animate-spin" size={20} />
        Mencari resep...
      </div>
    )}

    {/* Hasil Pencarian */}
    {!loading && results.length > 0 && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((item, idx) => (
          <Card
            key={item.id}
            className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50"
          >
            <Link href={`/recipes/${item.id}`} key={idx} className="block h-full">
              <div className="relative aspect-[4/3] overflow-hidden">
                {item.image ? (
                  <>
                    <img
                      src={item.image}
                      alt={item.title}
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
                {item.avgRating > 0 && (
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-lg">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-medium text-gray-800">
                      {item.avgRating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col h-[calc(100%-12rem)]">
                {/* Header */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200 mb-2">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {item.description}
                    </p>
                  )}

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          {tag.tag ? tag.tag.name : tag.name}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Author */}
                <div className="flex items-center gap-2 pt-2">
                  <Avatar className="h-7 w-7 border-2 border-white shadow-sm">
                    <AvatarImage src={item.author?.image} />
                    <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-primary/20 to-primary/10">
                      {item.author?.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.author?.name || "Unknown"}
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
    )}
  </div>
);
}