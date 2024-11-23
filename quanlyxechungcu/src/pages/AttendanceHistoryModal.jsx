import React, { useState } from "react";
import { getTimeKeepingLogFromDayToDay } from "../useAPI/useTimeKeepingLogAPI";
import Notification from "../components/Notification";

const AttendanceHistoryModal = ({
  openModal,
  setOpenModal,
  setTimeKeepingLogs,
}) => {
  const [days, setDays] = useState({ startDay: "", endDay: "" });
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn hành vi mặc định của form
    try {
      if (days.startDay > days.endDay) {
        setShowNotification({
          content: `Ngày bắt đầu phải nhỏ hơn ngày kết thúc`,
          type: "Error",
          show: true,
        });
        return;
      }

      const data = await getTimeKeepingLogFromDayToDay(
        days.startDay,
        days.endDay
      );
      setTimeKeepingLogs(data); // Cập nhật dữ liệu logs
      setOpenModal(false); // Đóng modal sau khi lấy dữ liệu
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (!openModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[400px]">
        <h2 className="text-lg font-semibold mb-4">Lấy lịch sử ra vào</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-medium">Ngày bắt đầu:</label>
            <input
              type="date"
              className="w-full mt-1 p-2 border rounded"
              onChange={(e) =>
                setDays((prev) => ({ ...prev, startDay: e.target.value }))
              }
              name="startDate"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium">Ngày kết thúc:</label>
            <input
              type="date"
              className="w-full mt-1 p-2 border rounded"
              onChange={(e) =>
                setDays((prev) => ({ ...prev, endDay: e.target.value }))
              }
              name="endDay"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Lấy dữ liệu
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              onClick={() => setOpenModal(false)}
            >
              Đóng
            </button>
          </div>
        </form>
      </div>
      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
    </div>
  );
};

export default AttendanceHistoryModal;
