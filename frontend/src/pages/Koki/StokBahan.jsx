import React, { useState, useEffect } from "react";
import axios from "axios";

const KokiStokBahan = () => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lowStockItems, setLowStockItems] = useState([]);

  const API_URL = "http://localhost:3000/stok-bahan"; // Endpoint API Anda

  // Fetch data stok bahan dari API
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get(API_URL);
        setStock(response.data);
        setLoading(false);

        // Cari bahan dengan stok rendah (jumlah < 10)
        const lowStock = response.data.filter((item) => item.jumlah < 10);
        setLowStockItems(lowStock);
      } catch (err) {
        console.error("Error fetching stock:", err);
        setError("Gagal memuat data stok bahan.");
        setLoading(false);
      }
    };

    fetchStock();
  }, []);

  // Fungsi untuk menentukan kelas warna berdasarkan jumlah stok
  const getStockClass = (jumlah) => {
    if (jumlah < 10) return "text-red-500 font-bold"; // Sedikit (Merah)
    if (jumlah >= 10 && jumlah <= 15) return "text-orange-500 font-bold"; // Sedang (Oranye)
    return "text-green-500 font-bold"; // Banyak (Hijau)
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Laporan Stok Bahan</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Notifikasi Stok Rendah */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold">Peringatan Stok Rendah</h2>
          <ul className="list-disc pl-5">
            {lowStockItems.map((item) => (
              <li key={item.id}>
                {item.namaBahan} - Sisa {item.jumlah} {item.satuan}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Loader */}
      {loading ? (
        <p className="text-center text-gray-500">Memuat data stok bahan...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Daftar Stok Bahan</h2>
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border border-gray-300">ID</th>
                <th className="py-2 px-4 border border-gray-300">Nama Bahan</th>
                <th className="py-2 px-4 border border-gray-300">Jumlah</th>
                <th className="py-2 px-4 border border-gray-300">Satuan</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border border-gray-300 text-center">{item.id}</td>
                  <td className="py-2 px-4 border border-gray-300">{item.namaBahan}</td>
                  <td className={`py-2 px-4 border border-gray-300 ${getStockClass(item.jumlah)}`}>
                    {item.jumlah}
                  </td>
                  <td className="py-2 px-4 border border-gray-300 text-center">{item.satuan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default KokiStokBahan;