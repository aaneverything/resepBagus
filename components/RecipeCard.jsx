export default function RecipeCard({ recipe }) {
  return (
    <div className="relative group overflow-hidden rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105">
      {/* Gambar Resep */}
      {recipe.imageUrl && (
        <img 
          src={recipe.imageUrl} 
          alt={recipe.title}
          className="w-full h-48 object-cover"
        />
      )}

      {/* Overlay Blur dan Judul */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/70 to-transparent backdrop-blur-sm px-4 py-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out">
        <h3 className="text-white text-sm font-semibold">{recipe.title}</h3>
      </div>

      {/* Deskripsi (diluar gambar) */}
      <div className="bg-white px-4 py-3">
        <p className="text-gray-600 text-sm">{recipe.description}</p>
      </div>
    </div>
  );
}
