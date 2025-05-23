import React, { useEffect, useState } from "react";
import axiosInstance from "../axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const userData = useSelector((state) => state.user.user);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    role: "",
    password: "",
  });
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.post("/user/get-all-users");

      if (response.data.success) {
        const allUsers = response.data.usersData;

        let visibleUsers = [];

        if (userData?.role === "SUPER ADMIN") {
          visibleUsers = allUsers.filter(
            (u) =>
              u.role === "USER" ||
              u.role === "UNIT MANAGER" ||
              u.role === "ADMIN"
          );
        } else if (userData?.role === "ADMIN") {
          visibleUsers = allUsers.filter(
            (u) => u.role === "UNIT MANAGER" || u.role === "USER"
          );
        } else if (userData?.role === "UNIT MANAGER") {
          visibleUsers = allUsers.filter((u) => u.role === "USER");
        }

        setUsers(visibleUsers);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    const { userName, email, role, password } = formData;

    try {
      const response = await axiosInstance.post("/auth/register", {
        userName,
        email,
        role,
        password,
        loginUserRole: userData?.role,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({ userName: "", email: "", role: "", password: "" });
        fetchUsers();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await axiosInstance.post("/user/update-role", {
        userId,
        role: newRole,
      });

      if (response.data.success) {
        toast.success("Role updated successfully");
        fetchUsers();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axiosInstance.delete(`/user/delete/${userId}`);
      if (response.data.success) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      selectedRole === "" ||
      user.role.toLowerCase() === selectedRole.toLowerCase();

    return matchesSearch && matchesRole;
  });

  useEffect(() => {
    if (userData?.role === "USER") {
      navigate("/");
    }
  }, [userData]);

  useEffect(() => {
    if (userData?.role && userData?.role !== "USER") {
      fetchUsers();
    }
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
              <td className="p-3">{user.userID}</td>
              <td className="p-3">{user.userName}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3 space-x-2">
                <select
                  value={user.newRole || user.role}
                  onChange={(e) => {
                    const updatedUsers = users.map((u) =>
                      u._id === user._id ? { ...u, newRole: e.target.value } : u
                    );
                    setUsers(updatedUsers);
                  }}
                  className="border p-1 rounded"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="UNIT MANAGER">UNIT MANAGER</option>
                  <option value="USER">USER</option>
                </select>
                <button
                  onClick={() =>
                    handleRoleChange(user._id, user.newRole || user.role)
                  }
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              </td>

              <td className="p-3 space-x-2">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => {
                    handleDeleteUser(user._id);
                  }}
                >
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
            name="userName"
            value={formData.userName}
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
            {userData?.role === "SUPER ADMIN" && (
              <>
                <option value="ADMIN">ADMIN</option>
              </>
            )}
            {userData?.role === "ADMIN" && (
              <>
                <option value="UNIT MANAGER">UNIT MANAGER</option>
              </>
            )}
            {userData?.role === "UNIT MANAGER" && (
              <>
                <option value="USER">USER</option>
              </>
            )}
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
