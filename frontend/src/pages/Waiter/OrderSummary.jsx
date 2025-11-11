import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialOrderDetails = location.state?.orderDetails || {
    waiterId: "",
    kokiId: "",
    OrderItem: [],
    totalHarga: 0,
    status: "DIBUAT",
  };

  const [orderDetails] = useState(initialOrderDetails);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/pesanan");
        const filteredOrders = response.data.filter(
          (order) => order.status === "DIBUAT"
        );
        const sortedOrders = filteredOrders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
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
        🍽️ Ringkasan Pesanan
      </h1>

      {/* Ringkasan Pesanan Terbaru */}
      {orderDetails.OrderItem.length > 0 && (
        <div className="mb-12 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Pesanan Terbaru</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {orderDetails.OrderItem.map((item, index) => (
              <li key={index}>
                {item.product?.nama || `Produk ID: ${item.productId}`} - 
                Rp {item.hargaSatuan?.toLocaleString()} x {item.quantity} = 
                <span className="font-semibold"> Rp {(item.hargaSatuan * item.quantity).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-lg font-bold text-gray-800">
            Total: Rp {orderDetails.totalHarga.toLocaleString()}
          </p>
        </div>
      )}

      {/* Daftar Semua Pesanan */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-700">📋 Daftar Semua Pesanan</h2>
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
                    <span className="ml-2 font-bold text-orange-500">
                      {order.status}
                    </span>
                  </p>
                  <p><span className="font-semibold">Tanggal:</span> {new Date(order.createdAt).toLocaleString()}</p>
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
          <p className="italic text-gray-400 text-center">Belum ada pesanan tersedia.</p>
        )}
      </div>

      {/* Button untuk kembali ke menu */}
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={() => navigate("/waiter/menu")}
          className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Kembali ke Menu
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
