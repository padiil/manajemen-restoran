import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaMoneyBillWave, FaClipboardList, FaBox } from "react-icons/fa";

const KepalaTokoDashboard = () => {
  const [ordersToday, setOrdersToday] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState("");

  const bulanIndo = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const hariIndo = [
    "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
  ];

  const today = new Date();
  const todayKey = today.toISOString().split("T")[0];
  const namaBulan = bulanIndo[today.getMonth()];
  const namaHari = hariIndo[today.getDay()];
  const tanggalSekarang = today.getDate();
  const tahunSekarang = today.getFullYear();

  useEffect(() => {
    const fetchTodayOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/pesanan");
        const allOrders = response.data;

        // Filter pesanan hari ini
        const todayOrders = allOrders.filter((order) => {
          if (!order.createdAt) return false;
          const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
          return orderDate === todayKey;
        });
        setOrdersToday(todayOrders);

        // Total revenue dan item hari ini
        const totalRevenueCalc = todayOrders.reduce(
          (sum, order) => sum + (order.totalHarga || 0), // Pastikan totalHarga ada
          0
        );
        const totalItemsCalc = todayOrders.reduce((sum, order) => {
          return (
            sum +
            (order.OrderItem || []).reduce((itemSum, item) => itemSum + (item.quantity || 0), 0)
          );
        }, 0);

        setTotalRevenue(totalRevenueCalc);
        setTotalItems(totalItemsCalc);
      } catch (err) {
        console.error("Gagal mengambil daftar pesanan:", err);
        setError("Gagal mengambil data pesanan.");
      }
    };

    fetchTodayOrders();
  }, [todayKey]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">Dashboard Kepala Toko</h1>
        <p className="text-gray-600 mt-2">
          {namaHari}, {tanggalSekarang} {namaBulan} {tahunSekarang}
        </p>
      </header>

      {error && <p className="text-red-500">{error}</p>}

      <section className="space-y-6 mb-10">
        {/* Baris pertama: 2 card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
            <FaMoneyBillWave className="text-green-500 text-4xl mr-4" />
            <div>
              <p className="text-gray-500">Penghasilan Hari Ini</p>
              <h2 className="text-2xl font-bold text-gray-800">
                Rp {totalRevenue.toLocaleString()}
              </h2>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
            <FaClipboardList className="text-blue-500 text-4xl mr-4" />
            <div>
              <p className="text-gray-500">Jumlah Pesanan</p>
              <h2 className="text-2xl font-bold text-gray-800">{ordersToday.length}</h2>
            </div>
          </div>
        </div>

        {/* Baris kedua: card di tengah */}
        <div className="flex justify-center">
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center w-full sm:w-2/3 md:w-1/3">
            <FaBox className="text-yellow-500 text-4xl mr-4" />
            <div>
              <p className="text-gray-500">Total Item Terjual</p>
              <h2 className="text-2xl font-bold text-gray-800">{totalItems}</h2>
            </div>
          </div>
        </div>
      </section>

      {/* Daftar Pesanan Hari Ini */}
      <section>
        <h2 className="text-xl font-bold text-gray-700 mb-4">Daftar Pesanan Hari Ini</h2>
        {ordersToday.length > 0 ? (
          <div className="space-y-4">
            {ordersToday.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    ID: {order.id.slice(0, 8)}...
                  </p>
                  <p className="text-gray-500 text-sm">
                    {new Date(order.createdAt).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} WIB
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-700">
                    Rp {order.totalHarga.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic text-center mt-10">
            Belum ada pesanan hari ini.
          </p>
        )}
      </section>
    </div>
  );
};

export default KepalaTokoDashboard;