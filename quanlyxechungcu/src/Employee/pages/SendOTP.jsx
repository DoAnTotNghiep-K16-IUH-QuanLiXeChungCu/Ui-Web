import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Notification from "../components/Notification";
import { sendOTP } from "../../useAPI/useUserAPI";
import { useFormStatus } from "react-dom";

const SendOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(30); // Đếm ngược 30s
  const [isResendAllowed, setIsResendAllowed] = useState(false); // Điều kiện để cho phép gửi lại OTP
  const location = useLocation();
  const { otpLog = "", email = "" } = location.state || {};
  console.log("email in OTP", email);

  const [otpHere, setOtpHere] = useState(otpLog);
  const navigate = useNavigate();

  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      return () => clearInterval(timer); // Dọn dẹp khi component bị unmount hoặc countdown thay đổi
    } else {
      setIsResendAllowed(true); // Khi hết đếm ngược thì cho phép gửi lại OTP
    }
  }, [countdown]);

  const handleChange = (value, index) => {
    if (/^[0-9]$/.test(value) || value === "") {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
    value = "";
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = () => {
    if (String(otp.join("")) !== String(otpHere)) {
      setShowNotification({
        content: "Mã OTP bạn nhập không khớp với mã đã gửi",
        type: "Error",
        show: true,
      });
    } else {
      navigate("/auth/resetPassword", {
        state: { email: email },
      });
    }
  };

  const handleResendOTP = async () => {
    if (isResendAllowed) {
      const sentOtp = await sendOTP(email);
      if (!sentOtp) {
        setShowNotification({
          content: "Đã có lỗi trong quá trình gửi mã OTP",
          type: "Error",
          show: true,
        });
        return;
      }
      setOtpHere(sentOtp);
      setCountdown(30); // Reset lại thời gian đếm ngược
      setIsResendAllowed(false); // Tắt nút gửi lại cho đến khi đếm ngược hoàn thành
      // Gửi OTP qua email ở đây (chẳng hạn thông qua API)
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

        <div className="text-center mt-4">
          {countdown > 0 ? (
            <span className="text-sm text-gray-600">
              Mã OTP sẽ hết hạn trong {countdown}s
            </span>
          ) : (
            <button
              onClick={handleResendOTP}
              className="text-blue-500 hover:underline"
            >
              Gửi lại mã OTP
            </button>
          )}
        </div>
      </div>
      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
    </div>
  );
};

export default SendOTP;
