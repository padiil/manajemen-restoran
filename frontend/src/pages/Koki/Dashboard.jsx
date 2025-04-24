import React from 'react';

const KokiDashboard = () => {
  const orders = [
    { id: 1, status: 'DIBUAT', time: '10:00' },
    { id: 2, status: 'DIMASAK', time: '10:30' },
  ];

  return (
    <div>
      <h1>Dashboard Koki</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            Pesanan #{order.id} - {order.status} - {order.time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KokiDashboard;