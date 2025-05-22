import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import InvoiceDashboard from "./pages/InvoiceDashboard";
import UserDashboard from "./pages/UserDashboard";

const App = () => {
  return (
    <div>
      <Routes>
        <Route element={<LoginPage />} path="/" />
        <Route element={<InvoiceDashboard />} path="/invoice-dashboard" />
        <Route element={<UserDashboard />} path="/user-dashboard" />
      </Routes>
    </div>
  );
};

export default App;
