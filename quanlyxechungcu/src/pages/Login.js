import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    // Xử lý đăng nhập ở đây (gửi dữ liệu lên server hoặc gọi API)
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
            Quên mật khẩu?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
