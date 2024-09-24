import React from "react";
import { Link } from "react-router-dom";
const RegistrationForm = () => {
  return (
    <div className="mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-lg font-semibold mb-4">Đăng ký Vé tháng</h2>
      <form className="space-y-4">
        {/* Group */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block font-medium">Chủ xe:</label>
            <select className="w-full mt-1 p-2 border rounded">
              <option>Nguyễn Văn A</option>
              <option>Nguyễn Văn B</option>
              <option>Nguyễn Văn C</option>
              <option>Nguyễn Văn E</option>
              <option>Nguyễn Văn F</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Phòng:</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded"
              value="A2.01"
            />
          </div>
          <div>
            <label className="block font-medium">Điện thoại:</label>
            <input type="text" className="w-full mt-1 p-2 border rounded" />
          </div>
          <div className="mt-9">
            <label className="block font-medium"></label>
            <Link
              to={"/customer"}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Danh sách các chủ xe
            </Link>
          </div>

          <div>
            <label className="block font-medium">Biển số:</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded"
              value="51H-83053"
            />
          </div>

          <div>
            <label className="block font-medium">Loại xe:</label>
            <select className="w-full mt-1 p-2 border rounded">
              <option>Xe máy</option>
              <option>Ô tô</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Màu:</label>
            <select
              className="w-full mt-1 p-2 border rounded  bg-gray-300"
              readOnly
            >
              <option>1</option>
              <option>2</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Nhãn hiệu:</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded bg-gray-300"
              readOnly
            />
          </div>
          <div>
            <Link
              to={"/vehicle"}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Danh sách xe
            </Link>
          </div>
        </div>
        {/* Owner */}
        {/* Activation and Expiration Date */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block font-medium">Ngày kích hoạt:</label>
            <input
              type="date"
              className="w-full mt-1 p-2 border rounded"
              defaultValue="2020-12-01"
            />
          </div>
          <div>
            <label className="block font-medium">Ngày hết hạn:</label>
            <input
              type="date"
              className="w-full mt-1 p-2 border rounded"
              defaultValue="2021-07-01"
            />
          </div>
          <div>
            <label className="block font-medium">Vị trí bãi đổ:</label>
            <select className="w-full mt-1 p-2 border rounded">
              <option>A01</option>
              <option>A02</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Giá vé:</label>
            <input
              type="number"
              className="w-full mt-1 p-2 border rounded"
              // value="0"
            />
          </div>
        </div>
        {/* Vehicle Type and Fee */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <label className="block font-medium">Ghi chú:</label>
            <textarea
              className="w-full mt-1 p-2 border rounded"
              // value="TRANG"
              rows="2"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Link
            to={"/monthly-ticket"}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Đồng ý & Đóng
          </Link>
          <Link
            to={"/monthly-ticket"}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Hủy
          </Link>
          <Link
            to={"/monthly-ticket"}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Đóng
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
