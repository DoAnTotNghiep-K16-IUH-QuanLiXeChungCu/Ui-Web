import React from "react";
import { UserProvider } from "../contexts/UserContext";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const DashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <UserProvider>
        <Header />
        <Navbar />
        <div className="flex-grow">
          <Outlet />
        </div>
        <Footer />
      </UserProvider>
    </div>
  );
};

export default DashboardLayout;
