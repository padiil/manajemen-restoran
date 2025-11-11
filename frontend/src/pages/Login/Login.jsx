import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State untuk kontrol visibility password
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

      console.log("Login berhasil, role:", user.jabatan);

      // Redirect berdasarkan role
      switch (user.jabatan) {
        case "WAITER":
          navigate("/waiter");
          break;
        case "KOKI":
          navigate("/koki");
          break;
        case "KASIR":
          navigate("/kasir");
          break;
        case "KEPALA_TOKO":
          navigate("/kepala-toko");
          break;
        default:
          navigate("/unauthorized");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login gagal. Periksa email dan password Anda.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-[90%] sm:max-w-[500px]">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-6 relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
