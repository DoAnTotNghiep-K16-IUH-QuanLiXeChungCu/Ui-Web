import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Thêm import js-cookie
import logo from "../../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const accessToken = Cookies.get("accessToken");
  const fullname = Cookies.get("fullname");
  return (
    <div className="bg-[#191970] flex justify-start items-center h-16 pl-5">
      {/* Logo */}
      <div className="relative space-x-4 pr-5">
        {accessToken ? (
          <div className="relative flex items-center space-x-4 text-left">
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-blue-600 transition-colors duration-300 focus:outline-none"
              aria-label="User Profile"
            >
              <FontAwesomeIcon
                icon={faCircleUser}
                className="text-white text-2xl"
                size="30"
              />
            </button>
            <div className="leading-tight">
              <p className="text-white text-base font-semibold">{fullname}</p>
              <p className="text-gray-300 text-sm">Quản lý</p>
            </div>
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
