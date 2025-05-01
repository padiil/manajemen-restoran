import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [order, setOrder] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // State untuk animasi

  const API_MENU_URL = "http://localhost:3000/menu";
  const API_ORDER_URL = "http://localhost:3000/pesanan";
  const navigate = useNavigate();

  // Fetch menu items from API
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(API_MENU_URL);
        setMenuItems(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const addToOrder = (item) => {
    setOrder((prev) => {
      const existingItem = prev.find((orderItem) => orderItem.id === item.id);
      if (existingItem) {
        return prev.map((orderItem) =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });

    // Trigger animasi
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000); // Reset animasi setelah 1 detik
  };

  const removeFromOrder = (itemId) => {
    setOrder((prev) => {
      const existingItem = prev.find((orderItem) => orderItem.id === itemId);
      if (existingItem.quantity > 1) {
        return prev.map((orderItem) =>
          orderItem.id === itemId
            ? { ...orderItem, quantity: orderItem.quantity - 1 }
            : orderItem
        );
      } else {
        return prev.filter((orderItem) => orderItem.id !== itemId);
      }
    });
  };

  const deleteFromOrder = (itemId) => {
    setOrder((prev) => prev.filter((orderItem) => orderItem.id !== itemId));
  };

  const handleSubmitOrder = async () => {
    if (order.length === 0) {
      setErrors({ order: "Pesanan kosong. Silakan tambahkan menu terlebih dahulu." });
      return;
    }

    const orderDetails = {
      waiterId: 4,
      kokiId: 3,
      items: order.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    console.log("Data yang dikirim ke API:", orderDetails);

    try {
      setSubmitting(true); // Mulai loading submit
      const response = await axios.post(API_ORDER_URL, orderDetails, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Pesanan berhasil disimpan:", response.data);
      navigate("/waiter/order-summary", { state: { orderDetails: response.data } });
    } catch (err) {
      console.error("Error submitting order:", err.response?.data || err.message);
      alert("Gagal menyimpan pesanan. Silakan coba lagi.");
    } finally {
      setSubmitting(false); // Selesai loading submit
    }
  };

  const total = order.reduce((acc, item) => acc + item.harga * (item.quantity || 1), 0);

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 relative">
      <h1 className="text-2xl font-semibold mb-4 text-center-mobile">Daftar Menu</h1>

      {/* Animasi Tambah */}
      {isAnimating && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="animate-fall bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg">
            🍔 Ditambahkan!
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Memuat data menu...</p>
      ) : (
        <>
          {/* Tabel Menu */}
          <table className="w-full mb-6 border border-gray-300 table-menu">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="py-2 px-4 border">Nama Menu</th>
                <th className="py-2 px-4 border">Deskripsi</th>
                <th className="py-2 px-4 border">Harga</th>
                <th className="py-2 px-4 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{item.nama}</td>
                  <td className="py-2 px-4 border">{item.deskripsi}</td>
                  <td className="py-2 px-4 border">Rp {item.harga.toLocaleString()}</td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => addToOrder(item)}
                      className="button bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                    >
                      Tambah
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Rincian Pesanan */}
          <h2 className="text-xl font-semibold mb-2 text-center-mobile">Rincian Pesanan</h2>
          {order.length > 0 ? (
            <div className="space-y-4 mb-4">
              {order.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h3 className="font-semibold">{item.nama}</h3>
                    <p className="text-gray-500">Harga: Rp {item.harga.toLocaleString()}</p>
                    <p className="text-gray-500">Jumlah: {item.quantity}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => removeFromOrder(item.id)}
                      className="button bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
                    >
                      Kurangi
                    </button>
                    <button
                      onClick={() => deleteFromOrder(item.id)}
                      className="button bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="italic text-gray-400">Belum ada item dalam pesanan.</p>
          )}

          {/* Total dan Submit */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-4">
            <p className="font-semibold text-lg">Total: Rp {total.toLocaleString()}</p>
            <button
              onClick={handleSubmitOrder}
              className="button bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded disabled:opacity-50 mt-4 md:mt-0"
              disabled={submitting}
            >
              {submitting ? "Mengirim..." : "Submit Pesanan"}
            </button>
          </div>

          {errors.order && <p className="text-red-500 mt-4 text-center">{errors.order}</p>}
        </>
      )}
    </div>
  );
};

export default Menu;
