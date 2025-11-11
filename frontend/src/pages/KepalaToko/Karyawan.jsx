import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const Karyawan = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ nama: "", jabatan: "", email: "", password: "" });
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const API_URL = "http://localhost:3000/karyawan";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployees(response.data);
        setLoading(false);
      } catch {
        setError("Gagal memuat data karyawan.");
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleAddEmployee = async () => {
    if (newEmployee.nama && newEmployee.jabatan && newEmployee.email && newEmployee.password) {
      try {
        const response = await axios.post(API_URL, newEmployee, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployees([...employees, response.data]);
        setNewEmployee({ nama: "", jabatan: "", email: "", password: "" });
      } catch {
        setError("Gagal menambahkan karyawan.");
      }
    } else {
      alert("Harap isi semua data karyawan!");
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setNewEmployee({ nama: employee.nama, jabatan: employee.jabatan, email: employee.email, password: "" });
  };

  const handleUpdateEmployee = async () => {
    if (newEmployee.nama && newEmployee.jabatan && newEmployee.email) {
      try {
        const response = await axios.patch(`${API_URL}/${editingEmployee.id}`, newEmployee, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployees(
          employees.map((emp) => (emp.id === editingEmployee.id ? response.data : emp))
        );
        setEditingEmployee(null);
        setNewEmployee({ nama: "", jabatan: "", email: "", password: "" });
      } catch {
        setError("Gagal memperbarui karyawan.");
      }
    } else {
      alert("Harap isi semua data karyawan!");
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees(employees.filter((emp) => emp.id !== id));
    } catch {
      setError("Gagal menghapus karyawan.");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Kelola Karyawan</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {loading ? (
        <p className="text-center text-gray-500">Memuat data karyawan...</p>
      ) : (
        <>
          {/* Form Tambah/Edit */}
          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">{editingEmployee ? "Edit Karyawan" : "Tambah Karyawan"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="nama"
                placeholder="Nama Karyawan"
                value={newEmployee.nama}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded"
              />
              <select
                name="jabatan"
                value={newEmployee.jabatan}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="">Pilih Jabatan</option>
                <option value="WAITER">Waiter</option>
                <option value="KOKI">Koki</option>
                <option value="KASIR">Kasir</option>
                <option value="KEPALA_TOKO">Kepala Toko</option>
              </select>
              <input
                type="email"
                name="email"
                placeholder="Email Karyawan"
                value={newEmployee.email}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded"
              />
              {!editingEmployee && (
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={newEmployee.password}
                    onChange={handleInputChange}
                    className="p-2 border border-gray-300 rounded w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full sm:w-auto"
            >
              {editingEmployee ? "Update Karyawan" : "Tambah Karyawan"}
            </button>
          </div>

          {/* Daftar Karyawan (Responsive) */}
          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-2">Daftar Karyawan</h2>
            {employees.length === 0 ? (
              <p className="text-center text-gray-500">Belum ada data karyawan.</p>
            ) : (
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center"
                  >
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">ID:</span> {employee.id}</p>
                      <p><span className="font-medium">Nama:</span> {employee.nama}</p>
                      <p><span className="font-medium">Jabatan:</span> {employee.jabatan}</p>
                      <p><span className="font-medium">Email:</span> {employee.email}</p>
                    </div>
                    <div className="mt-3 sm:mt-0 flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleEditEmployee(employee)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Karyawan;
