import React, { useEffect, useRef, useState } from "react";
import { findCardByUUID, setUpSerialPortEntry } from "../../useAPI/useCardAPI";
import { READ_RFID_CARD_ENTRY, READ_RFID_CARD_EXIT } from "../../config/API";
import Notification from "../components/Notification";
import { addTimeKeepingLog } from "../../useAPI/useTimeKeepingLogAPI";
import { format } from "date-fns";
import {
  createTimeKeeping,
  updateTimeKeeping,
} from "../../useAPI/useTimeKeepingAPI.js";
import { calculateAge } from "../../utils/index.js";
import { GetUserByRFIDCard } from "../../useAPI/useUserAPI.js";

const CheckingJob = () => {
  setUpSerialPortEntry("COM5", 9600);
  const cardData = useRef("");
  const [card, setCard] = useState(null);
  const [isStart, setIsStart] = useState(false);
  const [type, setType] = useState("in");
  const logDataRef = useRef(null);
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  useEffect(() => {
    const eventSource = new EventSource(READ_RFID_CARD_EXIT);
    eventSource.onmessage = async (event) => {
      if (isStart === false) {
        cardData.current = "";
        // eventSource.close();
        return;
      } else {
        try {
          const newRfidData = event.data;
          // Cập nhật cardData mà không làm ảnh hưởng đến render
          cardData.current = newRfidData;
          // console.log("newRfidData: ", newRfidData);
          const check = await findCardByUUID(cardData.current);
          const userFinded = await GetUserByRFIDCard(cardData.current);
          console.log("userFinded", userFinded);

          if (!check) {
            setShowNotification({
              content: `Không có thẻ ${newRfidData} nào trong danh sách.`,
              type: "Error",
              show: true,
            });
            setCard("");
          } else if (!userFinded) {
            setShowNotification({
              content: `Thẻ có mã ${newRfidData} không phải dành cho nhân viên.`,
              type: "Error",
              show: true,
            });
            setCard("");
          } else {
            const scanTime = new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
              .toISOString()
              .replace("T", " ")
              .slice(0, 19);
            logDataRef.current = {
              rfidId: userFinded.rfidCard._id,
              userID: userFinded._id,
              scanTime: scanTime,
              status: type,
            };

            const cardData = {
              ...userFinded,
              scanTime,
            };
            // console.log("cardData", cardData);
            setCard(cardData);
          }
        } catch (error) {
          console.error("Lỗi khi xử lý dữ liệu từ EventSource:", error);
        }
      }
    };
    return () => {
      eventSource.close(); // Đóng kết nối khi component unmount
    };
  }, [isStart]);
  const handleSubmit = async () => {
    console.log("logData", logDataRef.current);
    const log = await addTimeKeepingLog(logDataRef.current);
    if (log) {
      setShowNotification({
        content: `Đã ghi nhận chấm ${
          type === "in" ? "vào" : "ra"
        } cho nhân viên ${log?.userID?.fullname}.`,

        type: "Notification",
        show: true,
      });
      createOrUpdateTimeKeeping(
        logDataRef.current.userID,
        logDataRef.current.scanTime
      );
      cardData.current = "";
      logDataRef.current = "";
      setCard("");
    } else {
      setShowNotification({
        content: `Đã có lỗi trong quá trình chấm công`,
        type: "Warning",
        show: true,
      });
      // console.log("Mã số thẻ: ", log);
    }
  };
  const createOrUpdateTimeKeeping = async (userID, scanTime) => {
    const workDate = format(scanTime, "yyyy-MM-dd");
    const timeKeeping = {
      userId: userID,
      workDate: workDate,
      checkIn: scanTime,
      checkOut: scanTime,
    };
    if (type === "in") {
      const add = await createTimeKeeping(timeKeeping);
      if (add) {
        console.log("Đã ghi nhận tạo 1 TimeLogging");
      } else {
        console.log("Đã có lỗi khi tạo 1 TimeLogging");
      }
      cardData.current = "";
      logDataRef.current = "";
      return;
    } else if (type === "out") {
      const update = await updateTimeKeeping(timeKeeping);
      if (update) {
        console.log("Đã cập nhật TimeLogging");
      } else {
        console.log("Đã có lỗi khi cạp nhật 1 TimeLogging");
      }
      cardData.current = "";
      logDataRef.current = "";
      return;
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-r from-blue-100 via-white to-blue-100">
      <div className="w-full max-w-3xl p-8 bg-white shadow-xl rounded-lg">
        {/* Tiêu đề */}
        <div>
          <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
            {type === "in" ? "Quẹt thẻ vào" : "Quẹt thẻ ra"}
          </h1>
        </div>

        {/* Ảnh động */}
        <div className="flex justify-center mb-6">
          <img
            src="https://media.giphy.com/media/EopV0wKH3USE9F7fhe/giphy.gif" // URL ảnh động quẹt thẻ
            alt="Quẹt Thẻ"
            className="w-60 h-60 object-contain"
          />
        </div>
        <div className="my-2">
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
            }}
            className="border p-2 rounded mr-2"
          >
            <option value="in">Quẹt vào</option>
            <option value="out">Quẹt ra</option>
          </select>
          <button
            onClick={(e) => setIsStart(!isStart)}
            className="bg-blue-500 text-white px-4 py-2 rounded "
          >
            {!isStart ? "Bắt đầu" : "Dừng"}
          </button>
        </div>
        {/* Hiển thị thông tin */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-600">
            Thông Tin nhân viên
          </h2>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Tên nhân viên:</span>
              <span className="font-semibold text-gray-800">
                {card?.fullname}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Tuổi:</span>
              <span className="font-semibold text-gray-800">
                {calculateAge(card?.birthDay) || ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Thời gian vào:</span>
              <span className="font-semibold text-gray-800">
                {card?.scanTime}
              </span>
            </div>
          </div>
        </div>

        {/* Nút điều hướng */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg shadow hover:bg-green-600 transition-all"
          >
            Xác Nhận
          </button>
          <button className="px-6 py-2 text-sm font-semibold text-white bg-gray-500 rounded-lg shadow hover:bg-gray-600 transition-all">
            Hủy
          </button>
        </div>
      </div>
      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
    </div>
  );
};

export default CheckingJob;
