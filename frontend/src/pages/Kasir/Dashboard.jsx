import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaMoneyBillWave, FaClipboardList, FaBoxOpen } from "react-icons/fa";

const KasirDashboard = () => {
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

        const todayOrders = allOrders.filter((order) => {
          if (!order.createdAt) return false;
          const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
          return orderDate === todayKey;
        });

        setOrdersToday(todayOrders);

        const savedRevenue = localStorage.getItem(`revenue_${todayKey}`);
        const savedItems = localStorage.getItem(`items_${todayKey}`);

        if (savedRevenue && savedItems) {
          setTotalRevenue(parseInt(savedRevenue));
          setTotalItems(parseInt(savedItems));
        } else {
          const totalRevenueCalc = todayOrders.reduce(
            (sum, order) => sum + order.totalHarga,
            0
          );
          const totalItemsCalc = todayOrders.reduce((sum, order) => {
            return (
              sum +
              order.OrderItem.reduce((itemSum, item) => itemSum + item.quantity, 0)
            );
          }, 0);

          setTotalRevenue(totalRevenueCalc);
          setTotalItems(totalItemsCalc);

          localStorage.setItem(`revenue_${todayKey}`, totalRevenueCalc);
          localStorage.setItem(`items_${todayKey}`, totalItemsCalc);
        }
      } catch (err) {
        console.error("Gagal mengambil daftar pesanan:", err);
        setError("Gagal mengambil data pesanan.");
      }
    };

    fetchTodayOrders();
  }, [todayKey]);

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 tracking-wide">Dashboard Kasir</h1>
        <p className="text-sm text-gray-600 mt-1">
          {namaHari}, {tanggalSekarang} {namaBulan} {tahunSekarang}
        </p>
      </header>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <section className="space-y-4 mb-10">
  {/* Baris pertama: dua card berdampingan */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div className="bg-white p-5 rounded-xl shadow-md flex items-center">
      <FaMoneyBillWave className="text-green-500 text-3xl sm:text-4xl mr-4" />
      <div>
        <p className="text-gray-500 text-sm">Penghasilan Hari Ini</p>
        <h2 className="text-xl font-bold text-gray-800">
          Rp {totalRevenue.toLocaleString()}
        </h2>
      </div>
    </div>

    <div className="bg-white p-5 rounded-xl shadow-md flex items-center">
      <FaClipboardList className="text-blue-500 text-3xl sm:text-4xl mr-4" />
      <div>
        <p className="text-gray-500 text-sm">Jumlah Pesanan</p>
        <h2 className="text-xl font-bold text-gray-800">{ordersToday.length}</h2>
      </div>
    </div>
  </div>

  {/* Baris kedua: card di tengah */}
  <div className="flex justify-center">
    <div className="bg-white p-5 rounded-xl shadow-md flex items-center w-full sm:w-1/2 md:w-1/3">
      <FaBoxOpen className="text-yellow-500 text-3xl sm:text-4xl mr-4" />
      <div>
        <p className="text-gray-500 text-sm">Total Item Terjual</p>
        <h2 className="text-xl font-bold text-gray-800">{totalItems}</h2>
      </div>
    </div>
  </div>
</section>



      <section>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">Daftar Pesanan Hari Ini</h2>
        {ordersToday.length > 0 ? (
          <div className="space-y-3">
            {ordersToday.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    ID: {order.id.slice(0, 8)}...
                  </p>
                  <p className="text-gray-500 text-sm">
                    {new Date(order.createdAt).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })} WIB
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base sm:text-lg font-bold text-gray-700">
                    Rp {order.totalHarga.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic text-center mt-6">Belum ada pesanan hari ini.</p>
        )}
      </section>
    </div>
  );
};

export default KasirDashboard;
