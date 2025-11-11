import React, { useState, useEffect } from "react";
import axios from "axios";

const Resep = () => {
  const [resep, setResep] = useState([]);

  // Fetch data resep
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resepResponse = await axios.get("http://localhost:3000/resep");

        // Kelompokkan data resep berdasarkan menu
        const groupedResep = resepResponse.data.reduce((acc, item) => {
          const produkId = item.idProduk;
          if (!acc[produkId]) {
            acc[produkId] = {
              produk: item.produk?.nama || "Produk Tidak Ditemukan",
              bahan: [],
            };
          }
          acc[produkId].bahan.push({
            namaBahan: item.bahan?.namaBahan || "Bahan Tidak Ditemukan",
            kuantitas: item.kuantitas || 0,
            satuanPakai: item.satuanPakai || "-",
          });
          return acc;
        }, {});

        setResep(Object.values(groupedResep));
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        alert("Terjadi kesalahan saat mengambil data. Pastikan backend berjalan.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Daftar Resep
      </h1>

      {/* Tabel Resep */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Resep</h2>
        {resep.length === 0 ? (
          <p className="text-center text-gray-500 italic">Tidak ada resep.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Produk</th>
                <th className="border border-gray-300 p-2">Bahan</th>
              </tr>
            </thead>
            <tbody>
              {resep.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 p-2">{item.produk}</td>
                  <td className="border border-gray-300 p-2">
                    {item.bahan.map((bahan, i) => (
                      <div key={i}>
                        {bahan.namaBahan} - {bahan.kuantitas} {bahan.satuanPakai}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Resep;