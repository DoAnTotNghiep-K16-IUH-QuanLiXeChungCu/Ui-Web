import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Notification from "../components/Notification";
import NavbarEmployee from "./../components/NavbarEmployee";

const EmployeeLayout = () => {
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
      <Header />
      <NavbarEmployee />
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

export default EmployeeLayout;
