"use client";

import { useState } from "react";

export default function CreateRecipe() {
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleAddStep = () => {
    setSteps([...steps, ""]);
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Buat Resep Baru</h1>
        <button className="bg-rose-200 text-rose-700 px-4 py-1 rounded-md hover:bg-rose-300">Save</button>
      </div>

      <input type="text" placeholder="Judul Resep" className="w-full border p-2 rounded mb-4" />

      <img
        src="https://source.unsplash.com/featured/?food"
        alt="preview"
        className="w-full h-64 object-cover rounded-lg mb-4"
      />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input type="text" placeholder="Lama waktu: 35 menit" className="border p-2 rounded" />
        <input type="text" placeholder="Serving: 5 porsi" className="border p-2 rounded" />
      </div>

      <textarea placeholder="Deskripsi" className="w-full border p-2 rounded mb-4" />

      <div className="mb-4">
        <label className="font-semibold mb-2 block">Bahan:</label>
        {ingredients.map((ing, i) => (
          <input
            key={i}
            value={ing}
            onChange={(e) => handleIngredientChange(i, e.target.value)}
            className="w-full border p-2 rounded mb-2"
            placeholder={`Bahan ${i + 1}`}
          />
        ))}
        <button onClick={handleAddIngredient} className="text-sm text-blue-600 hover:underline">
          + Tambah Bahan
        </button>
      </div>

      <div className="mb-4">
        <label className="font-semibold block mb-2">Cara Memasak:</label>
        {steps.map((step, i) => (
          <div key={i} className="mb-2">
            <label className="font-medium text-sm mb-1 block">Step {i + 1}</label>
            <input
              value={step}
              onChange={(e) => handleStepChange(i, e.target.value)}
              className="w-full border p-2 rounded"
              placeholder={`Langkah ${i + 1}`}
            />
          </div>
        ))}
        <button onClick={handleAddStep} className="text-sm text-blue-600 hover:underline mt-2">
          + Tambah Step
        </button>
      </div>
    </div>
  );
}
