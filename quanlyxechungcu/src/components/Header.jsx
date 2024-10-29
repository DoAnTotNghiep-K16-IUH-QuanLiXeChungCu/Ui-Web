import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Thêm import js-cookie
import logo from "../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import UserContext from "../context/UserContext";
import { getData } from "../context/indexedDB";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const accessToken = Cookies.get("accessToken");
  const { profile } = useContext(UserContext);
  // console.log("profile", profile);
  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    Cookies.remove("accessToken"); // Xóa token khỏi cookie
    Cookies.remove("role"); // Xóa role khỏi cookie nếu có
    navigate("/auth/login"); // Điều hướng về trang đăng nhập
  };
  // Parse JSON

  // Toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const handleNavigateToProfile = () => {
    setDropdownOpen(false);
    navigate("/account/profile"); // Điều hướng về trang đăng nhập
  };
  return (
    <div className="bg-white flex justify-between items-center h-11 pl-5">
      {/* Logo */}
      <Link to={"/home"}>
        <img className="h-20 w-20 ml-10" src={logo} alt="logo"></img>
      </Link>

      <div className="relative space-x-4 pr-5">
        {accessToken ? (
          // Nếu có token, hiển thị dropdown
          <div className="relative inline-block text-left">
            <button
              onClick={toggleDropdown}
              className="text-black hover:text-blue-600 mr-5 focus:outline-none"
            >
              <FontAwesomeIcon icon={faCircleUser} className="text-2xl mr-2" />
              {profile?.fullname}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
                <button
                  onClick={handleNavigateToProfile}
                  className="block px-4 py-2 text-black hover:bg-gray-100"
                >
                  Thông tin cá nhân
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
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
