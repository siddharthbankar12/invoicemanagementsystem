import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/userSlice";
import { toast } from "react-toastify";

const Navbar = () => {
  const route = useNavigate();
  const token = localStorage.getItem("token");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    route("/");
  };

  const handleNavigation = (path) => {
    setIsMenuOpen(false);
    route(path);
  };

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div
          className="text-2xl font-semibold cursor-pointer"
          onClick={() => route("/")}
        >
          Invoice Management System
        </div>

        <ul className="hidden md:flex gap-6 items-center">
          {token && (
            <>
              <li
                className="cursor-pointer hover:text-blue-400"
                onClick={() => handleNavigation("/user-dashboard")}
              >
                User Dashboard
              </li>
              <li
                className="cursor-pointer hover:text-blue-400"
                onClick={() => handleNavigation("/invoice-dashboard")}
              >
                Invoice Dashboard
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>

        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>

      {isMenuOpen && (
        <ul className="md:hidden bg-gray-800 px-4 pb-4 space-y-2">
          {token && (
            <>
              <li
                className="block text-white hover:text-blue-400 cursor-pointer"
                onClick={() => handleNavigation("/user-dashboard")}
              >
                User Dashboard
              </li>
              <li
                className="block text-white hover:text-blue-400 cursor-pointer"
                onClick={() => handleNavigation("/invoice-dashboard")}
              >
                Invoice Dashboard
              </li>
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
