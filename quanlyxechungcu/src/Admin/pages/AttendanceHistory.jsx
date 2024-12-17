import React, { useEffect, useState } from "react";
import Notification from "../components/Notification";
import Loading from "../components/Loading";
import { getAllUser } from "../../useAPI/useUserAPI";
import { getTimeKeepingLogToday } from "../../useAPI/useTimeKeepingLogAPI";
import AttendanceHistoryModal from "./AttendanceHistoryModal";
import { updateTimeKeepingLog } from "../../useAPI/useTimeKeepingLogAPI";
import AttendanceHistoryDelete from "./AttendanceHistoryDelete";

const AttendanceHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [timeKeepingLogs, setTimeKeepingLogs] = useState(null);
  const totalPages = Math.ceil(timeKeepingLogs?.length / pageSize);
  const [users, setUsers] = useState(null);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  //// Filter
  const [statusFilter, setStatusFilter] = useState(""); // State cho tình trạng
  const [userFilter, setUserFilter] = useState(""); // State cho loại xe
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [flat, setFlat] = useState(1);

  const fetchData = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const users = await getAllUser();
      setUsers(users);
      const logs = await getTimeKeepingLogToday();
      console.log("logs", logs);

      setTimeKeepingLogs(logs);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [flat]);

  const handleRowClick = (log) => {
    if (selectedLog && selectedLog._id === log._id) {
      setSelectedLog(null);
    } else {
      setSelectedLog(log);
    }
  };

  // Lọc và phân trang
  const applyPaginationAndFilter = () => {
    if (!timeKeepingLogs) {
      setFilteredLogs([]); // Nếu timeKeepingLogs là null, đặt filteredLogs là mảng rỗng
      return;
    }

    let filtered = timeKeepingLogs.filter((log) => {
      const matchesStatusFilter =
        statusFilter === "" || log.status === statusFilter;
      const matchesUserFilter =
        userFilter === "" || log.userID?._id === userFilter;
      return matchesStatusFilter && matchesUserFilter;
    });
    setFilteredLogs(filtered);
    setCurrentPage(1); // Reset trang về 1 khi filter
  };

  const currentLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  useEffect(() => {
    if (timeKeepingLogs) {
      applyPaginationAndFilter();
    }
  }, [timeKeepingLogs, statusFilter, userFilter]);

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

  const handleDeleteLog = (logId) => {
    // Xử lý xóa bản ghi
    const newLog = {
      id: logId._id,
      rfidId: logId.rfidId._id,
      userID: logId.userID._id,
      scanTime: logId.scanTime,
      status: logId.status,
      isDelete: true,
    };
    const updated = updateTimeKeepingLog(newLog);
    if (updated) {
      const updatedLogs = timeKeepingLogs.filter(
        (log) => log._id !== logId._id
      );
      setTimeKeepingLogs(updatedLogs);
      setFilteredLogs(filteredLogs.filter((log) => log._id !== logId));
      setShowNotification({
        content: "Đã xóa bản ghi thành công!",
        type: "Notification",
        show: true,
      });
    } else {
      setShowNotification({
        content: "Đã có lỗi khi xóa bản ghi!",
        type: "Error",
        show: true,
      });
    }
  };

  if (loading) {
    return <Loading />; // Hiển thị Loading nếu đang tải dữ liệu
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">LỊCH SỬ QUÉT THẺ</h1>
        </div>
        <div className="flex space-x-4 mb-4 ">
          <label className="mr-2 p-2">Tình trạng:</label>
          <select
            className="border p-2 rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="in">Đi vào</option>
            <option value="out">Đi ra</option>
          </select>
          <label className="p-2 mr-2 ">Nhân viên:</label>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Tất cả</option>
            {users?.map((user) => (
              <option key={user._id} value={user._id}>
                {user.fullname}
              </option>
            ))}
          </select>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => fetchData()}
          >
            Dữ liệu hôm nay
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setOpenModal(true)}
          >
            Nâng cao
          </button>
          <button
            className="bg-slate-500 text-white px-4 py-2 rounded"
            onClick={() => setOpenHistory(true)}
          >
            Dữ liệu đã xóa
          </button>
        </div>
        <div>
          {/* Ticket Table */}
          <div className="overflow-x-auto rounded bg-gray-100 border p-4">
            <table className="min-w-full bg-white border rounded">
              <thead>
                <tr className="bg-slate-300">
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10"></th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Nhân viên
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Thời gian quét
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Tình trạng
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10"></th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log, index) => (
                  <tr
                    key={log._id}
                    className={`text-center cursor-pointer ${
                      selectedLog && selectedLog._id === log._id
                        ? "bg-gray-200"
                        : ""
                    }`}
                    onClick={() => handleRowClick(log)}
                  >
                    <td className="border p-2">
                      {index + 1 + (currentPage - 1) * pageSize}
                    </td>
                    <td className="border p-2">{log?.userID?.fullname}</td>
                    <td className="border p-2">
                      {new Date(log.scanTime).toLocaleString("en-US", {
                        timeZone: "Asia/Ho_Chi_Minh",
                        hour12: false,
                      })}
                    </td>

                    <td className="border p-2">
                      {log.status === "in" ? "Đi vào" : "Đi ra"}
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleDeleteLog(log)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between mt-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Trang trước
              </button>
              <span>{`Trang ${currentPage} / ${totalPages}`}</span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Trang sau
              </button>
            </div>
          </div>
        </div>
      </div>
      <AttendanceHistoryModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        setShowNotification={setShowNotification}
        setTimeKeepingLogs={setTimeKeepingLogs}
      />
      <AttendanceHistoryDelete
        setFlat={setFlat}
        openHistory={openHistory}
        setOpenHistory={setOpenHistory}
      />
      <Notification
        content={showNotification.content}
        type={showNotification.type}
        showNotification={showNotification.show}
        setShowNotification={setShowNotification}
      />
    </div>
  );
};

export default AttendanceHistory;
