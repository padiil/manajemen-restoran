import React, { useState, useEffect } from "react";
import axios from "axios";

const RiwayatTransaksi = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/pembayaran");
        setTransactions(response.data);
      } catch (err) {
        console.error("Gagal mengambil data pembayaran:", err);
        setError("Gagal mengambil data pembayaran. Pastikan backend berjalan.");
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">Riwayat Transaksi</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {transactions.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-sm sm:text-base">
                <th className="p-3 text-left text-gray-700 font-semibold whitespace-nowrap">ID Pembayaran</th>
                <th className="p-3 text-left text-gray-700 font-semibold whitespace-nowrap">ID Pesanan</th>
                <th className="p-3 text-left text-gray-700 font-semibold whitespace-nowrap">Metode</th>
                <th className="p-3 text-left text-gray-700 font-semibold whitespace-nowrap">Jumlah</th>
                <th className="p-3 text-left text-gray-700 font-semibold whitespace-nowrap">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-t text-sm sm:text-base">
                  <td className="p-3 text-gray-800 whitespace-nowrap">{transaction.id}</td>
                  <td className="p-3 text-gray-800 whitespace-nowrap">{transaction.orderId}</td>
                  <td className="p-3 text-gray-800 whitespace-nowrap">{transaction.metode}</td>
                  <td className="p-3 text-gray-800 whitespace-nowrap">
                    Rp {transaction.jumlah.toLocaleString()}
                  </td>
                  <td className="p-3 text-gray-800 whitespace-nowrap">
                    {new Date(transaction.createdAt).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="italic text-gray-400 text-center mt-6">
          Tidak ada transaksi yang tersedia.
        </p>
      )}
    </div>
  );
};

export default RiwayatTransaksi;
