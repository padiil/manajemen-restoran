  import React, { useEffect, useState, useRef } from "react";
  import SidebarItem from "./SidebarItem";
  import {
    Home,
    List,
    ClipboardList,
    User,
    Utensils,
    DollarSign,
    FileText,
    Boxes,
  } from "lucide-react";
  import { useNavigate } from "react-router-dom";
  
  function Sidebar({ role }) {
    const [currentTime] = useState(new Date());
    const [notificationCount, setNotificationCount] = useState(0); 
    const [previousCount, setPreviousCount] = useState(0); 
    const navigate = useNavigate();
  
    const notificationSoundRef = useRef(null);
  
    useEffect(() => {

      notificationSoundRef.current = new Audio("/notif.mp3");
    }, []);
  
    useEffect(() => {
      // Jalankan notifikasi hanya jika role adalah "waiter"
      if (role === "waiter") {
        const fetchNotifications = async () => {
          try {
            const response = await fetch("http://localhost:3000/pesanan");
            const data = await response.json();
  
            // Hitung jumlah pesanan dengan status "SELESAI"
            const selesaiCount = data.filter((order) => order.status === "SELESAI").length;
  
            // Jika jumlah notifikasi baru lebih besar dari sebelumnya
            if (selesaiCount > previousCount) {
              setNotificationCount(1); // Reset notifikasi ke 1 untuk pesan baru
              if (notificationSoundRef.current) {
                notificationSoundRef.current.play(); // Mainkan suara notifikasi
              }
            }
  
            // Perbarui jumlah notifikasi sebelumnya
            setPreviousCount(selesaiCount);
          } catch (err) {
            console.error("Gagal mengambil notifikasi:", err);
          }
        };
  
        fetchNotifications();
  
        // Refresh notifikasi setiap 10 detik
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
      }
    }, [previousCount, role]);
  
    let navigationItems = [];
  
    switch (role) {
      case "waiter":
        navigationItems = [
          { path: "/waiter/menu", label: "Menu", icon: <List /> },
          { path: "/waiter/order-summary", label: "Pesanan", icon: <ClipboardList /> },
          {
            path: "/waiter/pesan-masuk",
            label: "Pesan Masuk",
            icon: <ClipboardList />,
            notification: notificationCount, // Tambahkan notifikasi di sini
            onClick: () => {
              setNotificationCount(0); // Reset notifikasi saat diklik
              navigate("/waiter/pesan-masuk"); // Navigasi ke halaman "Pesan Masuk"
            },
          },
          { path: "/waiter/profile", label: "Profil", icon: <User /> },
        ];
        break;
      case "koki":
        navigationItems = [
          { path: "/koki/order-detail", label: "Pesanan Masuk", icon: <ClipboardList /> },
          { path: "/koki/resep", label: "Resep", icon: <Utensils /> },
          { path: "/koki/stok-bahan", label: "Stok Bahan", icon: <Boxes /> },
          { path: "/koki/profile", label: "Profil", icon: <User /> },
        ];
        break;
      case "kasir":
        navigationItems = [
          { path: "/kasir/dashboard", label: "Dashboard", icon: <Home /> },
          { path: "/kasir/payments", label: "Pembayaran", icon: <DollarSign /> },
          { path: "/kasir/riwayat-transaksi", label: "Riwayat Transaksi", icon: <FileText /> },
          { path: "/kasir/total-revenue", label: "Pendapatan Hari Ini", icon: <DollarSign /> },
          { path: "/kasir/profile", label: "Profil", icon: <User /> },
        ];
        break;
      case "kepala-toko":
        navigationItems = [
          { path: "/kepala-toko/dashboard", label: "Dashboard", icon: <Home /> },
          { path: "/kepala-toko/karyawan", label: "Karyawan", icon: <User /> },
          { path: "/kepala-toko/menu", label: "Laporan Menu", icon: <Boxes /> },
          { path: "/kepala-toko/laporan-resep", label: "Resep", icon: <Utensils /> },
          { path: "/kepala-toko/stok-bahan", label: "Stok Bahan", icon: <Boxes /> },
          { path: "/kepala-toko/laporan-keuangan", label: "Laporan Keuangan", icon: <FileText /> },
          { path: "/kepala-toko/laporan-transaksi", label: "Laporan Transaksi", icon: <FileText /> },
          { path: "/kepala-toko/profile", label: "Profil", icon: <User /> },
        ];
        break;
      default:
        navigationItems = [{ path: "/", label: "Home", icon: <Home /> }];
    }
  
    // Format waktu dan tanggal
    const formattedTime = currentTime.toLocaleTimeString("id-ID", { hour12: false });
    const formattedDate = currentTime.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 text-white p-4 shadow-lg flex flex-col w-full md:w-64">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center text-blue-300 flex items-center justify-center gap-2">
            <Utensils className="w-6 h-6 animate-bounce text-yellow-400" />
            <span>Manajemen Restoran</span>
          </h2>
        </div>
  
        {/* Tanggal dan Waktu */}
        <div className="text-center mb-6">
          <p className="text-sm font-semibold text-blue-300">{formattedDate}</p>
          <p className="text-lg font-bold text-blue-100">{formattedTime}</p>
        </div>
  
        {/* Navigation */}
        <nav>
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.label} className="relative">
                <button
                  onClick={item.onClick || (() => navigate(item.path))}
                  className="flex items-center gap-4 w-full text-left text-white hover:bg-blue-800 p-2 rounded-lg transition"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
                {item.notification > 0 && (
                  <span className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {item.notification}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
  
        {/* Footer */}
        <div className="mt-auto text-center text-sm text-blue-400">
          <p className="text-xs">&copy; 2025 Manajemen Restoran</p>
        </div>
      </div>
    );
  }
  
  export default Sidebar;