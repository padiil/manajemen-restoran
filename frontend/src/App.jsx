import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import WaiterDashboard from "./pages/Waiter/Dashboard";
import Menu from "./pages/Waiter/Menu";
import KokiDashboard from "./pages/Koki/Dashboard";
import KasirDashboard from "./pages/Kasir/Dashboard";
import KepalaTokoDashboard from "./pages/KepalaToko/Dashboard";
import Unauthorized from "./pages/Unauthorized";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Unauthorized Route */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Waiter Routes */}
        <Route
          path="/waiter"
          element={
            <ProtectedRoute allowedRoles={["WAITER"]}>
              <WaiterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/waiter/menu"
          element={
            <ProtectedRoute allowedRoles={["WAITER"]}>
              <Menu />
            </ProtectedRoute>
          }
        />

        {/* Koki Routes */}
        <Route
          path="/koki"
          element={
            <ProtectedRoute allowedRoles={["KOKI"]}>
              <KokiDashboard />
            </ProtectedRoute>
          }
        />

        {/* Kasir Routes */}
        <Route
          path="/kasir"
          element={
            <ProtectedRoute allowedRoles={["KASIR"]}>
              <KasirDashboard />
            </ProtectedRoute>
          }
        />

        {/* Kepala Toko Routes */}
        <Route
          path="/kepala-toko"
          element={
            <ProtectedRoute allowedRoles={["KEPALA_TOKO"]}>
              <KepalaTokoDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;