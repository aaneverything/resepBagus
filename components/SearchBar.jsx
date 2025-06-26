"use client";
import { useState } from "react";
import Link from "next/link";

export default function SearchBar() {
  const [bahan, setBahan] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    // Split bahan jadi array, misal: "telur, tahu" => ["telur", "tahu"]
    const bahanArr = bahan.split(",").map(b => b.trim()).filter(Boolean);

    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bahan: bahanArr,
        top_n: 5
      })
    });
    const data = await res.json();
    // Jika response array, set langsung. Jika satu objek, jadikan array.
    console.log("Hasil search:", data);
    setResults(Array.isArray(data) ? data : [data]);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={bahan}
          onChange={e => setBahan(e.target.value)}
          placeholder="Cari resep dengan bahan (pisahkan koma)"
          className="border px-3 py-2 rounded w-full"
        />
        <button className="bg-blue-500 text-white px-4 rounded">Cari</button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
{results.map((item, idx) =>
  item.id ? (
    <Link
      key={idx}
      href={`/recipes/${item.id}`}
      className="border rounded-lg p-4 shadow-md block hover:bg-gray-50 transition"
    >
      <h3 className="text-xl font-semibold mb-2">{item.judul}</h3>
      <h3 className="text-sm font-medium mb-2">{item.bahan}</h3>
    </Link>
  ) : (
    <div key={idx} className="border rounded-lg p-4 shadow-md opacity-50">
      <h3 className="text-xl font-semibold mb-2">{item.judul}</h3>
      <h3 className="text-sm font-medium mb-2">{item.bahan}</h3>
      <div className="text-xs text-red-500">Resep tidak ditemukan di database</div>
    </div>
  )
)}
      </div>
    </div>
  );
}