import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LaporanKeuangan = () => {
  const [dataPerBulan, setDataPerBulan] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState(null);
  const [isYearly, setIsYearly] = useState(false); // State untuk menentukan apakah grafik tahunan

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/pembayaran");
        const pembayaran = response.data;

        if (isYearly) {
          // Data untuk grafik tahunan
          const monthlyData = Array.from({ length: 12 }, () => ({
            totalPendapatan: 0,
          }));

          pembayaran.forEach((item) => {
            const date = new Date(item.createdAt);
            if (date.getFullYear() === selectedYear) {
              const month = date.getMonth();
              monthlyData[month].totalPendapatan += item.jumlah;
            }
          });

          setChartData({
            labels: Array.from({ length: 12 }, (_, i) =>
              new Date(0, i).toLocaleString("id-ID", { month: "long" })
            ),
            datasets: [
              {
                label: "Pendapatan Bulanan",
                data: monthlyData.map((data) => data.totalPendapatan),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          });
        } else {
          // Data untuk grafik bulanan
          const filteredData = pembayaran.filter((item) => {
            const date = new Date(item.createdAt);
            return (
              date.getMonth() + 1 === selectedMonth &&
              date.getFullYear() === selectedYear
            );
          });

          const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
          const dailyData = Array.from({ length: daysInMonth }, () => ({
            totalPendapatan: 0,
            totalItemTerjual: 0,
          }));

          filteredData.forEach((item) => {
            const date = new Date(item.createdAt);
            const day = date.getDate();
            dailyData[day - 1].totalPendapatan += item.jumlah;
            dailyData[day - 1].totalItemTerjual += 1;
          });

          setDataPerBulan(dailyData);
          setChartData({
            labels: Array.from({ length: daysInMonth }, (_, i) => `Hari ${i + 1}`),
            datasets: [
              {
                label: "Pendapatan Harian",
                data: dailyData.map((data) => data.totalPendapatan),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
            ],
          });
        }
      } catch (err) {
        console.error("Gagal mengambil data pembayaran:", err);
      }
    };

    fetchData();
  }, [selectedMonth, selectedYear, isYearly]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Laporan Keuangan
      </h1>

      {/* Filter Bulan dan Tahun */}
      <div className="flex justify-center gap-4 mb-6">
        <select
          value={isYearly ? "yearly" : selectedMonth}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "yearly") {
              setIsYearly(true);
            } else {
              setIsYearly(false);
              setSelectedMonth(Number(value));
            }
          }}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="yearly">Penghasilan Per Tahun</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="p-2 border border-gray-300 rounded"
        >
          {Array.from({ length: 5 }, (_, i) => (
            <option key={i} value={new Date().getFullYear() - i}>
              {new Date().getFullYear() - i}
            </option>
          ))}
        </select>
      </div>

      {/* Tabel Laporan */}
      {!isYearly && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Tabel Pendapatan</h2>
          {dataPerBulan.every((data) => data.totalPendapatan === 0) ? (
            <p className="text-center text-gray-500 italic">Tidak ada laporan untuk bulan ini.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Hari</th>
                  <th className="border border-gray-300 p-2">Pendapatan (Rp)</th>
                  <th className="border border-gray-300 p-2">Item Terjual</th>
                </tr>
              </thead>
              <tbody>
                {dataPerBulan.map((data, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-300 p-2">Hari {index + 1}</td>
                    <td className="border border-gray-300 p-2">
                      {data.totalPendapatan.toLocaleString("id-ID")}
                    </td>
                    <td className="border border-gray-300 p-2">{data.totalItemTerjual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Grafik Laporan */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Grafik {isYearly ? "Pendapatan Tahunan" : "Pendapatan Bulanan"}
        </h2>
        {chartData ? (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: isYearly
                    ? `Pendapatan Tahun ${selectedYear}`
                    : `Pendapatan Bulan ${new Date(
                        0,
                        selectedMonth - 1
                      ).toLocaleString("id-ID", { month: "long" })} ${selectedYear}`,
                },
              },
            }}
          />
        ) : (
          <p className="text-center text-gray-500 italic">Tidak ada data untuk ditampilkan.</p>
        )}
      </div>
    </div>
  );
};

export default LaporanKeuangan;