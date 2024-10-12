import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Thêm import js-cookie
import logo from "../assets/logo.png";

const Header = () => {
  const navigate = useNavigate();
  const accessToken = Cookies.get("accessToken");

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    Cookies.remove("accessToken"); // Xóa token khỏi cookie
    Cookies.remove("role"); // Xóa role khỏi cookie nếu có
    navigate("/home"); // Điều hướng về trang đăng nhập
  };

  return (
    <div className="bg-white flex justify-between items-center h-11 pl-5">
      {/* Logo */}
      <Link to={"/home"}>
        <img className="h-20 w-20 ml-10" src={logo} alt="logo"></img>
      </Link>

      <div className="space-x-4 pr-5">
        {accessToken ? (
          // Nếu có token, hiển thị nút Đăng xuất
          <button
            onClick={handleLogout}
            className="text-black hover:text-blue-600 mr-5"
          >
            Đăng xuất
          </button>
        ) : (
          // Nếu không có token, hiển thị nút Đăng nhập
          <Link
            to="/auth/login"
            className="text-black hover:text-blue-600 mr-5"
          >
            Đăng nhập
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
