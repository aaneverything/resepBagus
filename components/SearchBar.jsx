"use client";
import { useRef, useState } from "react";
import Link from "next/link";

export default function SearchBar() {
  const [bahan, setBahan] = useState("");
  // const [judul, setJudul] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);


  //search by bahan
  const handleSearch = async (e) => {
    e.preventDefault();
   
    //kondisi jika ada koma
    const bahanArr = bahan.includes(",")
      ? bahan.split(",").map(b => b.trim()).filter(Boolean)
      : [];
    const judul = !bahan.includes(",") ? bahan : "";

    
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bahan: bahanArr,
        judul,
        top_n: 5
      })
    });
    const data = await res.json();
    setResults(Array.isArray(data) ? data : [data]);
  };

  //search by foto 

  const handlePhotoSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    if (fileInputRef.current.files[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    } else {
      setLoading(false);
      return;
    }
    // Kirim ke endpoint ai-foto
    const aiRes = await fetch("/api/ai-foto", {
      method: "POST",
      body: formData,
    });
    const aiData = await aiRes.json();
    // aiData.bahan harus array of string
    if (!aiData.bahan || !Array.isArray(aiData.bahan)) {
      setResults([]);
      setLoading(false);
      return;
    }
    // Lanjutkan ke search by bahan
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bahan: aiData.bahan,
        top_n: 5
      })
    });
    const data = await res.json();
    setResults(Array.isArray(data) ? data : [data]);
    setLoading(false);
  };


  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={bahan}
          onChange={e => setBahan(e.target.value)}
          placeholder="Cari resep dengan bahan (pisahkan koma) atau judul"
          className="border px-3 py-2 rounded w-full"
        />
        <button className="bg-blue-500 text-white px-4 rounded">Cari</button>
      </form>
       {/* <input
          type="text"
          value={judul}
          onChange={e => setJudul(e.target.value)}
          placeholder="Cari resep berdasarkan judul"
          className="border px-3 py-2 rounded w-full"
        />
        <button className="bg-blue-500 text-white px-4 rounded">Cari</button> */}
      <form onSubmit={handlePhotoSearch} className="flex gap-2 mb-4">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="border px-3 py-2 rounded w-full"
        />
        <button className="bg-blue-500 text-white px-4 rounded">Cari dengan Foto</button>
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