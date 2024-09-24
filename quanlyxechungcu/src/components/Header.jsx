import React from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <div className="bg-white flex justify-between items-center h-11 pl-5">
      {/* Logo */}
      <Link to={"/home"}>
        <img className="h-20 w-20 ml-10" src={logo} alt="logo"></img>
      </Link>

      <div className="space-x-4 pr-5">
        <Link to="/auth/login" className="text-black hover:text-blue-600 mr-5">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
};
// bg-[#F9683A]
export default Header;
