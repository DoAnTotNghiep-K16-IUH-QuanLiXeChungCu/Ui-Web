import React, { useState } from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Notification from "../components/Notification";

const DashboardLayout = () => {
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  window.addEventListener("offline", () => {
    setShowNotification({
      content: `You are offline. Using cached data.`,
      type: "Notification",
      show: true,
    });
  });

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

export default DashboardLayout;
