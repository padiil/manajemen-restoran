import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaMoneyBillWave } from "react-icons/fa"; // Pakai react-icons untuk ikon uang

const TodayRevenue = () => {
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [paymentCount, setPaymentCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTodayPayments = async () => {
      try {
        const response = await axios.get("http://localhost:3000/pembayaran");
        const allPayments = response.data;

        const today = new Date();
        const todayDateString = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD

        // Filter hanya pembayaran yang dilakukan hari ini
        const todayPayments = allPayments.filter((payment) => {
          if (!payment.createdAt) return false;
          const paymentDate = new Date(payment.createdAt).toISOString().split("T")[0];
          return paymentDate === todayDateString;
        });

        // Hitung total penghasilan dari pembayaran hari ini
        const totalRevenue = todayPayments.reduce(
          (sum, payment) => sum + payment.jumlah,
          0
        );

        setTodayRevenue(totalRevenue);
        setPaymentCount(todayPayments.length);
      } catch (err) {
        console.error("Gagal mengambil daftar pembayaran:", err);
        setError("Gagal menghitung penghasilan hari ini.");
      }
    };

    fetchTodayPayments();
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-6 rounded-2xl shadow-lg text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-1">Penghasilan Hari Ini</h2>
          {error ? (
            <p className="text-red-300">{error}</p>
          ) : (
            <>
              <p className="text-3xl font-bold">
                Rp {todayRevenue.toLocaleString()}
              </p>
              <p className="text-sm mt-2 text-blue-100">{paymentCount} pembayaran hari ini</p>
            </>
          )}
        </div>
        <FaMoneyBillWave className="text-5xl opacity-70" />
      </div>
    </div>
  );
};

export default TodayRevenue;