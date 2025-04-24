import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });
      const { access_token, user } = response.data;

      // Simpan token dan role ke localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("role", user.jabatan);

      console.log("Login berhasil, role:", user.jabatan); // Log role pengguna

      // Redirect berdasarkan role
      switch (user.jabatan) {
        case "WAITER":
          console.log("Redirecting to /waiter");
          navigate("/waiter");
          break;
        case "KOKI":
          console.log("Redirecting to /koki");
          navigate("/koki");
          break;
        case "KASIR":
          console.log("Redirecting to /kasir");
          navigate("/kasir");
          break;
        case "KEPALA_TOKO":
          console.log("Redirecting to /kepala-toko");
          navigate("/kepala-toko");
          break;
        default:
          console.log("Redirecting to /unauthorized");
          navigate("/unauthorized");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login gagal. Periksa email dan password Anda.");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
