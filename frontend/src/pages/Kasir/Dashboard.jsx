import React from 'react';

const KasirDashboard = () => {
  const orders = [
    { id: 1, waiter: 'Waiter 1', total: 50000 },
    { id: 2, waiter: 'Waiter 2', total: 75000 },
  ];

  return (
    <div>
      <h1>Dashboard Kasir</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            Pesanan #{order.id} - {order.waiter} - Rp {order.total}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KasirDashboard;