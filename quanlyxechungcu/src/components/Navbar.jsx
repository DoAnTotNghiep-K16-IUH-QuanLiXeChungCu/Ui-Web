import React, { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIdCard,
  faMotorcycle,
  faUser,
  faCreditCard,
  faBuilding,
  faClipboard,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const myUserID = Cookies.get("profileID");
  // console.log("myUserID", myUserID);

  const toggleDropdown = (dropdown) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdown);
    }
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".dropdown-button")) {
      closeDropdown();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-[#ec7a00] p-4 h-14">
      <div className="container mx-auto flex justify-center items-center space-x-6">
        {myUserID ? (
          <>
            <Link
              to="/monthly-ticket"
              className="text-white hover:text-gray-600 focus:outline-none transition-colors duration-300 pl-5 flex flex-col items-center"
            >
              <FontAwesomeIcon icon={faIdCard} />
              <span>VÉ THÁNG</span>
            </Link>
            <Link
              to="/customer"
              className="text-white hover:text-gray-600 focus:outline-none transition-colors duration-300 pl-5 flex flex-col items-center"
            >
              <FontAwesomeIcon icon={faUser} />
              KHÁCH HÀNG
            </Link>
            <Link
              to="/vehicle"
              className="text-white hover:text-gray-600 focus:outline-none transition-colors duration-300 pl-5 flex flex-col items-center"
            >
              <FontAwesomeIcon icon={faMotorcycle} />
              DANH SÁCH XE
            </Link>
            <Dropdown
              label="BÃI ĐỖ"
              items={["KIỂM TRA", "LỊCH SỬ", "DANH SÁCH BÃI ĐỖ"]}
              isOpen={openDropdown === "baido"}
              toggleDropdown={() => toggleDropdown("baido")}
              closeDropdown={closeDropdown}
            />
            <Link
              to="/apartment"
              className="text-white hover:text-gray-600 focus:outline-none transition-colors duration-300 pl-5 flex flex-col items-center"
            >
              <FontAwesomeIcon icon={faBuilding} />
              DANH SÁCH PHÒNG
            </Link>
            <Link
              to="/userShift"
              className="text-white hover:text-gray-600 focus:outline-none transition-colors duration-300 pl-5 flex flex-col items-center"
            >
              <FontAwesomeIcon icon={faClipboard} />
              CA TRỰC
            </Link>
            <Link
              to="/RFID"
              className="text-white hover:text-gray-600 focus:outline-none transition-colors duration-300 pl-5 flex flex-col items-center"
            >
              <FontAwesomeIcon icon={faCreditCard} />
              DANH SÁCH THẺ
            </Link>
            <Dropdown
              label="BÁO CÁO"
              items={["THEO THÁNG", "THEO NGÀY"]}
              isOpen={openDropdown === "baocao"}
              toggleDropdown={() => toggleDropdown("baocao")}
              closeDropdown={closeDropdown}
            />
            <Dropdown
              label="CÀI ĐẶT"
              items={["KẾT NỐI", "PHÍ XE"]}
              isOpen={openDropdown === "caidat"}
              toggleDropdown={() => toggleDropdown("caidat")}
              closeDropdown={closeDropdown}
            />
            <Link
              to="/about-us"
              className="text-white hover:text-gray-600 focus:outline-none transition-colors duration-300 pl-5 flex flex-col items-center"
            >
              <FontAwesomeIcon icon={faCircleInfo} />
              VỀ CHÚNG TÔI
            </Link>
          </>
        ) : (
          <Link
            to="/auth/login"
            className="text-white hover:text-gray-600 focus:outline-none transition-colors duration-300 pl-5"
          >
            Đăng nhập để truy cập các chức năng
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
