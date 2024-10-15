import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Thêm import js-cookie
import { LOGIN } from "../config/API";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          password: password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Xử lý nếu đăng nhập thành công
        console.log("Đăng nhập thành công:", data.data);
        Cookies.set("accessToken", data.data.accessToken, {
          expires: 1, // Cookie sẽ hết hạn sau 1 ngày
          secure: true, // Chỉ gửi cookie qua HTTPS
          sameSite: "Strict", // Ngăn chặn CSRF
        });
        Cookies.set("role", data.data.role, {
          expires: 1, // Cookie sẽ hết hạn sau 1 ngày
          secure: true, // Chỉ gửi cookie qua HTTPS
          sameSite: "Strict", // Ngăn chặn CSRF
        });
        Cookies.set("dataUser", JSON.stringify(data.data), {
          expires: 1, // Cookie sẽ hết hạn sau 1 ngày
          secure: true, // Chỉ gửi cookie qua HTTPS
          sameSite: "Strict", // Ngăn chặn CSRF
        });
        navigate("/home");
      } else {
        setError(data.error || "Đăng nhập không thành công");
      }
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
      console.error("Error during login:", err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="userName"
            >
              Tài khoản
            </label>
            <input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute inset-y-0 right-3 flex items-center text-sm leading-5 mt-3"
              style={{ top: "50%", transform: "translateY(-50%)" }} // Căn chỉnh lại vị trí
            >
              {passwordVisible ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-[#ec7a00] text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Đăng nhập
            </button>
          </div>
        </form>

        {/* Forgot Password */}
        <div className="mt-4 text-center">
          <Link
            to="/auth/forgot-password"
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            Đăng kí
          </Link>
        </div>
        <div className="mt-4 text-center">
          <Link
            to="/auth/forgot-password"
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            Quên mật khẩu?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
