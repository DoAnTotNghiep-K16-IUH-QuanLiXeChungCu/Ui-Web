import React, { useState } from "react";
import SwipeCard from "../components/SwipeCard";

const AccountModal = ({
  openModal,
  newAccount,
  setNewAccount,
  handleSubmit,
  setOpenModal,
  findCardByUUID, // Thêm `findCardByUUID` vào props
}) => {
  if (!openModal) return null;

  // Hàm xử lý tìm kiếm thẻ theo UUID
  const handleUUIDChange = async (e) => {
    const uuid = e.target.value;
    const check = await findCardByUUID(uuid);
    if (check) {
      setNewAccount((prev) => ({
        ...prev,
        rfidCard: check._id, // Cập nhật trạng thái với id thẻ RFID
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-3xl p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          ĐĂNG KÍ TÀI KHOẢN
        </h2>
        <div className="grid grid-cols-5 rounded border p-2">
          <div className="col-span-3 grid grid-cols-2 mr-3">
            <div className="mb-4 ml-3">
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
                    fullname: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-500"
                placeholder="Nhập họ và tên"
                required
              />
            </div>

            <div className="mb-4 ml-3">
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
                    birthday: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-500"
                placeholder="Nhập tuổi"
                required
              />
            </div>

            <div className="mb-4 ml-3">
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
                    address: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-500"
                placeholder="Nhập địa chỉ"
                required
              />
            </div>

            <div className="mb-4 ml-3">
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
                    phoneNumber: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-500"
                placeholder="Nhập số điện thoại"
                required
              />
            </div>

            <div className="mb-4 ml-3">
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
                    email: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-500"
                placeholder="Nhập email"
                required
              />
            </div>

            <div className="mb-4 ml-3">
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
                    username: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-500"
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>

            <div className="mb-4 ml-3">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="uuid"
              >
                Mã số thẻ
              </label>
              <input
                type="text"
                id="uuid"
                value={newAccount?.rfidCard}
                onChange={handleUUIDChange} // Sử dụng hàm đã khai báo
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-500"
                placeholder="Nhập mã số thẻ"
                required
              />
            </div>
          </div>

          <div className="col-span-2">
            <SwipeCard />
          </div>
        </div>

        <div className="mb-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-indigo-500 text-white font-bold py-2 px-6 mt-4 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-500"
          >
            Đăng kí
          </button>
          <button
            type="button"
            onClick={() => setOpenModal(false)}
            className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg mt-4"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
