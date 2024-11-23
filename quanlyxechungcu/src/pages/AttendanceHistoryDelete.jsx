import React, { useEffect, useState } from "react";
import Notification from "../components/Notification";
import Loading from "../components/Loading";
import { getAllUser } from "../useAPI/useUserAPI";
import {
  getAllTimeKeepingLogDelete,
  restoreTimeKeepingLog,
  deleteTimeKeepingLog,
  updateTimeKeepingLog,
} from "../useAPI/useTimeKeepingLogAPI"; // Thêm các hàm restore và delete API
import ConfirmationModal from "../components/ConfirmationModal ";

const AttendanceHistoryDelete = ({ openHistory, setOpenHistory, setFlat }) => {
  const [timeKeepingLogs, setTimeKeepingLogs] = useState(null);
  const [users, setUsers] = useState(null);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  // Filter
  const [statusFilter, setStatusFilter] = useState(""); // State cho tình trạng
  const [userFilter, setUserFilter] = useState(""); // State cho loại xe
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);
  const fetchData = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const users = await getAllUser();
      setUsers(users);
      const logs = await getAllTimeKeepingLogDelete();
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
  }, []);

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
  };

  useEffect(() => {
    if (timeKeepingLogs) {
      applyPaginationAndFilter();
    }
  }, [timeKeepingLogs, statusFilter, userFilter]);

  // Hàm xử lý khôi phục log
  const handleRestore = async (logId) => {
    const newLog = {
      id: logId._id,
      rfidId: logId.rfidId._id,
      userID: logId.userID._id,
      scanTime: logId.scanTime,
      status: logId.status,
      isDelete: false,
    };
    const updated = updateTimeKeepingLog(newLog);
    if (updated) {
      fetchData();
      setFlat((prev) => prev + 1);
      setShowNotification({
        content: "Đã khôi phục lại bản ghi thành công!",
        type: "Notification",
        show: true,
      });
    } else {
      setShowNotification({
        content: "Đã có lỗi khi khôi phục lại bản ghi!",
        type: "Error",
        show: true,
      });
    }
  };

  // Hàm xử lý xóa vĩnh viễn log
  const handleDelete = async () => {
    const deleteLog = deleteTimeKeepingLog(logToDelete._id);

    if (deleteLog) {
      fetchData();
      setFlat((prev) => prev + 1);
      setShowNotification({
        content: "Đã xóa vĩnh viễn bản ghi thành công!",
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
  if (!openHistory) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 min-h-screen p-6">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">
            DANH SÁCH LỊCH SỬ QUÉT THẺ ĐÃ BỊ XÓA
          </h1>
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
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr
                    key={log._id}
                    className={`text-center cursor-pointer ${
                      selectedLog && selectedLog._id === log._id
                        ? "bg-gray-200"
                        : ""
                    }`}
                    onClick={() => handleRowClick(log)}
                  >
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{log?.userID?.fullname}</td>
                    <td className="border p-2">{log.scanTime}</td>
                    <td className="border p-2">
                      {log.status === "in" ? "Đi vào" : "Đi ra"}
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Ngừng sự kiện click của row
                          handleRestore(log);
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                      >
                        Khôi phục
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Ngừng sự kiện click của row
                          setLogToDelete(log); // Lưu bản ghi cần xóa vào state
                          setShowModal(true);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Xóa vĩnh viễn
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => setOpenHistory(false)}
          >
            Đóng
          </button>
        </div>
      </div>

      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
      <ConfirmationModal
        isOpen={showModal}
        message="Bạn có chắc chắn muốn xóa bản ghi này không?"
        onConfirm={handleDelete}
        onConfirmAdd={handleDelete}
        onCancel={() => setShowModal(false)} // Đóng modal khi hủy
        type="update"
      />
    </div>
  );
};

export default AttendanceHistoryDelete;
