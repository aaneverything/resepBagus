"use client";
import { useRef, useState } from "react";

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
    <form onSubmit={handleSubmit} className="space-y-2">
      <label className="block">
        URL Foto:
     <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="block mt-1"
        />
      </label>
      <img src={preview} alt="Preview" className="w-20 h-20 rounded-full object-cover border" />
      <label className="block">
        Nama:
        <input
          className="border px-2 py-1 rounded ml-2"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <button className="bg-blue-500 text-white px-4 py-1 rounded" type="submit">
        Simpan Perubahan
      </button>
      {message && <div className="text-green-600">{message}</div>}
    </form>
  );
}