import React from "react";
import { Link, Outlet } from "react-router-dom";
import logo from "../../assets/logo.png";

const AuthLayout = () => {
  return (
    <div>
      <div className="bg-[#ec7a00] flex justify-between items-center h-11">
        <Link to={"/home"}>
          <img className="h-20 w-20 ml-10" src={logo} alt="logo"></img>
        </Link>
      </div>
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
