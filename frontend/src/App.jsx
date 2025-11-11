import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Menu from "./pages/Waiter/Menu";
import OrderSummary from "./pages/Waiter/OrderSummary";
import WaiterProfile from "./pages/Waiter/Profile";
import OrderDetails from "./pages/Koki/OrderDetails";
import Resep from "./pages/Koki/Resep";
import KokiStokBahan from "./pages/Koki/StokBahan";
import KokiProfile from "./pages/Koki/Profile";
import KasirDashboard from "./pages/Kasir/Dashboard";
import PaymentDetails from "./pages/Kasir/PaymentDetails";
import TodayRevenue from "./pages/Kasir/TotalRevenue";
import KasirProfile from "./pages/Kasir/Profile";
import KepalaTokoDashboard from "./pages/KepalaToko/Dashboard";
import Karyawan from "./pages/KepalaToko/Karyawan";
import LaporanMenu from "./pages/KepalaToko/Menu";
import LaporanKeuangan from "./pages/KepalaToko/LaporanKeuangan";
import StokBahan from "./pages/KepalaToko/StokBahan";
import KepalaTokoProfile from "./pages/KepalaToko/Profile";
import Unauthorized from "./pages/Unauthorized";
import LaporanResep from "./pages/KepalaToko/Resep";
import RiwayatTransaksi from "./pages/Kasir/RiwayatTransaksi";
import LaporanTransaksi from "./pages/KepalaToko/LaporanTransaksi";
import PesanMasuk from "./pages/Waiter/PesanMasuk";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect root ("/") to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Unauthorized Route */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Waiter Routes */}
        <Route
          path="/waiter/*"
          element={
            <ProtectedRoute allowedRoles={["WAITER"]}>
              <Layout role="waiter">
                <Routes>
                  <Route index element={<Menu />} />
                  <Route path="menu" element={<Menu />} />
                  <Route path="order-summary" element={<OrderSummary />} />
                  <Route path="pesan-masuk" element={<PesanMasuk />} />
                  <Route path="profile" element={<WaiterProfile />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Koki Routes */}
        <Route
          path="/koki/*"
          element={
            <ProtectedRoute allowedRoles={["KOKI"]}>
              <Layout role="koki">
                <Routes>
                  <Route index element={<OrderDetails />} />
                  <Route path="order-detail" element={<OrderDetails />} />
                  <Route path="profile" element={<KokiProfile />} />
                  <Route path="resep" element={<Resep />} />
                  <Route path="stok-bahan" element={<KokiStokBahan />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Kasir Routes */}
        <Route
          path="/kasir/*"
          element={
            <ProtectedRoute allowedRoles={["KASIR"]}>
              <Layout role="kasir">
                <Routes>
                  <Route index element={<KasirDashboard />} />
                  <Route path="dashboard" element={<KasirDashboard />} />
                  <Route path="payments" element={<PaymentDetails />} />
                  <Route path="riwayat-transaksi" element={<RiwayatTransaksi />} />
                  <Route path="total-revenue" element={<TodayRevenue />} />
                  <Route path="profile" element={<KasirProfile />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Kepala Toko Routes */}
        <Route
          path="/kepala-toko/*"
          element={
            <ProtectedRoute allowedRoles={["KEPALA_TOKO"]}>
              <Layout role="kepala-toko">
                <Routes>
                  <Route index element={<KepalaTokoDashboard />} />
                  <Route path="dashboard" element={<KepalaTokoDashboard />} />
                  <Route path="karyawan" element={<Karyawan />} />
                  <Route path="menu" element={<LaporanMenu />} />
                  <Route path="laporan-resep" element={<LaporanResep />} />
                  <Route path="laporan-keuangan" element={<LaporanKeuangan />} />
                  <Route path="laporan-transaksi" element={<LaporanTransaksi />} />
                  <Route path="stok-bahan" element={<StokBahan />} />
                  <Route path="profile" element={<KepalaTokoProfile />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;