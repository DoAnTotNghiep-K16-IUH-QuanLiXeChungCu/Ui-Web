import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SIGNUP } from "../config/API";
import Notification from "../components/Notification";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    age: "",
    address: "",
    phoneNumber: "",
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // State để hiển thị/ẩn mật khẩu
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullname, age, address, phoneNumber, username, password } =
      formData;
    if (fullname && age && address && phoneNumber && username && password) {
      if (
        formData.phoneNumber.length < 10 ||
        formData.phoneNumber.length > 11
      ) {
        setShowNotification({
          content: "Số điện thoại phải từ 10 đến 11 số",
          type: "Error",
          show: true,
        });
      } else {
        const passwordValidation =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordValidation.test(formData.password)) {
          setShowNotification({
            content:
              "Mật khẩu mới phải có ít nhất 1 ký tự thường, 1 ký tự hoa, 1 số, 1 ký tự đặc biệt và chiều dài > 8",
            type: "Error",
            show: true,
          });
        } else {
          try {
            const response = await fetch(SIGNUP, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
              setShowNotification({
                content: "Tài khoản đã được đăng kí thành công",
                type: "Notification",
                show: true,
              });
              navigate("/home");
            } else {
              setShowNotification({
                content: data.error,
                type: "Error",
                show: true,
              });
            }
          } catch (err) {
            console.error("Error during signup:", err);
          }
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          ĐĂNG KÍ TÀI KHOẢN
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="fullname"
            >
              Họ và tên
            </label>
            <input
              type="text"
              id="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-500"
              placeholder="Nhập họ và tên"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="age"
            >
              Tuổi
            </label>
            <input
              type="number"
              id="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-500"
              placeholder="Nhập tuổi"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="address"
            >
              Địa chỉ
            </label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-500"
              placeholder="Nhập địa chỉ"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="phone"
            >
              Số điện thoại
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-500"
              placeholder="Nhập số điện thoại"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="username"
            >
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-500"
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="password"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-500"
                placeholder="Nhập mật khẩu"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-2 text-gray-500"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-500"
            >
              Đăng kí
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <Link to="/auth/login" className="text-indigo-500 hover:underline">
            Quay lại trang đăng nhập
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

export default SignUp;
