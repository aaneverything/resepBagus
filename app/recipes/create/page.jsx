"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import RecipeStepItem from "@/components/RecipeStepItem"; // Buat komponen ini dari jawaban sebelumnya
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export default function CreateRecipePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [judul, setJudul] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([{ id: Date.now(), text: "" }]);
  const [tags, setTags] = useState([""]);
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef();

  if (status === "loading") return <div className="">Loading...</div>;
  if (!session) {
    if (typeof window !== "undefined") router.replace("/login");
    return <div>Redirecting...</div>;
  }

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    setFoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleIngredientChange = (idx, value) => {
    setIngredients((ings) => ings.map((ing, i) => (i === idx ? value : ing)));
  };
  const addIngredient = () => setIngredients([...ingredients, ""]);
  const removeIngredient = (idx) => setIngredients((ings) => ings.length > 1 ? ings.filter((_, i) => i !== idx) : ings);

  const updateStepText = (index, value) => {
    const newSteps = [...steps];
    newSteps[index].text = value;
    setSteps(newSteps);
  };
  const addStepAfter = (index) => {
    const newSteps = [...steps];
    newSteps.splice(index + 1, 0, { id: Date.now(), text: "" });
    setSteps(newSteps);
  };
  const deleteStep = (index) => {
    if (steps.length > 1) setSteps(steps.filter((_, i) => i !== index));
  };

  const handleTagChange = (idx, value) => {
    setTags((tgs) => tgs.map((tag, i) => (i === idx ? value : tag)));
  };
  const addTag = () => setTags([...tags, ""]);
  const removeTag = (idx) => setTags((tgs) => tgs.length > 1 ? tgs.filter((_, i) => i !== idx) : tgs);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("description", description);
    formData.append("ingredients", JSON.stringify(ingredients.filter(Boolean)));
    formData.append("steps", JSON.stringify(steps.map((s) => s.text).filter(Boolean)));
    formData.append("tags", JSON.stringify(tags.filter(Boolean)));
    if (foto) formData.append("foto", foto);

    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Resep berhasil dibuat!");
        setJudul("");
        setDescription("");
        setIngredients([""]);
        setSteps([{ id: Date.now(), text: "" }]);
        setTags([""]);
        setFoto(null);
        setPreview(null);
        setTimeout(() => router.push(`/recipes/${data.id}`), 1500);
      } else {
        setError(data.error || "Gagal membuat resep");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat membuat resep");
    } finally {
      setLoading(false);
    }
  };

  

 return (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-xl mx-auto px-1 mb-2">
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
              <Link href="/recipes">Resep</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>

    <main className="max-w-xl mx-auto p-6 space-y-6 border rounded-xl shadow-md bg-white">
      {/* Header & Save button */}
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Buat Resep Baru</h1>
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-pink-100 text-pink-600 px-4 py-1 rounded-full shadow-sm text-sm hover:bg-pink-200 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Save"}
        </button>
      </div>

      {/* Notifikasi */}
      {error && (
        <div className="text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded text-sm">
          {success}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Judul */}
        <div>
          <label className="block font-medium text-sm text-gray-700 mb-1">Judul Resep :</label>
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
            className="border px-3 py-2 rounded w-full focus:outline-none focus:ring focus:border-pink-300"
          />
        </div>

        {/* Preview Foto */}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-64 object-cover rounded-md shadow"
          />
        )}

        {/* Upload Foto */}
        <div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFotoChange}
            className="border px-3 py-2 rounded w-full text-sm"
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block font-medium text-sm text-gray-700 mb-1">Deskripsi :</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="border px-3 py-2 rounded w-full resize-none focus:outline-none focus:ring focus:border-pink-300"
          />
        </div>

        {/* Bahan */}
        <div>
          <label className="block font-medium text-sm text-gray-700 mb-2">Bahan :</label>
          <div className="space-y-2">
            {ingredients.map((ing, idx) => (
              <RecipeStepItem
                key={idx}
                step={ing}
                onChange={(value) => handleIngredientChange(idx, value)}
                onAdd={() => addIngredient(idx)}
                onDelete={() => removeIngredient(idx)}
                onAddAttachment={() => handleAddAttachment(idx)}
              />
            ))}
          </div>
        </div>

        {/* Langkah */}
        <div>
          <label className="block font-medium text-sm text-gray-700 mb-2">Cara Memasak :</label>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <RecipeStepItem
                key={step.id}
                step={step}
                onChange={(value) => updateStepText(index, value)}
                onAdd={() => addStepAfter(index)}
                onDelete={() => deleteStep(index)}
                onAddAttachment={() => handleAddAttachment(index)}
              />
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block font-medium text-sm text-gray-700 mb-2">Tags/Kategori :</label>
          <div className="space-y-2">
            {tags.map((tag, idx) => (
              <RecipeStepItem
                key={idx}
                step={tag}
                onChange={(value) => handleTagChange(idx, value)}
                onAdd={() => addTag(idx)}
                onDelete={() => removeTag(idx)}
                onAddAttachment={() => handleAddAttachment(idx)}
              />
            ))}
          </div>
        </div>
      </form>
    </main>
  </div>
);
}
