export default function Footer() {
    return (
      <footer className="bg-gray-100 mt-10 py-8 px-6 text-sm text-gray-600">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="font-bold text-lg mb-2">🥗 Resepku</h2>
            <p>Deskripsi perusahaan dan layanan</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Kontak</h3>
            <p>Alamat / Email / Telepon</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Link</h3>
            <p>Tautan penting lainnya</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Subscribe</h3>
            <input type="email" placeholder="Email" className="p-2 rounded border w-full mb-2" />
            <button className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded w-full">Subscribe</button>
          </div>
        </div>
      </footer>
    );
  }
  