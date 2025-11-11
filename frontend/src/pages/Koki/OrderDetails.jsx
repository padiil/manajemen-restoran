import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const kokiId = 3; // Ganti sesuai ID login user

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/pesanan");
  
        const filteredOrders = response.data.filter((order) => order.status !== "DIBAYAR");
  
        setOrders(filteredOrders);
      } catch (err) {
        console.error("Gagal mengambil daftar pesanan:", err);
        setError("Gagal mengambil daftar pesanan. Pastikan backend berjalan.");
      }
    };
  
    fetchOrders();
  }, []);

  const updateOrderStatus = async (uuid, newStatus) => {
    try {
      await axios.patch(`http://localhost:3000/pesanan/${uuid}`, {
        kokiId: kokiId,
        status: newStatus,
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === uuid ? { ...order, status: newStatus } : order
        )
      );

      console.log(`Status pesanan ${uuid} diperbarui menjadi ${newStatus}`);
    } catch (err) {
      console.error("Gagal memperbarui status pesanan:", err);
      setError("Gagal memperbarui status pesanan.");
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "DIBUAT":
        return "bg-gray-400";
      case "SELESAI":
        return "bg-green-500";
      case "SEDANG_DIMASAK":
        return "bg-yellow-500";
      default:
        return "bg-gray-300";
    }
  };

     return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">📋 Daftar Pesanan</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
  
      {orders.length > 0 ? (
        <div className="grid grid-cols-1 gap-6"> {/* Grid untuk 1 kolom di semua perangkat kecil */}
                      {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col"
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 break-all md:mb-0 w-full md:w-auto">
                          # {order.id}
                        </h2>
                        <span
                          className={`text-xs text-white px-3 py-1 rounded-full mt-2 md:mt-0 ${getStatusBadgeColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                  
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                  
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">🛒 Item:</h3>
                        <ul className="space-y-2">
                          {order.OrderItem && order.OrderItem.length > 0 ? (
                            order.OrderItem.map((item, index) => (
                              <li key={index} className="flex justify-between text-gray-700">
                                <span>{item.product?.nama || `Produk ID: ${item.productId}`}</span>
                                <span className="font-medium">
                                  Rp {(item.hargaSatuan * item.quantity).toLocaleString()}
                                </span>
                              </li>
                            ))
                          ) : (
                            <li className="italic text-gray-400">Tidak ada item.</li>
                          )}
                        </ul>
                      </div>
                  
                      <div className="mt-6">
                        <p className="text-lg font-bold text-gray-800">
                          Total: Rp {order.totalHarga.toLocaleString()}
                        </p>
                      </div>
                  
                      <div className="mt-6 flex flex-col gap-3">
                        {(order.status === "DIBUAT" || order.status === "SEDANG_DIMASAK") && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "SELESAI")}
                            className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition duration-300"
                          >
                            ✅ Tandai Selesai
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 italic">Belum ada pesanan yang masuk.</p>
      )}
    </div>
  );
};

export default OrderDetails;
