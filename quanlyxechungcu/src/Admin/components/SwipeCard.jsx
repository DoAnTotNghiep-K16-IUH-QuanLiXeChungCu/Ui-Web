import React, { useEffect, useRef, useState } from "react";
import { findCardByUUID, setUpSerialPortEntry } from "../../useAPI/useCardAPI";
import { READ_RFID_CARD_ENTRY } from "../../config/API";
import Notification from "../components/Notification";
import { GetUserByRFIDCard } from "../../useAPI/useUserAPI";
const SwipeCard = () => {
  setUpSerialPortEntry("COM5", 9600);
  const [cardData, setCardData] = useState("");
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  useEffect(() => {
    const eventSource = new EventSource(READ_RFID_CARD_ENTRY);
    eventSource.onmessage = async (event) => {
      try {
        const newRfidData = event.data;
        // Cập nhật cardData mà không làm ảnh hưởng đến render
        setCardData(newRfidData);
        const check = await findCardByUUID(newRfidData);
        const userFinded = await GetUserByRFIDCard(newRfidData);
        console.log("check", check);
        if (!check) {
          setShowNotification({
            content: `Không có thẻ ${newRfidData} nào trong danh sách.`,
            type: "Error",
            show: true,
          });
        } else if (userFinded) {
          setShowNotification({
            content: `Thẻ ${newRfidData} là thẻ dành cho nhân viên`,
            type: "Warning",
            show: true,
          });
        } else {
          setShowNotification({
            content: `Mã số thẻ: ${newRfidData}`,
            type: "Notification",
            show: true,
          });
        }
      } catch (error) {
        console.error("Lỗi khi xử lý dữ liệu từ EventSource:", error);
      }
    };
    return () => {
      eventSource.close(); // Đóng kết nối khi component unmount
    };
  }, []);
  // bg-gradient-to-r from-blue-100 via-white to-blue-100
  return (
    <div className="flex items-center justify-center ">
      <div className="w-full max-w-3xl p-8 bg-white shadow-xl rounded-lg">
        {/* Tiêu đề */}
        {/* Ảnh động */}
        <div className="flex justify-center mb-6">
          <img
            src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWFyeDVpcDZ4eG5kZWc2amhhZ2M1M2N6anFweTYzc21tdXB1M3NxOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xGulxHj3c2rT1yGs34/giphy.gif" // URL ảnh động quẹt thẻ
            alt="Quẹt Thẻ"
            className="w-40 h-40 object-contain"
          />
        </div>
        {/* Hiển thị thông tin */}
        <div className="p-4 bg-blue-50 rounded-lg">
          Mã số thẻ:
          <h2 className="text-lg font-semibold text-blue-600">{cardData}</h2>
        </div>
      </div>
      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
    </div>
  );
};

export default SwipeCard;
