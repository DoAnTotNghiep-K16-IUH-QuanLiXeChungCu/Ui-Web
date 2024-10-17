import React, { useEffect, useState } from "react";
import CheckEE from "../components/ParkingHistory/CheckEE";
import {
  filterRecord,
  FindExitRecordByEntryRecordID,
} from "../useAPI/useRecordAPI";
import { getALLEntryRecord } from "../useAPI/useRecordAPI";
import { FindCustomerByLicensePlate } from "../useAPI/useVehicleAPI";

const ParkingHistory = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Kích thước trang

  const [outFilter, setOutFilter] = useState("");
  const [fromDateFilter, setFromDateFilter] = useState("");
  const [toDateFilter, setToDateFilter] = useState("");
  const [customerTypeFilter, setCustomerTypeFilter] = useState(""); // State cho loại xe

  const fetchRecord = async (
    isOut,
    fromDay,
    toDay,
    isResident,
    page = currentPage,
    pageSize
  ) => {
    const all = await filterRecord(
      isOut,
      fromDay,
      toDay,
      isResident,
      (page = currentPage),
      pageSize
    );
    const allRecord = all?.records;
    console.log("fetchMonthlyTicket__", allRecord);
    setTotalPages(all.totalPages);
    setPageSize(all.pageSize);
    setRecords(allRecord);
  };
  const fetchData = async () => {
    try {
      const all = await filterRecord(" ", " ", " ", " ", 1, 10);
      const allRecord = all?.records;
      setTotalPages(all.totalPages);
      setPageSize(all.pageSize);
      setRecords(allRecord);
    } catch (error) {}
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleRowClick = (record) => {
    setSelectedRecord(record);
  };
  const handleFilter = () => {
    fetchRecord(
      outFilter,
      fromDateFilter,
      toDateFilter,
      customerTypeFilter,
      1,
      10
    );
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      fetchRecord(
        outFilter,
        fromDateFilter,
        toDateFilter,
        customerTypeFilter,
        currentPage + 1,
        10
      );
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchRecord(
        outFilter,
        fromDateFilter,
        toDateFilter,
        customerTypeFilter,
        currentPage - 1,
        10
      );
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto bg-white shadow-md rounded p-4">
        <h1 className="text-lg font-semibold mb-4">
          Tra cứu thông tin xe vé, ra
        </h1>
        <div className="flex space-x-4 mb-4 ">
          <label className="mr-2 p-2">Tình trạng:</label>
          <select
            className="border p-2 rounded"
            value={outFilter}
            onChange={(e) => setOutFilter(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="false">Trong bãi</option>
            <option value="true">Đã ra</option>
          </select>
          <label className="p-2 mr-2 ">Từ ngày:</label>
          <input
            type="date"
            value={fromDateFilter}
            onChange={(e) => setFromDateFilter(e.target.value)}
            className="border p-2 rounded"
          />
          <label className="mr-2 p-2">Đến ngày:</label>
          <input
            type="date"
            value={toDateFilter}
            onChange={(e) => setToDateFilter(e.target.value)}
            className="border p-2 rounded"
          />

          <label className="p-2 mr-2 ">Loại khách:</label>
          <select
            className="border p-2 rounded"
            value={customerTypeFilter}
            onChange={(e) => setCustomerTypeFilter(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="false">Trong khu dân cư</option>
            <option value="true">Vãn lai</option>
          </select>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => handleFilter()}
          >
            LỌC
          </button>
        </div>
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3 ">
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="flex justify-between items-center mb-4"></div>
            </div>

            {/* Nơi đổ data vào */}
            <div className="overflow-x-auto rounded bg-gray-100 border p-4">
              <table className="min-w-full bg-white border rounded">
                <thead>
                  <tr className="bg-slate-300">
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      #
                    </th>
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      Số thẻ
                    </th>
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      Biển số
                    </th>
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      Phân loại
                    </th>
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      Chủ xe
                    </th>
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      Người trực
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records?.map((record, index) => (
                    <tr
                      key={record._id}
                      className={`text-center cursor-pointer ${
                        selectedRecord && selectedRecord._id === record._id
                          ? "bg-gray-200"
                          : ""
                      }`}
                      onClick={() => handleRowClick(record)}
                    >
                      <td className="border p-2">
                        {index + 1 + (currentPage - 1) * pageSize}
                      </td>
                      <td className="border p-2">
                        {record?.entryRecord?.rfid &&
                        record?.entryRecord?.rfid?.uuid
                          ? record.entryRecord.rfid.uuid
                          : record.entryRecord.rfid}
                      </td>

                      <td className="border p-2">
                        {record.entryRecord.licensePlate}
                      </td>
                      <td className="border p-2">
                        {record.entryRecord.customer.isResident === true
                          ? "Trong khu dân cư"
                          : "Vãn lai"}
                      </td>
                      <td className="border p-2">
                        {record.entryRecord?.customer &&
                        record.entryRecord?.customer?.fullName
                          ? record.entryRecord.customer.fullName // Trả về tên khách hàng nếu tồn tại
                          : "Không có"}
                      </td>
                      <td className="border p-2">
                        {record.entryRecord?.users_shift.fullName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center items-center mt-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Trước
                </button>
                <span className="mx-5">
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

          {/* Image Section */}
          <div className="col-span-2 bg-white border p-4 rounded">
            <div className="flex space-x-4 p-2 border border-gray-900">
              <p>
                Ô Tô: <span className={`font-bold text-red-500`}>18</span>
              </p>
              <p>
                Xe Máy: <span className={`font-bold text-red-500`}>18</span>
              </p>
              {/* <p>
                Xe đạp điện:{" "}
                <span className={`font-bold text-red-500`}>18</span>
              </p>
              <p>
                Nhà hầm: <span className={`font-bold text-red-500`}>18</span>
              </p> */}
            </div>

            <CheckEE
              type="entry"
              time={selectedRecord?.entryRecord?.entryTime || ""} // Kiểm tra nếu selectedRecord tồn tại
              front_pic={selectedRecord?.entryRecord?.picture_front} // Sử dụng toán tử optional chaining
              back_pic={selectedRecord?.entryRecord?.picture_back} // Sử dụng toán tử optional chaining
            />

            <CheckEE
              type="exit"
              time={selectedRecord?.exitRecord?.exitTime || ""} // Kiểm tra nếu selectedRecord tồn tại
              front_pic={selectedRecord?.exitRecord?.picture_front} // Sử dụng toán tử optional chaining
              back_pic={selectedRecord?.exitRecord?.picture_back} // Sử dụng toán tử optional chaining
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingHistory;
