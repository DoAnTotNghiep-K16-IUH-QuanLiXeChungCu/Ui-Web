import React, { useState } from "react";
import Notification from "../components/Notification";
const AccountRoleModal = ({
  openModal,
  handleGrantRole,
  setOpenModal,
  accounts,
  selectedUser,
  setSelectedUser,
}) => {
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });

  if (!openModal) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          GÁN QUYỀN CHO TÀI KHOẢN
        </h2>
        <div>
          {/* Nhân viên */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="fullname"
            >
              Nhân viên
            </label>
            <select
              value={selectedUser?._id || ""}
              onChange={(e) => {
                const selectedAccount = accounts.find(
                  (account) => account._id === e.target.value
                );
                console.log("selectedAccount", selectedAccount);
                setSelectedUser(selectedAccount || {});
              }}
              className="border p-2 rounded"
            >
              <option value="">Tất cả</option>
              {accounts?.map((account) => (
                <option key={account._id} value={account._id}>
                  {account.fullname}
                </option>
              ))}
            </select>
          </div>

          {/* Quyền */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="role"
            >
              Quyền
            </label>
            <select
              value={selectedUser?.role || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, role: e.target.value })
              }
              className="border p-2 rounded"
            >
              <option value="">Tất cả</option>
              <option value="User">Nhân Viên</option>
              <option value="Manager">Quản lý</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGrantRole}
              className="w-full bg-lime-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-500"
            >
              Đồng ý
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
      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
    </div>
  );
};

export default AccountRoleModal;
