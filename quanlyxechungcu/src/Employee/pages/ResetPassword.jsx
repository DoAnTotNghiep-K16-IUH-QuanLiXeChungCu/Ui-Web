import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { GetUserByEmail, resetPassword } from "../../useAPI/useUserAPI";
import NotificationSuccess from "../components/NotificationSuccess"; // Import component thông báo thành công
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(true); // Trạng thái để hiển thị mật khẩu
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true);
  const location = useLocation();
  const { email = "" } = location.state || {};
  console.log("email", email);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (!validatePassword(newPassword)) {
      setPasswordError(
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
      );
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    if (newConfirmPassword !== password) {
      setConfirmPasswordError("Mật khẩu không khớp.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordError && !confirmPasswordError) {
      const checkEmail = await GetUserByEmail(email);
      console.log("checkEmail", checkEmail);

      const newAcc = { ...checkEmail, password: password };
      console.log("newAcc", newAcc);

      const resetPass = await resetPassword(newAcc);

      if (!resetPass) {
        setNotificationMessage("Đã có lỗi trong quá trình lấy lại mật khẩu.");
        setShowNotification(true);
        return;
      }

      // Hiển thị thông báo thành công và nút quay về trang đăng nhập
      setNotificationMessage("Mật khẩu đã được đặt lại thành công!");
      setShowNotification(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">
          Đặt lại mật khẩu
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Mật khẩu mới */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  passwordError
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
                placeholder="Nhập mật khẩu mới"
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute inset-y-0 right-3 flex items-center text-sm leading-5 mt-3"
                style={{ top: "50%", transform: "translateY(-50%)" }}
              >
                {passwordVisible ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500 mb-6" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500  mb-6" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  confirmPasswordError
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
                placeholder="Nhập lại mật khẩu"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
                className="absolute inset-y-0 right-3 flex items-center text-sm leading-5 mt-3"
                style={{ top: "50%", transform: "translateY(-50%)" }}
              >
                {confirmPasswordVisible ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500  mb-6" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500  mb-6" />
                )}
              </button>
            </div>
            {confirmPasswordError && (
              <p className="text-red-500 text-sm mt-1">
                {confirmPasswordError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            disabled={passwordError || confirmPasswordError} // Disable button nếu có lỗi
          >
            Đặt lại mật khẩu
          </button>
        </form>
      </div>

      {/* Hiển thị thông báo thành công */}
      {showNotification && (
        <NotificationSuccess
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};

export default ResetPassword;
