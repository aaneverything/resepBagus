"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

      const aiData = await aiRes.json();
      let ingredients = Array.isArray(aiData)
        ? aiData.map((item) => item.label).filter(Boolean)
        : [];

      if (ingredients.length === 0) {
        setErrorMsg("Gambar tidak dikenali atau bahan tidak ditemukan.");
        setResults([]);
        return;
      }

      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bahan: ingredients, top_n: 5 }),
      });

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {results.map((item, idx) =>
            item.id ? (
              <Link
                key={idx}
                href={`/recipes/${item.id}`}
                className="border rounded-lg p-4 shadow-md block hover:bg-gray-100 transition"
              >
                <h3 className="text-xl font-semibold mb-1">{item.judul}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.bahan}</p>
                {item.author && (
                  <p className="text-xs text-gray-500 italic">by {item.author}</p>
                )}
              </Link>
            ) : (
              <div
                key={idx}
                className="border rounded-lg p-4 shadow-md opacity-50 bg-gray-50"
              >
                <h3 className="text-xl font-semibold mb-1">{item.judul || "Tidak ditemukan"}</h3>
                <p className="text-sm text-gray-600 mb-1">{item.bahan || "-"}</p>
                <div className="text-xs text-red-500">Resep tidak ditemukan di database</div>
              </div>
            )
          )}
        </div>
      )}

      {!loading && results.length === 0 && bahan && (
        <div className="text-center text-gray-500 mt-6 text-sm">
          Tidak ada hasil ditemukan.
        </div>
      )}
    </div>
  );
}
