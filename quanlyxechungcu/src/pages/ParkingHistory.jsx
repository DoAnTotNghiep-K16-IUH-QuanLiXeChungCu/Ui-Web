import React, { useEffect, useState } from "react";
import CheckEE from "../components/ParkingHistory/CheckEE";
import { getData } from "../context/indexedDB";
const ParkingHistory = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(records.length / pageSize);
  const [searchTerm, setSearchTerm] = useState(""); // Kích thước trang
  const [filteredRecords, setFilteredRecords] = useState([]);

  const [outFilter, setOutFilter] = useState("");
  const [fromDateFilter, setFromDateFilter] = useState("");
  const [toDateFilter, setToDateFilter] = useState("");
  const [customerTypeFilter, setCustomerTypeFilter] = useState(""); // State cho loại xe

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const data = await getData("userData");
        if (data) {
          console.log("data.records", data.records);

          setRecords(data.records);
        } else {
        }
      } catch (err) {
        console.error("Failed to get Tickets data:", err);
      }
    };
    fetchTicketData(); // Gọi hàm để lấy dữ liệu
  }, []);
  const handleRowClick = (record) => {
    setSelectedRecord(record);
  };
  const applyPaginationAndFilter = () => {
    let filtered = records.filter((record) => {
      const matchesOutFilter =
        outFilter === "" || record.entryRecord.isOut === (outFilter === "true");

      const matchesCustomerTypeFilter =
        customerTypeFilter === "" ||
        record.entryRecord.customer.isResident ===
          (customerTypeFilter === "true");

      // Chuyển đổi fromDateFilter và toDateFilter thành đối tượng Date
      const fromDate = fromDateFilter ? new Date(fromDateFilter) : null;
      const toDate = toDateFilter ? new Date(toDateFilter) : null;

      // Chuyển đổi entryTime và exitTime thành đối tượng Date
      const entryTime = new Date(record.entryRecord.entryTime);
      const exitTime = record.exitRecord?.exitTime
        ? new Date(record.exitRecord.exitTime)
        : null;

      const matchesFromDateFilter = !fromDate || entryTime >= fromDate; // Kiểm tra xem entryTime có lớn hơn hoặc bằng fromDate không
      const matchesToDateFilter = !toDate || (exitTime && exitTime <= toDate); // Kiểm tra xem exitTime có nhỏ hơn hoặc bằng toDate không

      return (
        matchesOutFilter &&
        matchesCustomerTypeFilter &&
        matchesFromDateFilter &&
        matchesToDateFilter
      );
    });

    // Tìm kiếm theo từ khóa
    filtered = filtered.filter(
      (record) =>
        record.entryRecord?.customer?.fullName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        record.entryRecord?.users_shift?.fullName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        record.entryRecord?.licensePlate
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    // Cập nhật vé đã lọc và áp dụng phân trang
    setFilteredRecords(filtered);
    setCurrentPage(1); // Reset trang về 1 khi filter
  };
  const currentRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  useEffect(() => {
    applyPaginationAndFilter();
  }, [
    records,
    outFilter,
    fromDateFilter,
    toDateFilter,
    customerTypeFilter,
    searchTerm,
  ]);
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto bg-white shadow-md rounded p-4">
        <h1 className="text-lg font-semibold mb-4">
          Tra cứu thông tin xe vé, ra
        </h1>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="border p-2 rounded w-[500px] mb-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
            onClick={() => applyPaginationAndFilter()}
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
                  {currentRecords?.map((record, index) => (
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
