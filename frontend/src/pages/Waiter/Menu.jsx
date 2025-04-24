import React, { useState } from "react";

const Menu = () => {
  const [order, setOrder] = useState([]);

  const menuItems = [
    { id: 1, name: "Nasi Goreng", price: 20000 },
    { id: 2, name: "Es Teh", price: 5000 },
  ];

  const addToOrder = (item) => {
    setOrder((prev) => [...prev, item]);
  };

  return (
    <div>
      <h1>Daftar Menu</h1>
      <ul>
        {menuItems.map((item) => (
          <li key={item.id}>
            {item.name} - Rp {item.price}{" "}
            <button onClick={() => addToOrder(item)}>Tambah</button>
          </li>
        ))}
      </ul>
      <h2>Pesanan Sementara</h2>
      <ul>
        {order.map((item, index) => (
          <li key={index}>
            {item.name} - Rp {item.price}
          </li>
        ))}
      </ul>
      <button onClick={() => alert("Pesanan dikirim!")}>Kirim Pesanan</button>
    </div>
  );
};

export default Menu;
