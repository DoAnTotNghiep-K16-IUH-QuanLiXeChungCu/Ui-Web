import React, { useEffect, useState } from "react";
import VehicleModal from "./VehicleModal";
import Notification from "../components/Notification";
import { deleteUser, getAllUser, updateUser } from "./../useAPI/useUserAPI";
import Loading from "../components/Loading";
import { calculateAge } from "../utils";
import { SIGNUP } from "../config/API";
import AccountModal from "./AccountModal";
import AccountRoleModal from "./AccountRoleModal";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState({
    username: "",
    password: "",
    birthDay: "",
    address: "",
    phoneNumber: "",
    email: "",
    fullname: "",
  });

  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterdAccounts, setFilterdAccounts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  const fetchData = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const accounts = await getAllUser();
      setAccounts(accounts);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Dừng loading khi dữ liệu đã được fetch
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleRowClick = (ticket) => {
    if (selectedAccount && selectedAccount._id === ticket._id) {
      setSelectedAccount(null);
    } else {
      setSelectedAccount(ticket);
    }
  };
  const handleDeleteAccount = async (account) => {
    const deleteAcc = await deleteUser(account._id);
    if (deleteAcc) {
      setShowNotification({
        content: `Đã xóa tài khoản của nhân viên ${account.fullname} có tên đăng nhập là ${account.username}!`,
        type: "Notification",
        show: true,
      });
      fetchData();
    } else {
      setShowNotification({
        content: `Đã có lỗi trong quá trình xóa tài khoản của nhân viên ${account.fullname} có tên đăng nhập là ${account.username}!`,
        type: "Error",
        show: true,
      });
    }
  };
  const handleEditClick = async (account) => {
    try {
      // Tạo dữ liệu mới cho tài khoản
      const newAccount = { ...account, isDelete: !account.isDelete };
      console.log("newAccount", newAccount);

      // Gọi API cập nhật
      const update = await updateUser(newAccount);
      console.log("update", update);

      if (update) {
        // Hiển thị thông báo thành công
        setShowNotification({
          content: `Đã ${
            newAccount.isDelete ? "tạm dừng hoạt động" : "kích hoạt"
          } đối với tài khoản của nhân viên ${
            account.fullname
          } có tên đăng nhập là ${account.username}!`,
          type: "Notification",
          show: true,
        });
        // Tải lại dữ liệu
        const accounts = await getAllUser();
        setAccounts(accounts);
      } else {
        // Hiển thị thông báo lỗi
        setShowNotification({
          content: `Đã có lỗi trong quá trình ${
            newAccount.isDelete ? "tạm dừng hoạt động" : "kích hoạt"
          } tài khoản của nhân viên ${account.fullname} có tên đăng nhập là ${
            account.username
          }!`,
          type: "Error",
          show: true,
        });
      }
    } catch (error) {
      console.error("Error updating account:", error);
      setShowNotification({
        content: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau!",
        type: "Error",
        show: true,
      });
    }
  };

  const handleGrantRole = async () => {
    try {
      // Tạo dữ liệu mới cho tài khoản
      const update = await updateUser(selectedUser);
      console.log("update", update);
      if (update) {
        setOpenRoleModal(false);
        setShowNotification({
          content: `Đã gán quyền ${
            selectedUser.role === "User"
              ? "Nhân viên"
              : selectedUser.role === "Admin"
              ? "Admin"
              : "Quản lý"
          } cho nhân viên ${selectedUser.fullname}`,
          type: "Notification",
          show: true,
        });
        fetchData();
      } else {
        // Hiển thị thông báo lỗi
        setOpenRoleModal(false);
        setShowNotification({
          content: `Đã có lỗi trong quá trình gán quyền ${
            selectedUser.role === "User"
              ? "Nhân viên"
              : selectedUser.role === "Admin"
              ? "Admin"
              : "Quản lý"
          } cho nhân viên ${selectedUser.fullname}`,
          type: "Error",
          show: true,
        });
      }
    } catch (error) {
      console.error("Error updating account:", error);
      setOpenRoleModal(false);
      setShowNotification({
        content: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau!",
        type: "Error",
        show: true,
      });
    }
  };
  const handleSubmit = async () => {
    console.log("newAccount", newAccount);
    const dataAccount = { ...newAccount, password: "123" };
    console.log("dataAccount", dataAccount);

    if (
      dataAccount.phoneNumber.length < 10 ||
      dataAccount.phoneNumber.length > 11
    ) {
      setShowNotification({
        content: "Số điện thoại phải từ 10 đến 11 số",
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
          body: JSON.stringify(dataAccount),
        });
        const data = await response.json();
        if (response.ok) {
          setNewAccount("");
          setOpenModal(false);
          fetchData();
          setShowNotification({
            content: "Tài khoản đã được đăng kí thành công",
            type: "Notification",
            show: true,
          });
        } else {
          setOpenModal(false);
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
  };
  const applyPaginationAndFilter = () => {
    let filtered = accounts.filter((account) => {
      const matchesStatus =
        statusFilter === "" ||
        (statusFilter === "true" && account.isDelete === false) ||
        (statusFilter === "false" && account.isDelete === true);
      return matchesStatus;
    });
    filtered = filtered.filter(
      (account) =>
        (account.fullname &&
          account.fullname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (account.address &&
          account.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (account.phoneNumber &&
          account.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilterdAccounts(filtered);
  };
  useEffect(() => {
    applyPaginationAndFilter();
  }, [accounts, statusFilter, searchTerm]);
  if (loading) {
    return <Loading />; // Hiển thị Loading nếu đang tải dữ liệu
  }
  return (
    <div className="min-h-screen bg-gray-100 p-6 ">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">DANH SÁCH TÀI KHOẢN</h1>
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="border p-2 rounded w-[500px] mb-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex justify-between">
          <div className="flex space-x-4 mb-4 ">
            <label className="p-2 mr-2 ">Trạng thái:</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
              }}
              className="border p-2 rounded"
            >
              <option value="">Tất cả</option>
              <option value="true">Còn hoạt động</option>
              <option value="false">Đã xóa</option>
            </select>
          </div>
          <div className="flex flex-row">
            <div className="flex justify-end items-center mb-4">
              <div className="flex space-x-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setOpenModal(true);
                  }}
                >
                  THÊM
                </button>
              </div>
            </div>
            <div className="flex justify-end items-center mb-4 ml-4">
              <div className="flex space-x-2">
                <button
                  className="bg-lime-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setOpenRoleModal(true);
                  }}
                >
                  GÁN QUYỀN
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-7">
          {/* Vehicle Table */}
          <div className="rounded bg-gray-100 border p-4 col-span-7">
            <div className="overflow-x-auto rounded bg-gray-100 border p-4">
              <table className="min-w-full bg-white border rounded">
                <thead>
                  <tr className="bg-slate-300">
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      #
                    </th>
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      Tên
                    </th>
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      Chức vụ
                    </th>
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      Tuổi
                    </th>
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      Địa chỉ
                    </th>
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      Số điện thoại
                    </th>
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      Email
                    </th>
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      Trạng thái
                    </th>
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      Hành Động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filterdAccounts.map((account, index) => (
                    <tr
                      key={account._id}
                      className={`text-center cursor-pointer ${
                        selectedAccount && selectedAccount._id === account._id
                          ? "bg-gray-200"
                          : ""
                      }`}
                      onClick={() => handleRowClick(account)}
                    >
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{account?.fullname}</td>
                      <td className="border p-2">
                        {account?.role === "User"
                          ? "Nhân viên"
                          : account?.role === "Manager"
                          ? "Quản lý"
                          : "Admin"}
                      </td>
                      <td className="border p-2">
                        {calculateAge(account.birthDay)}
                      </td>
                      <td className="border p-2">{account.address}</td>
                      <td className="border p-2">{account.phoneNumber}</td>
                      <td className="border p-2">{account.email}</td>
                      <td className="border p-2">
                        {account.isDelete === false
                          ? "Còn hoạt động"
                          : "Ngừng hoạt động"}
                      </td>
                      <td className="border p-2 flex justify-center items-center">
                        <button
                          className={`${
                            account.isDelete === false
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          } text-white px-2 py-1 rounded mr-2`}
                          onClick={() => handleEditClick(account)}
                        >
                          {account.isDelete === false
                            ? "Tạm dừng"
                            : "Kích hoạt"}
                        </button>
                        {/* Nút Xóa */}
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => handleDeleteAccount(account)}
                        >
                          Xóa Vĩnh viễn
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
      <AccountModal
        openModal={openModal}
        newAccount={newAccount}
        setNewAccount={setNewAccount}
        handleSubmit={handleSubmit}
        setOpenModal={setOpenModal}
      />
      <AccountRoleModal
        openModal={openRoleModal}
        handleGrantRole={handleGrantRole}
        setOpenModal={setOpenRoleModal}
        accounts={accounts}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
    </div>
  );
};

export default Accounts;
