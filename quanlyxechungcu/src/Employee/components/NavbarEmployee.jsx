import React, { useState, useEffect, useCallback } from "react";
import Dropdown from "./Dropdown";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIdCard,
  faCircleInfo,
  faCheckToSlot,
} from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";

const NavbarEmployee = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const myUserID = Cookies.get("profileID");

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

  return (
    <nav className="bg-[#ec7a00] p-4 h-16">
      <div className="container mx-auto flex justify-center items-center space-x-6">
        {myUserID ? (
          <>
            <Link
              to="about-us"
              className="text-white hover:text-gray-600 focus:outline-none transition-colors duration-300 pl-5 flex flex-col items-center"
            >
              <FontAwesomeIcon icon={faCircleInfo} />
              VỀ CHÚNG TÔI
            </Link>
            <Link
              to="/parking-check"
              className="text-white hover:text-gray-600 focus:outline-none transition-colors duration-300 pl-5 flex flex-col items-center"
            >
              <FontAwesomeIcon icon={faCheckToSlot} />
              QUẸT XE
            </Link>
            <Dropdown
              label="BÃI ĐỖ"
              items={["LỊCH SỬ", "DANH SÁCH BÃI ĐỖ"]}
              isOpen={openDropdown === "baido"}
              toggleDropdown={() => toggleDropdown("baido")}
              closeDropdown={closeDropdown}
            />
            <Link
              to="/monthly-ticket"
              className="text-white hover:text-gray-600 focus:outline-none transition-colors duration-300 pl-5 flex flex-col items-center"
            >
              <FontAwesomeIcon icon={faIdCard} />
              <span>VÉ THÁNG</span>
            </Link>
            <Dropdown
              label="QUẢN LÝ"
              items={["KHÁCH HÀNG", "XE", "PHÒNG"]}
              isOpen={openDropdown === "quanly"}
              toggleDropdown={() => toggleDropdown("quanly")}
              closeDropdown={closeDropdown}
            />
            <Dropdown
              label="CA TRỰC"
              items={["LỊCH LÀM VIỆC", "CHẤM CÔNG"]}
              isOpen={openDropdown === "catruc"}
              toggleDropdown={() => toggleDropdown("catruc")}
              closeDropdown={closeDropdown}
            />
            <Dropdown
              label="CÀI ĐẶT"
              items={["KẾT NỐI"]}
              isOpen={openDropdown === "caidat"}
              toggleDropdown={() => toggleDropdown("caidat")}
              closeDropdown={closeDropdown}
            />
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

export default NavbarEmployee;
