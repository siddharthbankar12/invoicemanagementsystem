import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import InvoiceDashboard from "./pages/InvoiceDashboard";
import UserDashboard from "./pages/UserDashboard";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "./axios";
import { login } from "./store/userSlice";
import Navbar from "./components/Navbar";

const App = () => {
  const userData = useSelector((state) => state.user.user);

  const dispatch = useDispatch();

  async function getCurrentUserData(token) {
    try {
      const response = await axiosInstance.post("/auth/get-current-user", {
        token,
      });

      if (response.data.success) {
        dispatch(login(response.data.userData));
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!userData) {
      const token = localStorage.getItem("token");
      if (token) {
        console.log("user logged in but lost data");
        getCurrentUserData(JSON.parse(token));
      } else {
        console.log("user not logged in");
      }
    }
  }, [userData]);

  console.log(userData);
  return (
    <div>
      <Navbar />
      {userData && (
        <h1 className="text-center text-xl font-medium text-gray-700 py-4 border-b border-gray-300">
          Name - {userData.userName} <span className="text-gray-500">/</span>{" "}
          Role -
          <span className="text-blue-500 capitalize"> {userData.role}</span>
        </h1>
      )}

      <Routes>
        {!userData && <Route element={<LoginPage />} path="/" />}

        <Route element={<InvoiceDashboard />} path="/invoice-dashboard" />
        <Route element={<UserDashboard />} path="/user-dashboard" />
      </Routes>
    </div>
  );
};

export default App;
