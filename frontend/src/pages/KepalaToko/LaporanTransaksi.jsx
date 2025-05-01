import React, { useState, useEffect } from "react";
import axios from "axios";

const LaporanTransaksi = () => {
  const [transaksi, setTransaksi] = useState([]);
  const [bulanDipilih, setBulanDipilih] = useState(new Date().getMonth());
  const [tahunDipilih, setTahunDipilih] = useState(new Date().getFullYear());

  const bulanOptions = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/pembayaran");
        setTransaksi(response.data);
      } catch (err) {
        console.error("Gagal mengambil data transaksi:", err);
      }
    };

    fetchData();
  }, []);

  const filterByBulanTahun = (data) => {
    return data.filter((item) => {
      const tanggal = new Date(item.createdAt);
      return (
        tanggal.getMonth() === bulanDipilih &&
        tanggal.getFullYear() === parseInt(tahunDipilih)
      );
    });
  };

  const transaksiTersaring = filterByBulanTahun(transaksi);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Laporan Transaksi
      </h1>

      {/* Filter Bulan dan Tahun */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <select
          value={bulanDipilih}
          onChange={(e) => setBulanDipilih(parseInt(e.target.value))}
          className="border border-gray-300 p-2 rounded-md"
        >
          {bulanOptions.map((bulan, index) => (
            <option key={index} value={index}>
              {bulan}
            </option>
          ))}
        </select>

        <select
          value={tahunDipilih}
          onChange={(e) => setTahunDipilih(e.target.value)}
          className="border border-gray-300 p-2 rounded-md"
        >
          {Array.from({ length: 5 }, (_, i) => {
            const tahun = new Date().getFullYear() - i;
            return (
              <option key={tahun} value={tahun}>
                {tahun}
              </option>
            );
          })}
        </select>
      </div>

      {/* Daftar Transaksi */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Transaksi Bulan {bulanOptions[bulanDipilih]} {tahunDipilih}
        </h2>
        {transaksiTersaring.length === 0 ? (
          <p className="text-center text-gray-500 italic">Tidak ada transaksi.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {transaksiTersaring.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  ID Pesanan: {item.orderId}
                </h3>
                <p className="text-gray-700">
                  <span className="font-medium">Metode:</span> {item.metode}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Jumlah:</span> Rp{" "}
                  {item.jumlah.toLocaleString("id-ID")}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Tanggal:</span>{" "}
                  {new Date(item.createdAt).toLocaleDateString("id-ID")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LaporanTransaksi;