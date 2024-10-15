import React, { useEffect, useState } from "react";
import Notification from "../components/Notification";

const UserShift = () => {
  // Trạng thái cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // fetchVehicles(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // fetchVehicles(currentPage - 1);
    }
  };
  const handleAddClick = () => {};
  return (
    <div className="min-h-screen bg-gray-100 p-6 ">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">DANH SÁCH CA TRỰC</h1>
        </div>
        {/* Search and Action Buttons */}
        <div className="flex justify-end items-center mb-4">
          <div className="flex space-x-2 mx-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded "
              onClick={handleAddClick}
            >
              PHÂN CA
            </button>
          </div>
          <div className="flex space-x-2 mx-2">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded "
              onClick={handleAddClick}
            >
              XÓA
            </button>
          </div>
          <div className="flex space-x-2 mx-2">
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded "
              onClick={handleAddClick}
            >
              SỬA
            </button>
          </div>
        </div>
        <div className="flex space-x-4 mb-4 ">
          <label className="p-2 mr-2 ">Từ ngày:</label>
          <input type="date"></input>

          <label className="p-2 mr-2 ">Đến ngày:</label>
          <input type="date"></input>

          <label className="p-2 mr-2 ">Ca:</label>
          <select className="border p-2 rounded">
            <option value="">Tất cả</option>
            <option value="car">Sáng</option>
            <option value="motor">Trưa</option>
            <option value="motor">Tối</option>
          </select>
          <div className="flex space-x-2 mx-2">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded "
              onClick={handleAddClick}
            >
              LỌC
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7">
          {/* Vehicle Table */}
          <div className="rounded bg-gray-100 border p-4 col-span-7">
            <table className="min-w-full bg-white border rounded">
              <thead>
                <tr className="bg-slate-300">
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    #
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Ngày
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Nhân viên
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Ca
                  </th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
            {/* Phân trang */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Trước
              </button>
              <span>
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
    </div>
  );
};

export default UserShift;
