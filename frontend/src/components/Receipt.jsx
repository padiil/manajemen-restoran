import React from "react";

const Receipt = ({ order }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Struk Pembayaran</h1>
      <p className="text-sm text-gray-600 mb-2">ID Pesanan: {order.id}</p>
      <ul className="list-disc pl-6 mb-4">
        {order.OrderItem.map((item) => (
          <li key={item.productId} className="text-gray-700">
            {item.product.nama} x{item.quantity} - Rp {(item.hargaSatuan * item.quantity).toLocaleString()}
          </li>
        ))}
      </ul>
      <p className="text-lg font-semibold text-gray-800">
        Total Harga: Rp {order.totalHarga.toLocaleString()}
      </p>
      <p className="text-sm text-gray-600 mt-4">Terima kasih atas kunjungan Anda!</p>
    </div>
  );
};

export default Receipt;