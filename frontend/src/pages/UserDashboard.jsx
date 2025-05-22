import React, { useState } from "react";
import axiosInstance from "../axios";

const UserDashboard = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    const { name, email, role, password } = formData;

    if (!name || !email || !role || !password) {
      setMessageType("error");
      setMessage("All fields are required.");
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/register", {
        name,
        email,
        role,
        password,
      });

      if (response.data.success) {
        setMessageType("success");
        setMessage(response.data.message);
        setFormData({ name: "", email: "", role: "", password: "" });
      } else {
        setMessageType("error");
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessageType("error");
      setMessage("Something went wrong.");
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>

      {/* Filter Section */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Email or Name"
          className="border p-2 rounded w-full sm:w-64"
        />
        <select className="border p-2 rounded w-full sm:w-48">
          <option>Filter by Role</option>
          <option>ADMIN</option>
          <option>UNIT MANAGER</option>
          <option>USER</option>
        </select>
      </div>

      {/* Static Table (replace with dynamic data later) */}
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-100 text-left">
          <tr>
            <th className="p-3">User ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((id) => (
            <tr key={id} className="border-t">
              <td className="p-3">
                {id === 1 ? "A1" : id === 2 ? "UM1" : "U1"}
              </td>
              <td className="p-3">User {id}</td>
              <td className="p-3">user{id}@example.com</td>
              <td className="p-3">
                {id === 1 ? "ADMIN" : id === 2 ? "UNIT MANAGER" : "USER"}
              </td>
              <td className="p-3 space-x-2">
                <button className="bg-yellow-400 px-3 py-1 rounded">
                  Edit
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create User Form */}
      <div className="mt-10 max-w-xl">
        <h2 className="text-xl font-semibold mb-4">Create New User</h2>

        {message && (
          <div
            className={`mb-4 px-4 py-2 rounded ${
              messageType === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleCreateUser} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="User Name"
          />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Email"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Role</option>
            <option value="ADMIN">ADMIN</option>
            <option value="UNIT MANAGER">UNIT MANAGER</option>
            <option value="USER">USER</option>
          </select>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Password"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserDashboard;
