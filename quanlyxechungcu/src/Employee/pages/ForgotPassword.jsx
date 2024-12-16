import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GetUserByEmail, sendOTP } from "../../useAPI/useUserAPI";
import Notification from "../components/Notification";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && emailRegex.test(email)) {
      try {
        const checkEmail = await GetUserByEmail(email);
        if (!checkEmail) {
          setShowNotification({
            content: "Không có tài khoản nào dùng email mà bạn nhập ",
            type: "Error",
            show: true,
          });
          return;
        }
        const sentOtp = await sendOTP(email); // sentOtp là chuỗi
        if (sentOtp) {
          navigate("/auth/sendOTP", {
            state: { otpLog: sentOtp, email: email },
          }); // Truyền chuỗi
        }
      } catch (error) {
        setMessage(
          "An error occurred while sending the OTP. Please try again."
        );
      }
    } else {
      setMessage("Please enter a valid email address.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Quên mật khẩu
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Nhập địa chỉ email để lấy mã OTP
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="email"
            >
              Địa chỉ email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-500"
            >
              Gửi mã OTP
            </button>
          </div>
          {message && (
            <p
              className={`text-sm ${
                email ? "text-green-600" : "text-red-600"
              } text-center`}
            >
              {message}
            </p>
          )}
        </form>
        <div className="text-center mt-4">
          <Link to="/auth/login" className="text-indigo-500 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
    </div>
  );
};

export default ForgotPassword;
