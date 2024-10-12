import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "./../layouts/AuthLayout";
import ParkingManagement from "../pages/ParkingManage";
import ParkingFeeConfiguration from "../pages/ParkingFeeConfiguration";
import MonthlyTicketList from "../pages/MonthlyTicketList";
import Customer from "../pages/Customer";
import Vehicle from "../pages/Vehicle";
import ConnectConfiguration from "../pages/ConnectConfiguration";
import ParkingHistory from "../pages/ParkingHistory";
import StatisPerMonth from "./../pages/StatisPerMonth";
import AboutUs from "./../pages/AboutUs";
import RFIDCard from "../pages/RFIDCard";
import Apartment from "../pages/Apartment";

const Routers = () => {
  const routers = [
    // { index: true, element: <Home /> },
    {
      path: "/",
      element: <Navigate to="/home"></Navigate>,
    },
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        { path: "home", element: <Home /> },
        { path: "parking-manage/check", element: <ParkingManagement /> },
        // { path: "registrationform", element: <RegistrationForm /> },
        { path: "parking-manage/history", element: <ParkingHistory /> },
        { path: "setting/parking-fee", element: <ParkingFeeConfiguration /> },
        { path: "setting/connect", element: <ConnectConfiguration /> },
        { path: "customer", element: <Customer /> },
        { path: "apartment", element: <Apartment /> },
        { path: "vehicle", element: <Vehicle /> },
        { path: "statistic/permonth", element: <StatisPerMonth /> },
        { path: "RFID", element: <RFIDCard /> },
        { path: "about-us", element: <AboutUs /> },
        { path: "monthly-ticket", element: <MonthlyTicketList /> },
      ],
    },
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        { path: "login", element: <Login /> },
        { path: "forgot-password", element: <ForgotPassword /> },
      ],
    },
    { path: "*", element: <NotFound /> },
  ];

  const element = useRoutes(routers);
  return element;
};

export default Routers;
