import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const StokBahan = () => {
  const [stock, setStock] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]); // State untuk stok rendah
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newStock, setNewStock] = useState({ namaBahan: "", jumlah: "", satuan: "" });
  const [editingStock, setEditingStock] = useState(null);

  const API_URL = "http://localhost:3000/stok-bahan"; // Ganti dengan endpoint API Anda

  // Fungsi untuk mengambil data stok bahan
  const fetchStock = useCallback(async () => {
    try {
      const response = await axios.get(API_URL);
      setStock(response.data);

      // Filter stok rendah
      const lowStock = response.data.filter((item) => isLowStock(item));
      setLowStockItems(lowStock);
    } catch (err) {
      console.error("Error fetching stock:", err);
      setError("Gagal memuat data stok bahan.");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // Ambil data stok bahan saat komponen dimuat
  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  // Fungsi untuk menambah stok bahan
  const handleAddStock = async () => {
    if (newStock.namaBahan && newStock.jumlah && newStock.satuan) {
      try {
        const payload = {
          namaBahan: newStock.namaBahan,
          jumlah: parseInt(newStock.jumlah, 10),
          satuan: newStock.satuan,
        };

        const response = await axios.post(API_URL, payload);
        setStock([...stock, response.data]);
        setNewStock({ namaBahan: "", jumlah: "", satuan: "" });

        // Perbarui notifikasi stok rendah
        if (isLowStock(response.data)) {
          setLowStockItems([...lowStockItems, response.data]);
        }
        alert("Stok bahan berhasil ditambahkan!");
      } catch (err) {
        console.error("Error adding stock:", err.response?.data || err.message);
        setError("Gagal menambahkan stok bahan.");
      }
    } else {
      alert("Harap isi semua data stok bahan!");
    }
  };

  // Fungsi untuk mengedit stok bahan
  const handleEditStock = (item) => {
    setEditingStock(item);
    setNewStock({ namaBahan: item.namaBahan, jumlah: item.jumlah, satuan: item.satuan });
  };

  // Fungsi untuk memperbarui stok bahan
  const handleUpdateStock = async () => {
    if (newStock.jumlah) {
      try {
        const payload = {
          jumlah: parseInt(newStock.jumlah, 10),
        };

        const response = await axios.patch(`${API_URL}/${editingStock.id}`, payload);
        const updatedStock = response.data;

        setStock(
          stock.map((item) =>
            item.id === editingStock.id ? updatedStock : item
          )
        );

        // Perbarui notifikasi stok rendah
        const updatedLowStock = stock
          .map((item) =>
            item.id === editingStock.id ? updatedStock : item
          )
          .filter((item) => isLowStock(item));
        setLowStockItems(updatedLowStock);

        setEditingStock(null);
        setNewStock({ namaBahan: "", jumlah: "", satuan: "" });
        alert("Stok bahan berhasil diperbarui!");
      } catch (err) {
        console.error("Error updating stock:", err.response?.data || err.message);
        setError("Gagal memperbarui stok bahan.");
      }
    } else {
      alert("Harap isi jumlah stok bahan!");
    }
  };

  // Fungsi untuk menentukan apakah stok rendah
  const isLowStock = (item) => {
    return item.jumlah < 10; // Ambang batas stok rendah
  };

  // Fungsi untuk menentukan kelas warna berdasarkan jumlah stok
  const getStockClass = (item) => {
    if (item.jumlah < 10) return "text-red-500 font-bold"; // Stok rendah (Merah)
    if (item.jumlah >= 10 && item.jumlah <= 15) return "text-orange-500 font-bold"; // Stok sedang (Oranye)
    return "text-green-500 font-bold"; // Stok banyak (Hijau)
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

      {/* Form Tambah / Edit */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingStock ? "Edit Stok Bahan" : "Tambah Stok Bahan"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="namaBahan"
            placeholder="Nama Bahan"
            value={newStock.namaBahan}
            onChange={(e) => setNewStock({ ...newStock, namaBahan: e.target.value })}
            className="p-2 border border-gray-300 rounded"
            disabled={!!editingStock} // Disable saat edit
          />
          <input
            type="number"
            name="jumlah"
            placeholder="Jumlah"
            value={newStock.jumlah}
            onChange={(e) => setNewStock({ ...newStock, jumlah: e.target.value })}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="satuan"
            placeholder="Satuan"
            value={newStock.satuan}
            onChange={(e) => setNewStock({ ...newStock, satuan: e.target.value })}
            className="p-2 border border-gray-300 rounded"
            disabled={!!editingStock} // Disable saat edit
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          {editingStock ? (
            <>
              <button
                onClick={() => {
                  setEditingStock(null);
                  setNewStock({ namaBahan: "", jumlah: "", satuan: "" });
                }}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateStock}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                Update Stok
              </button>
            </>
          ) : (
            <button
              onClick={handleAddStock}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Tambah Stok
            </button>
          )}
        </div>
      </div>

      {/* Daftar Stok */}
      {loading ? (
        <p className="text-center text-gray-500">Memuat data stok bahan...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Daftar Stok Bahan</h2>

          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Nama Bahan</th>
                <th className="py-2 px-4 border">Jumlah</th>
                <th className="py-2 px-4 border">Satuan</th>
                <th className="py-2 px-4 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border text-center">{item.id}</td>
                  <td className="py-2 px-4 border">{item.namaBahan}</td>
                  <td className={`py-2 px-4 border ${getStockClass(item)} text-center`}>
                    {item.jumlah}
                  </td>
                  <td className="py-2 px-4 border text-center">{item.satuan}</td>
                  <td className="py-2 px-4 border text-center">
                    <button
                      onClick={() => handleEditStock(item)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StokBahan;