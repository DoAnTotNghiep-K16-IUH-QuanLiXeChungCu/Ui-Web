import React, { memo, useState } from "react";
import Notification from "../../Admin/components/Notification";
import { filterRecord } from "../../useAPI/useRecordAPI";
import { faHandshakeAltSlash } from "@fortawesome/free-solid-svg-icons";

const ParkingHistoryModal = memo(
  ({ setFilHistory, filHistory, setShowModal, showModal, setRecords }) => {
    const [showNotification, setShowNotification] = useState({
      content: "",
      type: "",
      show: false,
    });
    // Hàm xử lý khi giá trị từ các input thay đổi
    const handleDateChange = (e) => {
      const { name, value } = e.target;
      setFilHistory((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      console.log("filHistory____-", filHistory);
    };
    const handleCloseModal = () => {
      setShowModal(false);
      setFilHistory({
        fromDay: "",
        toDay: "",
        pageNumber: 1,
        pageSize: 50000,
      });
    };
    const handleGetMoreData = async () => {
      console.log("filHistory", filHistory);

      // So sánh thời gian của từ ngày và đến ngày
      if (
        new Date(filHistory.fromDay).getTime() >
        new Date(filHistory.toDay).getTime()
      ) {
        setShowModal(false);
        setShowNotification({
          content: "Ngày bắt đầu nhỏ hơn ngày kết thúc",
          type: "Error",
          show: true,
        });
        return; // Thêm return để dừng xử lý nếu lỗi
      }

      if (filHistory.fromDay && filHistory.toDay) {
        const newRecords = await filterRecord(
          " ",
          filHistory.fromDay,
          filHistory.toDay,
          " ",
          1,
          50000
        );
        console.log("newRecords", newRecords);
        console.log(typeof newRecords);

        if (newRecords) {
          setRecords(newRecords || []); // Thêm dữ liệu mới vào mảng cũ
          setShowModal(false);
        } else {
          setShowNotification({
            content: "Đã có lỗi trong quá trình lấy dữ liệu",
            type: "Error",
            show: true,
          });
          return;
        }
      }
    };
    if (!showModal) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] max-w-sm mx-4">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Lấy dữ liệu
          </h2>
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm mb-2">
                Từ ngày:
              </label>
              <input
                type="date"
                name="fromDay"
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filHistory?.fromDay || ""}
                onChange={handleDateChange}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm mb-2">
                Đến ngày:
              </label>
              <input
                type="date"
                name="toDay"
                className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filHistory?.toDay || ""}
                onChange={handleDateChange}
                required
              />
            </div>

            <div className="flex justify-between gap-4">
              <button
                type="button"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-300 hover:bg-blue-700"
                onClick={handleGetMoreData}
              >
                Thêm
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-6 py-3 rounded-lg transition-colors duration-300 hover:bg-gray-600"
                onClick={handleCloseModal}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
        <Notification
          showNotification={showNotification}
          setShowNotification={setShowNotification}
        />
      </div>
    );
  }
);

export default ParkingHistoryModal;
