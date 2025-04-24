import React from "react";
import { Link } from "react-router-dom";

const WaiterDashboard = () => {
  return (
    <div>
      <h1>Dashboard Waiter</h1>
      <Link to="/waiter/menu">+ Pesanan Baru</Link>
    </div>
  );
};

export default WaiterDashboard;
