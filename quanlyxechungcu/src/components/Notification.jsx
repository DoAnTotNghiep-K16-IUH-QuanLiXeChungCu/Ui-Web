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

  const isError = showNotification.type === "Error";
  const title = isError ? "Lỗi" : "Thông báo";
  const bgColor = isError ? "bg-red-600" : "bg-green-600";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col rounded-lg shadow-lg w-3/4 md:w-1/2 lg:w-1/3">
        {/* Title with background color */}
        <div className={`${bgColor} p-4 rounded-t-lg`}>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
        </div>
        {/* Content with white background */}
        <div className="bg-white p-6 rounded-b-lg justify-center">
          <p className="mt-2 text-lg">{showNotification.content}</p>
          <button
            type="button"
            className="mt-4 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition duration-300"
            onClick={() =>
              setShowNotification({ ...showNotification, show: false })
            }
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
