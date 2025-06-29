"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function EditRecipePage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = params;
  
  const [judul, setJudul] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);
  const [tags, setTags] = useState([""]);
  const [foto, setFoto] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) {
    if (typeof window !== "undefined") router.replace("/login");
    return <div>Redirecting...</div>;
  }

  // Fetch recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        if (!res.ok) throw new Error("Failed to fetch recipe");
        
        const recipe = await res.json();
        setJudul(recipe.title);
        setDescription(recipe.description || "");
        setIngredients(recipe.ingredients.map(ing => ing.name));
        setSteps(recipe.steps.sort((a, b) => a.order - b.order).map(step => step.content));
        setTags(recipe.tags.map(t => t.tag.name));
        setCurrentImage(recipe.image);
      } catch (error) {
        setError("Gagal memuat data resep");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

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

  // Dynamic handlers
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

  const handleTagChange = (idx, value) => {
    setTags(tgs => tgs.map((tag, i) => i === idx ? value : tag));
  };
  const addTag = () => setTags([...tags, ""]);
  const removeTag = idx => setTags(tgs => tgs.length > 1 ? tgs.filter((_, i) => i !== idx) : tgs);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("description", description);
    formData.append("ingredients", JSON.stringify(ingredients.filter(Boolean)));
    formData.append("steps", JSON.stringify(steps.filter(Boolean)));
    formData.append("tags", JSON.stringify(tags.filter(Boolean)));
    if (foto) formData.append("foto", foto);
    
    try {
      const res = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuccess("Resep berhasil diperbarui!");
        setTimeout(() => router.push(`/recipes/${id}`), 1500);
      } else {
        setError(data.error || "Gagal memperbarui resep");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memperbarui resep");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-xl mx-auto p-4 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Resep</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Judul Resep</label>
          <input type="text" value={judul} onChange={e => setJudul(e.target.value)} required className="border px-3 py-2 rounded w-full" />
        </div>
        <div>
          <label className="block font-medium mb-1">Deskripsi Resep</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="border px-3 py-2 rounded w-full" placeholder="Deskripsi singkat tentang resep ini..." />
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
          <label className="block font-medium mb-1">Tags/Kategori</label>
          {tags.map((tag, idx) => (
            <div key={idx} className="flex gap-2 mb-1">
              <input type="text" value={tag} onChange={e => handleTagChange(idx, e.target.value)} className="border px-3 py-2 rounded w-full" placeholder={`Tag ${idx+1} (misal: Makanan Sehat, Dessert, dll)`} />
              <button type="button" onClick={() => removeTag(idx)} className="px-2 text-red-500">-</button>
              {idx === tags.length-1 && <button type="button" onClick={addTag} className="px-2 text-green-600">+</button>}
            </div>
          ))}
        </div>
        <div>
          <label className="block font-medium mb-1">Foto Resep</label>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFotoChange} className="border px-3 py-2 rounded w-full" />
          
          {/* Current Image */}
          {currentImage && !preview && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Foto saat ini:</p>
              <img src={currentImage} alt="Current" className="max-h-40 rounded" />
            </div>
          )}
          
          {/* Preview new image */}
          {preview && <img src={preview} alt="Preview" className="mt-2 max-h-40 rounded" />}
        </div>
        
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={saving}>
            {saving ? "Menyimpan..." : "Perbarui Resep"}
          </button>
          <button 
            type="button" 
            onClick={() => router.push(`/recipes/${id}`)}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
