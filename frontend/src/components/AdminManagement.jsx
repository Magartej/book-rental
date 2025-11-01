import React, { useState } from "react";
import axios from "axios";

const AdminManagement = ({ token }) => {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all admins
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/auth/admins");
      setAdmins(res.data.admins);
    } catch (err) {
      setError("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  // Add admin
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await axios.post("/api/auth/add-admin", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Admin added successfully");
      setForm({ username: "", email: "", password: "" });
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add admin");
    } finally {
      setLoading(false);
    }
  };

  // Delete admin
  const handleDeleteAdmin = async (id) => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await axios.delete(`/api/auth/delete-admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Admin deleted successfully");
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete admin");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAdmins();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Admin Management</h2>
      <form
        onSubmit={handleAddAdmin}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
      >
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          className="border rounded px-3 py-2 focus:outline-none focus:ring w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="border rounded px-3 py-2 focus:outline-none focus:ring w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="border rounded px-3 py-2 focus:outline-none focus:ring w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="md:col-span-3 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 mt-2"
        >
          Add Admin
        </button>
      </form>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}
      <h3 className="text-lg font-semibold mb-2">Current Admins</h3>
      <ul className="space-y-2">
        {admins.map((admin) => (
          <li
            key={admin._id}
            className="flex items-center justify-between bg-gray-50 rounded px-3 py-2"
          >
            <span>
              {admin.username} ({admin.email})
            </span>
            <button
              onClick={() => handleDeleteAdmin(admin._id)}
              disabled={loading}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
        {admins.length === 0 && (
          <li className="text-gray-500">No admins found.</li>
        )}
      </ul>
    </div>
  );
};

export default AdminManagement;
