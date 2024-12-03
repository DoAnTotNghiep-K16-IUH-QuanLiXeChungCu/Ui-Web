import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import NotFound from "./../Employee/pages/NotFound";
import Login from "../Employee/pages/Login";
import AuthLayout from "./../Employee/layouts/AuthLayout";
import ParkingManagement from "./../Employee/pages/ParkingManage";
import ConnectConfiguration from "./../Employee/pages/ConnectConfiguration";
import CheckingJob from "./../Employee/pages/CheckingJob";
import UserShiftEmployee from "./../Employee/pages/UserShiftEmployee";
import Profile from "./../Employee/pages/Profile";
import MonthlyTicketList from "./../Employee/pages/MonthlyTicketList";
import AboutUs from "./../Employee/pages/AboutUs";
import Vehicle from "./../Employee/pages/Vehicle";
import Customer from "./../Employee/pages/Customer";
import ParkingHistory from "./../Employee/pages/ParkingHistory";
import ParkingSlot from "./../Employee/pages/ParkingSlot";
import Home from "./../Employee/pages/Home";
import EmployeeLayout from "./../Employee/layouts/EmployeeLayout";
import PayRollPerUser from "../Admin/pages/PayRollPerUser";
import AttendanceHistory from "../Admin/pages/AttendanceHistory";
import UserShift from "../Admin/pages/UserShift";
import ReportPerDay from "../Admin/pages/ReportPerDay";
import ReportPerMonth from "../Admin/pages/ReportPerMonth";
import Shift from "../Admin/pages/Shift";
import Accounts from "../Admin/pages/Accounts";
import ParkingFeeConfiguration from "../Admin/pages/ParkingFeeConfiguration";
import RFIDCard from "../Admin/pages/RFIDCard";
import Apartment from "../Admin/pages/Apartment";
import AdminLayout from "./../Admin/layouts/AdminLayout";
import PayRoll from "./../Admin/pages/PayRoll";
import PayRollFomula from "./../Admin/pages/PayRollFomula";

const Routers = () => {
  const routers = [
    {
      path: "/",
      element: <Navigate to="/auth/login"></Navigate>,
    },
    {
      path: "/admin",
      element: <AdminLayout />,
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
        { path: "manage/fomula", element: <PayRollFomula /> },
        { path: "report/per-month", element: <ReportPerMonth /> },
        { path: "report/per-day", element: <ReportPerDay /> },
        { path: "report/payrolls", element: <PayRoll /> },
        { path: "monthly-ticket", element: <MonthlyTicketList /> },
        { path: "account/profile", element: <Profile /> },
        { path: "userShift/schedular", element: <UserShift /> },
        { path: "userShift/checking-job", element: <CheckingJob /> },
        { path: "setting/connect", element: <ConnectConfiguration /> },
        { path: "parking-check", element: <ParkingManagement /> },
        { path: "userShift/logs", element: <AttendanceHistory /> },
        { path: "parking-check", element: <ParkingManagement /> },
        { path: "monthly-ticket", element: <MonthlyTicketList /> },
        { path: "about-us", element: <AboutUs /> },
        { path: "payrollUser", element: <PayRollPerUser /> },
      ],
    },
    {
      path: "/",
      element: <EmployeeLayout />,
      children: [
        { path: "home", element: <Home /> },
        { path: "parking-manage/parking-slot", element: <ParkingSlot /> },
        { path: "parking-manage/history", element: <ParkingHistory /> },
        { path: "manage/customer", element: <Customer /> },
        { path: "manage/vehicle", element: <Vehicle /> },
        { path: "about-us", element: <AboutUs /> },
        { path: "monthly-ticket", element: <MonthlyTicketList /> },
        { path: "account/profile", element: <Profile /> },
        { path: "userShift/schedular", element: <UserShiftEmployee /> },
        { path: "userShift/checking-job", element: <CheckingJob /> },
        { path: "setting/connect", element: <ConnectConfiguration /> },
        { path: "parking-check", element: <ParkingManagement /> },
      ],
    },
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [{ path: "login", element: <Login /> }],
    },
    { path: "*", element: <NotFound /> },
  ];

  const element = useRoutes(routers);
  return element;
};

export default Routers;
