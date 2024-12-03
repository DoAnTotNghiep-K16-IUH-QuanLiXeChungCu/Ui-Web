import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
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

    // Cleanup event listener when the component unmounts
    return () => {
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
      <Footer />
    </div>
  );
};

export default AdminLayout;
