"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CreateRecipePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [judul, setJudul] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef();

  // Redirect ke login jika belum login
  if (status === "loading") return <div>Loading...</div>;
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

  // Dynamic ingredient/step handlers
  const handleIngredientChange = (idx, value) => {
    setIngredients(ings => ings.map((ing, i) => i === idx ? value : ing));
  };
  const addIngredient = () => setIngredients([...ingredients, ""]);
  const removeIngredient = idx => setIngredients(ings => ings.length > 1 ? ings.filter((_, i) => i !== idx) : ings);

  const handleStepChange = (idx, value) => {
    setSteps(sts => sts.map((s, i) => i === idx ? value : s));
  };
  const addStep = () => setSteps([...steps, ""]);
  const removeStep = idx => setSteps(sts => sts.length > 1 ? sts.filter((_, i) => i !== idx) : sts);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("ingredients", JSON.stringify(ingredients.filter(Boolean)));
    formData.append("steps", JSON.stringify(steps.filter(Boolean)));
    if (foto) formData.append("foto", foto);
    const res = await fetch("/api/recipes", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess("Resep berhasil dibuat!");
      setJudul(""); setIngredients([""]); setSteps([""]); setFoto(null); setPreview(null);
      setTimeout(() => router.push(`/recipes/${data.id}`), 1500);
    } else {
      setError(data.error || "Gagal membuat resep");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Buat Resep Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Judul Resep</label>
          <input type="text" value={judul} onChange={e => setJudul(e.target.value)} required className="border px-3 py-2 rounded w-full" />
        </div>
        <div>
          <label className="block font-medium mb-1">Bahan-bahan</label>
          {ingredients.map((ing, idx) => (
            <div key={idx} className="flex gap-2 mb-1">
              <input type="text" value={ing} onChange={e => handleIngredientChange(idx, e.target.value)} required className="border px-3 py-2 rounded w-full" placeholder={`Bahan ${idx+1}`} />
              <button type="button" onClick={() => removeIngredient(idx)} className="px-2 text-red-500">-</button>
              {idx === ingredients.length-1 && <button type="button" onClick={addIngredient} className="px-2 text-green-600">+</button>}
            </div>
          ))}
        </div>
        <div>
          <label className="block font-medium mb-1">Langkah-langkah</label>
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-2 mb-1">
              <input type="text" value={step} onChange={e => handleStepChange(idx, e.target.value)} required className="border px-3 py-2 rounded w-full" placeholder={`Langkah ${idx+1}`} />
              <button type="button" onClick={() => removeStep(idx)} className="px-2 text-red-500">-</button>
              {idx === steps.length-1 && <button type="button" onClick={addStep} className="px-2 text-green-600">+</button>}
            </div>
          ))}
        </div>
        <div>
          <label className="block font-medium mb-1">Foto Resep (opsional)</label>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFotoChange} className="border px-3 py-2 rounded w-full" />
          {preview && <img src={preview} alt="Preview" className="mt-2 max-h-40 rounded" />}
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? "Menyimpan..." : "Buat Resep"}</button>
      </form>
    </div>
  );
}
