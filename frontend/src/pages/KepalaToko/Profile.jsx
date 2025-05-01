import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react"; // Import ikon Eye dan EyeOff dari lucide-react

function KepalaTokoProfile() {
  const [karyawan, setKaryawan] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    nama: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false); // Untuk mengontrol visibilitas password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Untuk konfirmasi password
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/karyawan/5`)
      .then((res) => {
        setKaryawan(res.data);
        setEditData({ 
          nama: res.data.nama, 
          email: res.data.email, 
          password: "", 
          confirmPassword: "" 
        });
      })
      .catch((err) => {
        console.error("Gagal mengambil data:", err);
        alert("Terjadi kesalahan saat mengambil data.");
      });
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Validasi password
    if (editData.password !== editData.confirmPassword) {
      alert("Password dan konfirmasi password tidak cocok.");
      return;
    }

    try {
      await axios.patch(`http://localhost:3000/karyawan/5`, {
        nama: editData.nama,
        email: editData.email,
        password: editData.password,
      });
      alert("Data berhasil diperbarui!");
      setKaryawan((prev) => ({
        ...prev,
        nama: editData.nama,
        email: editData.email,
      }));
      setIsEditing(false);
    } catch (err) {
      console.error("Gagal memperbarui data:", err);
      alert("Terjadi kesalahan saat memperbarui data.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (!karyawan) return <p className="text-center mt-10 text-gray-600">Memuat data...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-100 p-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Profil Karyawan</h1>
      </div>

      <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-semibold text-indigo-700">Detail Karyawan</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg text-gray-700">
          <p><span className="font-medium text-gray-600">ID:</span> {karyawan.id}</p>
          <p><span className="font-medium text-gray-600">Nama:</span> {karyawan.nama}</p>
          <p><span className="font-medium text-gray-600">Jabatan:</span> {karyawan.jabatan}</p>
          <p><span className="font-medium text-gray-600">Email:</span> {karyawan.email}</p>
          <p>
            <span className="font-medium text-gray-600">Status Aktif:</span>{" "}
            <span className={`font-semibold ${karyawan.aktif ? 'text-green-600' : 'text-red-600'}`}>
              {karyawan.aktif ? "Aktif" : "Tidak Aktif"}
            </span>
          </p>
          <p><span className="font-medium text-gray-600">Clocked In:</span> {karyawan.clockedInAt ? new Date(karyawan.clockedInAt).toLocaleString() : "-"}</p>
          <p><span className="font-medium text-gray-600">Clocked Out:</span> {karyawan.clockedOutAt ? new Date(karyawan.clockedOutAt).toLocaleString() : "Belum Clock Out"}</p>
          <p><span className="font-medium text-gray-600">Dibuat:</span> {new Date(karyawan.createdAt).toLocaleString()}</p>
          <p><span className="font-medium text-gray-600">Terakhir Diperbarui:</span> {new Date(karyawan.updatedAt).toLocaleString()}</p>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleEditSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">Nama</label>
              <input
                type="text"
                name="nama"
                value={editData.nama}
                onChange={handleEditChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleEditChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Password Baru</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={editData.password}
                  onChange={handleEditChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-2.5"
                >
                  {showPassword ? <EyeOff className="h-6 w-6 text-gray-500" /> : <Eye className="h-6 w-6 text-gray-500" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Konfirmasi Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={editData.confirmPassword}
                  onChange={handleEditChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-2.5"
                >
                  {showConfirmPassword ? <EyeOff className="h-6 w-6 text-gray-500" /> : <Eye className="h-6 w-6 text-gray-500" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleEditToggle}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Simpan
              </button>
            </div>
          </form>
        )}

        {/* Edit and Logout Buttons */}
        {!isEditing && (
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleEditToggle}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
            >
              Edit Profil
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default KepalaTokoProfile;
// 