import React from "react";
import logo from "../../assets/logo.png";
const Footer = () => {
  return (
    <footer className="bg-gray-700 text-white py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-5">
        {/* Về Chúng Tôi */}
        <div>
          <h4 className="font-bold mb-4">VỀ CHÚNG TÔI</h4>
          <div className="mb-2">
            <img src={logo} alt="DKparking" className="w-32" />
          </div>
          <p className="text-sm">
            CÔNG TY TNHH BÃI XE THÔNG MINH DKPARKING
            <br />
            Địa chỉ: 12 Nguyễn Văn Bảo, phường 4, quận Gò Vấp, Thành Phố Hồ Chí
            Minh
            <br />
            Email:{" "}
            <a
              href="mailto:kinhdoanh@DKparking.com"
              className="text-orange-500"
            >
              kinhdoanh@DKparking.com
            </a>
          </p>
        </div>

        {/* Thông Tin Thanh Toán */}
        <div>
          <h4 className="font-bold mb-4">THÔNG TIN THANH TOÁN</h4>
          <p className="text-sm">
            CÔNG TY TNHH BÃI XE THÔNG MINH DKPARKING
            <br />
            Tài khoản: 0123456799
            <br />
            Vietcombank Chi Nhánh Đông Sài Gòn
          </p>
          <div className="mt-4">
            <h5 className="font-bold mb-2">MUA HÀNG</h5>
            <ul>
              <li>0977 333 222 (Mr. Nam)</li>
              <li>0988 222 111 (Mr. Nhật)</li>
            </ul>
            <h5 className="font-bold mt-4 mb-2">HỖ TRỢ KỸ THUẬT</h5>
            <ul>
              <li>0999 666 777 (Mr. Hùng)</li>
              <li>0966 555 111 (Mr. Kiệt)</li>
              <li>0955 777 666 (Mr. Hùng)</li>
            </ul>
          </div>
        </div>

        {/* Liên Kết */}
        <div>
          <h4 className="font-bold mb-4">LIÊN KẾT</h4>
          <ul className="text-sm">
            <li>Máy Giữ Xe Thông Minh</li>
            <li>Thiết Bị Cho Máy Giữ Xe</li>
            <li>Phần Mềm Barrier Tự Động</li>
            <li>Phụ Kiện Barrier</li>
            <li>Dịch Vụ Nhận Dạng Biển Số</li>
          </ul>
          <div className="flex items-center space-x-2 mt-4">
            <a href="#FB" className="text-gray-400 hover:text-white">
              Facebook
            </a>
            <a href="#YTB" className="text-gray-400 hover:text-white">
              YouTube
            </a>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-5 mt-8 border-t border-gray-700 pt-4 text-center text-sm">
        © Copyright 2018 Design by DKparking
      </div>
    </footer>
  );
};

export default Footer;
