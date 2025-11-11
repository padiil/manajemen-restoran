import React, { useState, useEffect } from "react";
import axios from "axios";

const LaporanResep = () => {
  const [resep, setResep] = useState([]);
  const [bahan, setBahan] = useState([]);
  const [menu, setMenu] = useState([]);
  const [selectedBahan, setSelectedBahan] = useState([]);
  const [formData, setFormData] = useState({
    idProduk: "",
    idBahan: "",
    kuantitas: "",
    satuanPakai: "",
  });
  const [editData, setEditData] = useState(null); // Untuk data yang sedang diedit

  // Fetch data resep, bahan, dan menu
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resepResponse = await axios.get("http://localhost:3000/resep");
      const bahanResponse = await axios.get("http://localhost:3000/stok-bahan");
      const menuResponse = await axios.get("http://localhost:3000/menu");

      const groupedResep = resepResponse.data.reduce((acc, item) => {
        const produkId = item.idProduk;
        if (!acc[produkId]) {
          acc[produkId] = {
            produk: item.produk?.nama || "Produk Tidak Ditemukan",
            bahan: [],
          };
        }
        acc[produkId].bahan.push({
          idResep: item.id, // simpan id untuk edit
          namaBahan: item.bahan?.namaBahan || "Bahan Tidak Ditemukan",
          kuantitas: item.kuantitas || 0,
          satuanPakai: item.satuanPakai || "-",
        });
        return acc;
      }, {});

      setResep(Object.values(groupedResep));
      setBahan(bahanResponse.data || []);
      setMenu(menuResponse.data || []);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      alert("Terjadi kesalahan saat mengambil data.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBahan = () => {
    if (formData.idBahan && formData.kuantitas && formData.satuanPakai && formData.idProduk) {
      const bahanDetail = bahan.find((b) => b.id === parseInt(formData.idBahan));
      const produkDetail = menu.find((m) => m.id === formData.idProduk);

      setSelectedBahan((prev) => [
        ...prev,
        {
          idBahan: formData.idBahan,
          namaBahan: bahanDetail?.namaBahan || "Bahan Tidak Ditemukan",
          kuantitas: formData.kuantitas,
          satuanPakai: formData.satuanPakai,
          namaProduk: produkDetail?.nama || "Produk Tidak Ditemukan",
        },
      ]);

      setFormData((prev) => ({ ...prev, idBahan: "", kuantitas: "", satuanPakai: "" }));
    } else {
      alert("Lengkapi data bahan dan pilih menu sebelum menambahkannya.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedBahan.length === 0) {
        alert("Tambahkan minimal satu bahan sebelum menyimpan resep.");
        return;
      }

      const payload = {
        resep: selectedBahan.map((bahan) => ({
          idProduk: formData.idProduk,
          idBahan: parseInt(bahan.idBahan, 10),
          kuantitas: parseFloat(bahan.kuantitas),
          satuanPakai: bahan.satuanPakai,
        })),
      };

      await axios.post("http://localhost:3000/resep/bulk", payload);
      alert("Resep berhasil ditambahkan!");
      fetchData();
      setFormData({ idProduk: "", idBahan: "", kuantitas: "", satuanPakai: "" });
      setSelectedBahan([]);
    } catch (err) {
      console.error("Gagal menyimpan data:", err);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  const handleEditClick = (idResep, kuantitas, satuanPakai) => {
    setEditData({ idResep, kuantitas, satuanPakai });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        kuantitas: parseFloat(editData.kuantitas),
        satuanPakai: editData.satuanPakai,
      };
      await axios.patch(`http://localhost:3000/resep/${editData.idResep}`, payload);
      alert("Resep berhasil diperbarui.");
      setEditData(null);
      fetchData();
    } catch (err) {
      console.error("Gagal update data:", err);
      alert("Terjadi kesalahan saat mengupdate data.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Manajemen Resep</h1>

      {/* Form Tambah Resep */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tambah Resep</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Produk</label>
            <select
              name="idProduk"
              value={formData.idProduk}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Pilih Produk</option>
              {menu.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-medium">Bahan</label>
              <select
                name="idBahan"
                value={formData.idBahan}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Pilih Bahan</option>
                {bahan.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.namaBahan}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Kuantitas</label>
              <input
                type="number"
                name="kuantitas"
                value={formData.kuantitas}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Satuan Pakai</label>
              <input
                type="text"
                name="satuanPakai"
                value={formData.satuanPakai}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddBahan}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Tambah Bahan
          </button>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Bahan yang Dipilih:</h3>
            {selectedBahan.length === 0 ? (
              <p className="text-gray-500 italic">Belum ada bahan yang ditambahkan.</p>
            ) : (
              <ul className="list-disc pl-5">
                {selectedBahan.map((bahan, index) => (
                  <li key={index}>
                    <strong>{bahan.namaProduk}</strong>: {bahan.namaBahan} - {bahan.kuantitas} {bahan.satuanPakai}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Simpan Resep
          </button>
        </form>
      </div>

      {/* Daftar Resep */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Daftar Resep</h2>
        {resep.length === 0 ? (
          <p className="text-center text-gray-500 italic">Tidak ada resep.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resep.map((item, index) => (
              <div key={index} className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.produk}</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {item.bahan.map((bahan, i) => (
                    <li key={i}>
                      {editData?.idResep === bahan.idResep ? (
                        <form onSubmit={handleEditSubmit} className="space-y-2">
                          <input
                            type="number"
                            name="kuantitas"
                            value={editData.kuantitas}
                            onChange={handleEditChange}
                            className="w-full border px-2 py-1"
                          />
                          <input
                            type="text"
                            name="satuanPakai"
                            value={editData.satuanPakai}
                            onChange={handleEditChange}
                            className="w-full border px-2 py-1"
                          />
                          <div className="flex gap-2 mt-1">
                            <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded">
                              Simpan
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditData(null)}
                              className="bg-gray-400 text-white px-2 py-1 rounded"
                            >
                              Batal
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          {bahan.namaBahan} - {bahan.kuantitas} {bahan.satuanPakai}
                          <button
                            onClick={() =>
                              handleEditClick(bahan.idResep, bahan.kuantitas, bahan.satuanPakai)
                            }
                            className="ml-2 text-sm text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LaporanResep;
