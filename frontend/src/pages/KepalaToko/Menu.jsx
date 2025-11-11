import React, { useState, useEffect } from "react";
import axios from "axios";

const LaporanMenu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editProduct, setEditProduct] = useState(null); // Untuk menyimpan produk yang sedang diedit
  const [newProduct, setNewProduct] = useState({
    nama: "",
    deskripsi: "",
    harga: ""
  });

  const API_URL = "http://localhost:3000/menu";

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch data produk
  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Gagal memuat data produk.");
      setLoading(false);
    }
  };

  // Tambah produk baru
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL, {
        nama: newProduct.nama,
        deskripsi: newProduct.deskripsi,
        harga: parseInt(newProduct.harga, 10)
      });
      setProducts([...products, response.data]);
      setNewProduct({ nama: "", deskripsi: "", harga: "" });
      alert("Produk berhasil ditambahkan!");
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Gagal menambahkan produk.");
    }
  };

  // Hapus produk
  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus produk ini?");
    if (confirmDelete) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setProducts(products.filter((product) => product.id !== id));
        alert("Produk berhasil dihapus!");
      } catch (err) {
        console.error("Error deleting product:", err);
        setError("Gagal menghapus produk.");
      }
    }
  };

  // Edit produk
  const handleEditProduct = (product) => {
    setEditProduct(product); // Set produk yang akan diedit
  };

  // Simpan perubahan produk
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = { harga: parseInt(editProduct.harga, 10) }; // Payload hanya mengirim harga
      await axios.patch(`${API_URL}/${editProduct.id}`, updatedProduct);

      // Perbarui produk di state
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === editProduct.id ? { ...product, ...updatedProduct } : product
        )
      );

      setEditProduct(null); // Reset form edit
      alert("Produk berhasil diperbarui!");
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Gagal memperbarui produk.");
    }
  };

  // Handle perubahan input untuk tambah/edit produk
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editProduct) {
      setEditProduct((prev) => ({
        ...prev,
        [name]: value
      }));
    } else {
      setNewProduct((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Laporan Produk</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Form Tambah Produk */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Tambah Produk Baru</h2>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Nama Produk</label>
            <input
              type="text"
              name="nama"
              value={newProduct.nama}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Deskripsi</label>
            <input
              type="text"
              name="deskripsi"
              value={newProduct.deskripsi}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Harga</label>
            <input
              type="number"
              name="harga"
              value={newProduct.harga}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Tambah Produk
          </button>
        </form>
      </div>

      {/* Loader atau Daftar Produk */}
      {loading ? (
        <p className="text-center text-gray-500">Memuat data produk...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item) => (
            <div key={item.id} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800">{item.nama}</h3>
              <p className="text-gray-600 text-sm mt-1">{item.deskripsi}</p>
              <p className="text-gray-800 font-bold mt-2">
                Rp {item.harga.toLocaleString()}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEditProduct(item)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Edit Produk */}
      {editProduct && (
        <div className="bg-white shadow-md rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Edit Produk</h2>
          <form onSubmit={handleUpdateProduct} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Harga</label>
              <input
                type="number"
                name="harga"
                value={editProduct.harga}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Simpan Perubahan
            </button>
            <button
              type="button"
              onClick={() => setEditProduct(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded ml-2"
            >
              Batal
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LaporanMenu;