import React from "react";
import { useNavigate } from "react-router-dom";

const NotificationSuccess = ({ message, onClose }) => {
  const navigate = useNavigate();

  const buttonBaseClasses =
    "px-6 py-3 rounded-lg text-white font-medium transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 shadow-lg";

  const containerClasses =
    "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm";

  const cardClasses =
    "bg-white p-6 md:p-8 rounded-lg shadow-2xl max-w-md w-full text-center border-t-4 border-green-500";

  const buttonClasses = {
    primary: `${buttonBaseClasses} bg-blue-600 hover:bg-blue-700 focus:ring-blue-300`,
    secondary: `${buttonBaseClasses} bg-gray-500 hover:bg-gray-600 focus:ring-gray-300`,
  };

  return (
    <div className={containerClasses}>
      <div className={cardClasses}>
        <h3 className="text-2xl md:text-3xl font-bold text-green-600 mb-4">
          ✅ Thành công!
        </h3>
        <p className="text-gray-700 text-base md:text-lg mb-6 leading-relaxed">
          {message}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate("/auth/login")}
            className={buttonClasses.primary}
          >
            Quay về trang đăng nhập
          </button>
          <button onClick={onClose} className={buttonClasses.secondary}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSuccess;
