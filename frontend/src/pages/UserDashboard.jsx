import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const UserDashboard = () => {
  const userData = useSelector((state) => state.user.user);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    const { name, email, role, password } = formData;

    try {
      const response = await axiosInstance.post("/auth/register", {
        name,
        email,
        role,
        password,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({ name: "", email: "", role: "", password: "" });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unexpected error occurred."
      );
      console.error(error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      selectedRole === "" ||
      user.role.toLowerCase() === selectedRole.toLowerCase();

    return matchesSearch && matchesRole;
  });

  useEffect(() => {
    const fetchUsers = async () => {
      if (userData && userData?.userId) {
        try {
          const response = await axiosInstance.post("/user/get-all-users", {
            userId: userData?.userId,
          });

          if (response.data.success) {
            setUsers(response.data.usersData);
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          console.error(error);
          toast.error("Failed to fetch users");
        }
      }
    };

    fetchUsers();
  }, [userData]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Email or Name"
          className="border p-2 rounded w-full sm:w-64"
        />

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="border p-2 rounded w-full sm:w-48"
        >
          <option value="">Filter by Role</option>
          <option value="ADMIN">ADMIN</option>
          <option value="UNIT MANAGER">UNIT MANAGER</option>
          <option value="USER">USER</option>
        </select>
      </div>

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
          {filteredUsers.map((user) => (
            <tr key={user._id} className="border-t">
              <td className="p-3">{user._id}</td>
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.role}</td>
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

      <div className="mt-10 max-w-xl">
        <h2 className="text-xl font-semibold mb-4">Create New User</h2>

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
