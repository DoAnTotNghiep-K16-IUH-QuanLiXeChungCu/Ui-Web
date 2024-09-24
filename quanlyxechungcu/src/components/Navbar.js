import React, { useState } from "react";
import Dropdown from "./Dropdown";
import { Link } from "react-router-dom";

// Component Dropdown tách riêng

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null); // Trạng thái để quản lý dropdown nào đang mở
  const toggleDropdown = (dropdown) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(null); // Nếu dropdown đang mở, đóng nó lại
    } else {
      setOpenDropdown(dropdown); // Mở dropdown được nhấn
    }
  };

  return (
    <nav className="bg-[#ec7a00] p-4 h-12">
      <div className="container mx-auto flex justify-center items-center space-x-6">
        {/* Sử dụng Dropdown với trạng thái isOpen được quản lý bởi Navbar */}
        <Link
          to="/monthly-ticket"
          className="text-white hover:text-gray-600 focus:outline-none transition-colors duration-300 pl-5"
        >
          Vé tháng
        </Link>
        <Link
          to="/customer"
          className="text-white hover:text-gray-600 focus:outline-none transition-colors duration-300 pl-5"
        >
          Chủ xe
        </Link>
        <Link
          to="/vehicle"
          className="text-white hover:text-gray-600 focus:outline-none transition-colors duration-300 pl-5"
        >
          Danh sách xe
        </Link>
        <Dropdown
          label="Bãi đỗ"
          items={["Kiểm tra", "Lịch sử"]}
          isOpen={openDropdown === "baido"}
          toggleDropdown={() => toggleDropdown("baido")}
        />
        <Dropdown
          label="Cài đặt"
          items={["Kết nối", "Phí xe"]}
          isOpen={openDropdown === "caidat"}
          toggleDropdown={() => toggleDropdown("caidat")}
        />
        <Dropdown
          label="Thống kê"
          items={["Theo tháng"]}
          isOpen={openDropdown === "thongke"}
          toggleDropdown={() => toggleDropdown("thongke")}
        />
        <Link
          to="/about-us"
          className="text-white hover:text-gray-600 focus:outline-none transition-colors duration-300 pl-5"
        >
          Về chúng tôi
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
