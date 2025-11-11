import React, { useState, useEffect } from "react";
import axios from "axios";

const PaymentDetails = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH"); // Default metode pembayaran

  // Ambil daftar pesanan dari API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/pesanan");

        // Filter hanya pesanan dengan status "SELESAI"
        const filteredOrders = response.data.filter((order) => order.status === "SELESAI");
        setOrders(filteredOrders);
      } catch (err) {
        console.error("Gagal mengambil daftar pesanan:", err);
        setError("Gagal mengambil daftar pesanan. Pastikan backend berjalan.");
      }
    };

    fetchOrders();
  }, []);

  // Fungsi untuk menyelesaikan pembayaran
  const handleCompletePayment = async (order) => {
    try {
      const paymentData = {
        idPesanan: order.id,
        metode: paymentMethod,
        jumlah: order.totalHarga, // Gunakan total harga pesanan langsung
      };

      console.log("Payload yang dikirim:", paymentData);

      // Kirim data pembayaran ke backend
      await axios.post("http://localhost:3000/pembayaran", paymentData);

      // Perbarui status pesanan di backend menjadi "DIBAYAR"
      await axios.patch(`http://localhost:3000/pesanan/${order.id}`, { status: "DIBAYAR" });

      // Hapus pesanan dari daftar setelah pembayaran selesai
      setOrders((prevOrders) => prevOrders.filter((o) => o.id !== order.id));

      alert("Pembayaran berhasil diselesaikan!");
    } catch (err) {
      console.error("Gagal menyelesaikan pembayaran:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Gagal menyelesaikan pembayaran. Pastikan backend berjalan."
      );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Pesanan Selesai</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white shadow-md rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">ID Pesanan: {order.id}</h2>
                <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
                  Selesai
                </span>
              </div>

              <div className="space-y-4">
                {order.OrderItem.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-700">{item.product.nama}</h3>
                      <p className="text-gray-500 text-sm mt-1">{item.product.deskripsi}</p>
                      <p className="text-gray-600 text-sm mt-1">
                        {item.quantity}x Rp {item.hargaSatuan.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-700">
                        Rp {(item.quantity * item.hargaSatuan).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Subtotal</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t mt-4">
                <p className="text-lg font-semibold text-gray-800">Total Harga:</p>
                <p className="text-xl font-bold text-gray-900">
                  Rp {order.totalHarga.toLocaleString()}
                </p>
              </div>

              <div className="mt-6 flex gap-4 justify-end">
                <div className="flex flex-col gap-2">
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                  >
                    <option value="CASH">CASH</option>
                    <option value="CARD">CARD</option>
                  </select>
                  <button
                    onClick={() => handleCompletePayment(order)}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg"
                  >
                    Bayar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="italic text-gray-400 text-center">Tidak ada pesanan yang selesai.</p>
      )}
    </div>
  );
};

export default PaymentDetails;