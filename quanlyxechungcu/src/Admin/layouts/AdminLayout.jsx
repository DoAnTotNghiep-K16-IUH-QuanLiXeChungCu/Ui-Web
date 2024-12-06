import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Notification from "../components/Notification";

const AdminLayout = () => {
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });

  useEffect(() => {
    const handleOffline = () => {
      setShowNotification({
        content: "You are offline. Using cached data.",
        type: "Notification",
        show: true,
      });
    };

    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="fixed left-0 w-80 h-full bg-[#191970] text-white hidden lg:block">
          <Navbar />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-80 overflow-y-auto">
          <Outlet />
        </div>
      </div>

      {/* Notification */}
      {showNotification.show && (
        <div className="absolute top-4 right-4 bg-yellow-300 text-black p-4 rounded shadow-md">
          {showNotification.content}
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
