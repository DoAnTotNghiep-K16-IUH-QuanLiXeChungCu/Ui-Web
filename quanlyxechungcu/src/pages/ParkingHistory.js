// src/components/VehicleDashboard.js
import React from "react";
import CheckEE from "../components/ParkingHistory/CheckEE";

const ParkingHistory = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto bg-white shadow-md rounded p-4">
        <h1 className="text-lg font-semibold mb-4">
          Tra cứu thông tin xe vé, ra
        </h1>

        <div className="grid grid-cols-3 gap-4">
          {/* Table */}
          <div className="col-span-1 ">
            <div className="grid grid-cols-4 gap-4 mb-4">
              {/* Danh sách bộ lọc */}
              <div className="col-span-3 grid grid-cols-2">
                <div className="col-span-2">
                  <label className="block font-medium">Truy vấn:</label>
                  <select className="w-full mt-1 p-2 border rounded">
                    <option>Tất cả xe</option>
                    {/* Add more options as needed */}
                  </select>
                </div>
                <div className="p-1">
                  <label className="block font-medium">Loại vé:</label>
                  <select className="w-full mt-1 p-2 border rounded">
                    <option>Tất cả vé</option>
                    {/* Add more options as needed */}
                  </select>
                </div>
                <div className="p-1">
                  <label className="block font-medium">Loại xe:</label>
                  <select className="w-full mt-1 p-2 border rounded">
                    <option>Tất cả xe</option>
                    {/* Add more options as needed */}
                  </select>
                </div>
                <div className="p-1">
                  <label className="block font-medium">Chọn ngày:</label>
                  <input
                    type="datetime-local"
                    className="w-full mt-1 p-2 border rounded"
                  />
                </div>
                <div className="p-1">
                  <label className="block font-medium">đến:</label>
                  <input
                    type="datetime-local"
                    className="w-full mt-1 p-2 border rounded"
                  />
                </div>
                <div className="p-1">
                  <label className="block font-medium">Số thẻ:</label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border rounded"
                    placeholder="Nhập số thẻ"
                  />
                </div>
                <div className="p-1">
                  <label className="block font-medium">Biển số:</label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border rounded"
                    placeholder="Nhập biển số"
                  />
                </div>
                <div className="p-1">
                  <label className="block font-medium">Nhân viên vào:</label>
                  <select className="w-full mt-1 p-2 border rounded">
                    <option>Tất cả nhân viên</option>
                    {/* Add more options as needed */}
                  </select>
                </div>
                <div className="p-1">
                  <label className="block font-medium">Nhân viên ra:</label>
                  <select className="w-full mt-1 p-2 border rounded">
                    <option>Tất cả nhân viên</option>
                    {/* Add more options as needed */}
                  </select>
                </div>
              </div>

              {/* Danh sách các nút */}
              <div className="col-span-1">
                <button className="w-full mt-6 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Tìm kiếm
                </button>
              </div>
            </div>

            {/* Nơi đổ data vào */}
            <div className="overflow-y-scroll rounded bg-gray-100 border p-4 h-96 ">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2">Mã thẻ</th>
                    <th className="border p-2">Số thẻ</th>
                    <th className="border p-2">Biển số</th>
                    <th className="border p-2">Loại vé</th>
                    <th className="border p-2">Chủ xe</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Replace with dynamic data */}
                  <tr className="hover:bg-gray-100 cursor-pointer">
                    <td className="border p-2">SC3Z601</td>
                    <td className="border p-2">0</td>
                    <td className="border p-2">59-GZ 469.87</td>
                    <td className="border p-2">Nhà Thầu</td>
                    <td className="border p-2">Vé lượt</td>
                  </tr>
                  {/* Repeat table rows as needed */}
                </tbody>
              </table>
            </div>
          </div>

          {/* Image Section */}
          <div className="col-span-2 bg-white border p-4 rounded">
            <div className="flex space-x-4 p-2 border border-gray-900">
              <p>
                Ô Tô: <span className={`font-bold text-red-500`}>18</span>
              </p>
              <p>
                Xe Máy: <span className={`font-bold text-red-500`}>18</span>
              </p>
              <p>
                Xe đạp điện:{" "}
                <span className={`font-bold text-red-500`}>18</span>
              </p>
              <p>
                Nhà hầm: <span className={`font-bold text-red-500`}>18</span>
              </p>
            </div>

            <CheckEE type="entry"></CheckEE>
            <CheckEE type="exit"></CheckEE>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingHistory;
