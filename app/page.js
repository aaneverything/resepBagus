export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">Welcome to Our Recipes!</h1>
      <p className="text-lg text-gray-600 mb-8">
        Discover and share amazing recipes from around the world.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recipe cards will go here */}
      </div>
    </div>
  );
}
