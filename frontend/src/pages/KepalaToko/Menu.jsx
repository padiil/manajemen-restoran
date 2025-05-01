import { useState, useEffect } from "react";
import axios from "axios";

export default function LaporanResep() {
  const [reseps, setReseps] = useState([]);
  const [editedResep, setEditedResep] = useState(null);

  useEffect(() => {
    fetchReseps();
  }, []);

  const fetchReseps = async () => {
    try {
      const response = await axios.get("http://localhost:3000/resep");
      setReseps(response.data);
    } catch (error) {
      console.error("Error fetching reseps:", error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedResep({ ...editedResep, [name]: value });
  };

  const handleEditClick = (resep) => {
    setEditedResep(resep);
  };

  const handleCancelEdit = () => {
    setEditedResep(null);
  };

  const handleUpdateResep = async () => {
    try {
      await axios.patch(`http://localhost:3000/resep/${editedResep.id}`, editedResep);
      setEditedResep(null);
      fetchReseps();
    } catch (error) {
      console.error("Error updating resep:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Laporan Resep</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Nama Resep</th>
            <th className="py-2 px-4 border-b">Deskripsi</th>
            <th className="py-2 px-4 border-b">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {reseps.map((resep) => (
            <tr key={resep.id}>
              <td className="py-2 px-4 border-b">{resep.id}</td>
              <td className="py-2 px-4 border-b">
                {editedResep?.id === resep.id ? (
                  <input
                    type="text"
                    name="nama"
                    value={editedResep.nama}
                    onChange={handleEditChange}
                    className="border p-1"
                  />
                ) : (
                  resep.nama
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editedResep?.id === resep.id ? (
                  <input
                    type="text"
                    name="deskripsi"
                    value={editedResep.deskripsi}
                    onChange={handleEditChange}
                    className="border p-1"
                  />
                ) : (
                  resep.deskripsi
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editedResep?.id === resep.id ? (
                  <>
                    <button
                      onClick={handleUpdateResep}
                      className="bg-green-500 text-white px-2 py-1 mr-2"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white px-2 py-1"
                    >
                      Batal
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEditClick(resep)}
                    className="bg-blue-500 text-white px-2 py-1"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
