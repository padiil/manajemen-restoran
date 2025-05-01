import React, { useState, useEffect } from "react";
import axios from "axios";

const PesanMasuk = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/pesanan");

        // Filter hanya status "SELESAI"
        const filteredOrders = response.data.filter(
          (order) => order.status === "SELESAI"
        );

        // Urutkan berdasarkan waktu selesai terbaru
        const sortedOrders = filteredOrders.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        setOrders(sortedOrders);
      } catch (err) {
        console.error("Gagal mengambil daftar pesanan:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
        ✅ Pesanan Selesai
      </h1>

      {orders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
            >
              <div className="space-y-2 text-gray-600">
                <p><span className="font-semibold">ID:</span> {order.id}</p>
                <p><span className="font-semibold">Waiter:</span> {order.waiterId}</p>
                <p>
                  <span className="font-semibold">Status:</span> 
                  <span className="ml-2 font-bold text-green-600">
                    {order.status}
                  </span>
                </p>
                <p><span className="font-semibold">Tanggal:</span> {new Date(order.updatedAt).toLocaleString()}</p>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-bold text-gray-700 mb-2">🛍️ Detail:</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {order.OrderItem.map((item, index) => (
                    <li key={index}>
                      {item.product?.nama || `Produk ID: ${item.productId}`} - 
                      Rp {item.hargaSatuan?.toLocaleString()} x {item.quantity} = 
                      <span className="font-semibold"> Rp {(item.hargaSatuan * item.quantity).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-lg font-bold text-gray-800 mt-6">
                💰 Rp {order.totalHarga.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="italic text-gray-400 text-center">Belum ada pesanan selesai.</p>
      )}
    </div>
  );
};

export default PesanMasuk;