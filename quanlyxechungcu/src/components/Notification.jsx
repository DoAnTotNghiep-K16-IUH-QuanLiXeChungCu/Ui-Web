import React, { useEffect } from "react";

const Notification = ({ showNotification, setShowNotification }) => {
  useEffect(() => {
    if (showNotification.show) {
      const timer = setTimeout(() => {
        setShowNotification({ ...showNotification, show: false });
      }, 3000); // Tự động ẩn thông báo sau 3 giây

      return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount
    }
  }, [showNotification, setShowNotification]);

  if (!showNotification.show) return null;

  const title =
    showNotification.type === "Error"
      ? "Lỗi"
      : showNotification.type === "Notification"
      ? "Thông báo"
      : "Cảnh báo";

  const styles = {
    error: {
      bgColor: "bg-red-600",
      icon: "❌",
    },
    notification: {
      bgColor: "bg-green-600",
      icon: "✅",
    },
    warning: {
      bgColor: "bg-yellow-500",
      icon: "⚠️",
    },
  };

  const typeStyles =
    showNotification.type === "Error"
      ? styles.error
      : showNotification.type === "Notification"
      ? styles.notification
      : styles.warning;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div
        className={`relative flex flex-col items-center text-center rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 transition-transform transform ${
          showNotification.show ? "scale-100" : "scale-95"
        }`}
      >
        {/* Header */}
        <div
          className={`${typeStyles.bgColor} w-full py-3 rounded-t-lg flex items-center justify-center`}
        >
          <span className="text-white text-3xl mr-2">{typeStyles.icon}</span>
          <h1 className="text-white text-2xl font-semibold">{title}</h1>
        </div>

        {/* Content */}
        <div className="bg-white w-full px-6 py-4 rounded-b-lg">
          <p className="text-gray-700 text-lg">{showNotification.content}</p>
          <button
            onClick={() =>
              setShowNotification({ ...showNotification, show: false })
            }
            className="mt-4 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-300"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
