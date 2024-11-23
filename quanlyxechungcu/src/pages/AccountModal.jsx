import React from "react";
import Notification from "../components/Notification";

const AccountModal = ({
  openModal,
  newAccount,
  setNewAccount,
  handleSubmit,
  setOpenModal,
}) => {
  if (!openModal) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          ĐĂNG KÍ TÀI KHOẢN
        </h2>
        <div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="fullname"
            >
              Họ và tên
            </label>
            <input
              type="text"
              value={newAccount?.fullname}
              onChange={(e) =>
                setNewAccount((prev) => ({
                  ...prev,
                  fullname: e.target.value, // Cập nhật trạng thái
                }))
              }
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
              Ngày sinh
            </label>
            <input
              type="date"
              id="birthDay"
              value={newAccount?.birthday}
              onChange={(e) =>
                setNewAccount((prev) => ({
                  ...prev,
                  birthDay: e.target.value, // Cập nhật trạng thái
                }))
              }
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
              value={newAccount?.address}
              onChange={(e) =>
                setNewAccount((prev) => ({
                  ...prev,
                  address: e.target.value, // Cập nhật trạng thái
                }))
              }
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
              value={newAccount?.phoneNumber}
              onChange={(e) =>
                setNewAccount((prev) => ({
                  ...prev,
                  phoneNumber: e.target.value, // Cập nhật trạng thái
                }))
              }
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
              Email
            </label>
            <input
              type="text"
              id="username"
              value={newAccount?.email}
              onChange={(e) =>
                setNewAccount((prev) => ({
                  ...prev,
                  email: e.target.value, // Cập nhật trạng thái
                }))
              }
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-500"
              placeholder="Nhập tên đăng nhập"
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
              value={newAccount?.username}
              onChange={(e) =>
                setNewAccount((prev) => ({
                  ...prev,
                  username: e.target.value, // Cập nhật trạng thái
                }))
              }
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-500"
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>

          <div className="mb-6">
            <button
              type="button"
              onClick={() => handleSubmit()}
              className="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-500"
            >
              Đăng kí
            </button>
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg mt-4"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
