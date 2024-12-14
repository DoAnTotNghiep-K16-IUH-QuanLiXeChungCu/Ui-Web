import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Notification from "../components/Notification"; // Bạn có thể thay đổi đường dẫn này nếu cần

const SendOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const location = useLocation();
  const { otpLog } = location.state || { otp: Array(6).fill("") }; // Mặc định là mảng 6 phần tử rỗng

  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });

  // Hàm xử lý thay đổi giá trị OTP
  const handleChange = (value, index) => {
    console.log("value", value);

    // Kiểm tra nếu giá trị nhập vào là một số hợp lệ hoặc là rỗng
    if (/^[0-9]$/.test(value) || value === "") {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      // Tự động focus vào ô tiếp theo nếu giá trị nhập vào
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
    value = "";
  };

  // Hàm xử lý sự kiện khi nhấn phím Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  // Hàm xử lý khi nhấn nút Submit OTP
  const handleSubmit = () => {
    if (otpLog.join("") !== otp.join("")) {
      setShowNotification({
        content: "Mã OTP bạn nhập không khớp với mã đã gửi",
        type: "Error",
        show: true,
      });
    } else {
      setShowNotification({
        content: "Xác thực thành công!",
        type: "Success",
        show: true,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Xác thực OTP
        </h1>
        <p className="text-gray-600 text-center mb-6">Nhập mã OTP vừa nhận</p>
        <div className="flex justify-center space-x-4">
          {otp.map((value, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={value}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-14 h-14 text-xl font-semibold text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="mt-8 w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
        >
          Submit OTP
        </button>
      </div>
      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
    </div>
  );
};

export default SendOTP;
