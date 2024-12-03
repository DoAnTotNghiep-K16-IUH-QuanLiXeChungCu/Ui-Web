import React from "react";

const ConfirmationModal = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  onConfirmAdd,
  type,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl w-96">
        <header className="bg-gradient-to-r from-blue-500 to-sky-500 text-white text-lg font-semibold p-4 rounded-t-lg">
          Xác nhận hành động
        </header>
        <div className="p-6">
          <p className="text-gray-700 text-center text-lg mb-6">{message}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                if (type === "update") {
                  onConfirm();
                } else {
                  onConfirmAdd();
                }
                onCancel();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
