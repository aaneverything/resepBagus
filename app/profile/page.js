'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8 bg-white">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border rounded-xl shadow-md p-6">
          {/* Foto Profil */}
          <div className="flex-shrink-0">
            <Image
              src="/images/profile.jpg"
              alt="Afung"
              width={160}
              height={160}
              className="rounded-xl object-cover"
            />
          </div>

          {/* Detail Profil */}
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Afung</h2>
              </div>
              <div className="mt-4 md:mt-0">
                <button className="bg-red-400 text-white px-4 py-2 rounded-full text-sm hover:bg-red-500 transition-colors">
                  Edit Profil
                </button>
              </div>
            </div>

            {/* Informasi Kontak */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-1">Phone</h4>
                <p className="text-blue-600">+1 123 456 7890</p>

                <h4 className="font-semibold mt-4 mb-1">Email</h4>
                <p className="text-blue-600">hello@afung.com</p>
              </div>

              <div>
                <h4 className="font-semibold mb-1">Address</h4>
                <p>525 E 68th Street<br />New York, NY 10561</p>
              </div>
            </div>
          </div>
        </div>

        {/* Garis Pemisah */}
        <hr className="my-10 border-t border-gray-300" />

        {/* Resep yang Pernah Dibuat */}
        <section>
          <h2 className="text-xl font-bold mb-4">Resepku</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Kartu resep dummy */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg shadow-sm p-4">
                <Image
                  src={`/images/resep${i}.jpg`}
                  alt={`Resep ${i}`}
                  width={300}
                  height={180}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
                <h3 className="text-lg font-semibold">Resep {i}</h3>
                <p className="text-sm text-gray-500">Deskripsi singkat resep {i}.</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
