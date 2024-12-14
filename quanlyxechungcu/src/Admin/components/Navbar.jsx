import React, { useState, useEffect, useCallback } from "react";
import Dropdown from "./Dropdown";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIdCard,
  faClock,
  faMoneyBillWave,
  faUsers,
  faCalculator,
  faCalendarAlt,
  faClipboardCheck,
  faMoneyCheckAlt,
  faChartBar,
  faChartPie,
  faRightFromBracket,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const myUserID = Cookies.get("profileID");
  const navigate = useNavigate();
  const fullname = Cookies.get("fullname");
  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  const handleClickOutside = useCallback((event) => {
    if (!event.target.closest(".dropdown-button")) {
      closeDropdown();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleLogout = () => {
    Cookies.remove("accessToken"); // Xóa token khỏi cookie
    Cookies.remove("role");
    Cookies.remove("fullname"); // Xóa role khỏi cookie nếu có
    Cookies.remove("profileID"); // Xóa role khỏi cookie nếu có
    navigate("/auth/login"); // Điều hướng về trang đăng nhập
  };

  return (
    <nav className="p-4">
      {/* User Section */}
      <div className="relative flex items-center space-x-4 text-left mb-6">
        <Link
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 hover:bg-blue-600 transition-colors duration-300 focus:outline-none"
          aria-label="User Profile"
          to="/admin/account/profile"
        >
          <FontAwesomeIcon
            icon={faCircleUser}
            className="text-white text-4xl"
          />
        </Link>
        <div className="leading-tight">
          <p className="text-white text-lg font-semibold">{fullname}</p>
          <p className="text-gray-300 text-sm">Quản lý</p>
        </div>
      </div>
      {/* Navigation Links */}
      <div className="mb-6">
        <span className="text-sm">Chức năng</span>
      </div>
      <div className="container mx-auto flex flex-col items-start ml-6">
        {myUserID ? (
          <>
            <div className="space-y-6">
              <Link
                to="/admin/manage/RFIDCard"
                className="text-white hover:text-yellow-600 focus:outline-none transition-colors duration-300 flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faIdCard} />
                <span>Quản lý thẻ quẹt</span>
              </Link>
              <Link
                to="/admin/manage/parking-fee"
                className="text-white hover:text-yellow-600 focus:outline-none transition-colors duration-300 flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faMoneyBillWave} />
                <span>Quản lý phí xe</span>
              </Link>
              <Link
                to="/admin/manage/accounts"
                className="text-white hover:text-yellow-600 focus:outline-none transition-colors duration-300 flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faUsers} />
                <span>Quản lý tài khoản</span>
              </Link>
              <Link
                to="/admin/manage/shifts"
                className="text-white hover:text-yellow-600 focus:outline-none transition-colors duration-300 flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faClock} />
                <span>Quản lý giờ làm việc</span>
              </Link>
              <Link
                to="/admin/manage/fomula"
                className="text-white hover:text-yellow-600 focus:outline-none transition-colors duration-300 flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faCalculator} />
                <span>Quản lý tính lương</span>
              </Link>
              <Link
                to="/admin/userShift/schedular"
                className="text-white hover:text-yellow-600 focus:outline-none transition-colors duration-300 flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>Quản lí lịch làm việc</span>
              </Link>
              <Link
                to="/admin/userShift/logs"
                className="text-white hover:text-yellow-600 focus:outline-none transition-colors duration-300 flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faClipboardCheck} />
                <span>Quản lý chấm công</span>
              </Link>
              <Link
                to="/admin/report/payrolls"
                className="text-white hover:text-yellow-600 focus:outline-none transition-colors duration-300 flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faMoneyCheckAlt} />
                <span>Quản lý lương nhân viên</span>
              </Link>
              <Link
                to="/admin/report/per-day"
                className="text-white hover:text-yellow-600 focus:outline-none transition-colors duration-300 flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faChartBar} />
                <span>Thống kê theo ngày</span>
              </Link>
              <Link
                to="/admin/report/per-month"
                className="text-white hover:text-yellow-600 focus:outline-none transition-colors duration-300 flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faChartPie} />
                <span>Thống kê theo tháng</span>
              </Link>
            </div>
            <div className="mt-20">
              {" "}
              {/* Tạo khoảng cách lớn với nhóm nút chức năng */}
              <button
                onClick={handleLogout}
                className="text-white hover:text-yellow-600 focus:outline-none transition-colors duration-300 flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
                <span>Đăng xuất</span>
              </button>
            </div>
          </>
        ) : (
          <Link
            to="/auth/login"
            className="text-white hover:text-yellow-600 focus:outline-none transition-colors duration-300"
          >
            Đăng nhập để truy cập các chức năng
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
