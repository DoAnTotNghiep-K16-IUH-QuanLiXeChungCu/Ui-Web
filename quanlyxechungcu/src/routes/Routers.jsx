import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";
import ParkingManagement from "../pages/ParkingManage";
import ParkingFeeConfiguration from "../pages/ParkingFeeConfiguration";
import MonthlyTicketList from "../pages/MonthlyTicketList";
import Customer from "../pages/Customer";
import Vehicle from "../pages/Vehicle";
import ConnectConfiguration from "../pages/ConnectConfiguration";
import ParkingHistory from "../pages/ParkingHistory";
import AboutUs from "../pages/AboutUs";
import RFIDCard from "../pages/RFIDCard";
import Apartment from "../pages/Apartment";
import ParkingSlot from "../pages/ParkingSlot";
import ReportPerMonth from "../pages/ReportPerMonth";
import ReportPerDay from "../pages/ReportPerDay";
import Profile from "../pages/Profile";
import UserShift from "./../pages/UserShift";
import SignUp from "../pages/SignUp";
import CheckingJob from "./../pages/CheckingJob";
import LicensePlateDetection from "../components/LicensePlateDetection";
import AttendanceHistory from "../pages/AttendanceHistory";
import AttendanceHistoryDelete from "../pages/AttendanceHistoryDelete";
import Accounts from "../pages/Accounts";
import PayRollFomula from "../pages/PayRollFomula";
import Shift from "../pages/Shift";
import PayRoll from "../pages/PayRoll";
import PayRollPerUser from "../pages/PayRollPerUser";

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
        { path: "parking-manage/parking-slot", element: <ParkingSlot /> },
        { path: "parking-manage/history", element: <ParkingHistory /> },
        { path: "manage/customer", element: <Customer /> },
        { path: "manage/apartment", element: <Apartment /> },
        { path: "manage/vehicle", element: <Vehicle /> },
        { path: "manage/RFIDCard", element: <RFIDCard /> },
        { path: "manage/parking-fee", element: <ParkingFeeConfiguration /> },
        { path: "manage/accounts", element: <Accounts /> },
        { path: "manage/shifts", element: <Shift /> },
        { path: "report/per-month", element: <ReportPerMonth /> },
        { path: "report/per-day", element: <ReportPerDay /> },
        { path: "report/payrolls", element: <PayRoll /> },
        { path: "about-us", element: <AboutUs /> },
        { path: "monthly-ticket", element: <MonthlyTicketList /> },
        { path: "/account/profile", element: <Profile /> },
        { path: "/userShift/schedular", element: <UserShift /> },
        { path: "/userShift/checking-job", element: <CheckingJob /> },
        { path: "setting/connect", element: <ConnectConfiguration /> },
        { path: "/parking-check", element: <ParkingManagement /> },
        { path: "/test", element: <LicensePlateDetection /> },
        { path: "/logs", element: <AttendanceHistory /> },
        { path: "/fomula", element: <PayRollFomula /> },
        { path: "/payrollUser", element: <PayRollPerUser /> },
      ],
    },
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        { path: "login", element: <Login /> },
        { path: "forgot-password", element: <ForgotPassword /> },
        { path: "signup", element: <SignUp /> },
      ],
    },
    { path: "*", element: <NotFound /> },
  ];

  const element = useRoutes(routers);
  return element;
};

export default Routers;
