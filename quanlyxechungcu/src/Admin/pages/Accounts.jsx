import React, { useEffect, useState } from "react";
import Notification from "../components/Notification";
import { deleteUser, getAllUser, updateUser } from "../../useAPI/useUserAPI";
import Loading from "../components/Loading";
import { calculateAge } from "../../utils";
import { SIGNUP } from "../../config/API";
import AccountModal from "./AccountModal";
import AccountRoleModal from "./AccountRoleModal";
import { findCardByUUID } from "../../useAPI/useCardAPI";
import axios from "axios";

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
    rfidCard: "",
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterdAccounts, setFilterdAccounts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
  const confirmDelete = (acccount) => {
    console.log("acccount in delete", acccount);

    if (!acccount) {
      setShowNotification({
        content: "Bạn chưa chọn tài khoản để xóa",
        type: "Error",
        show: true,
      });
    } else {
      setSelectedAccount(acccount); // Lưu ca cần xóa
      setShowConfirmModal(true); // Hiển thị modal
    }
  };
  const handleDeleteAccount = async () => {
    console.log("selectedAccount", selectedAccount);

    const deleteAcc = await deleteUser(selectedAccount._id);
    if (deleteAcc) {
      setShowNotification({
        content: `Đã xóa tài khoản của nhân viên ${selectedAccount.fullname} có tên đăng nhập là ${selectedAccount.username}!`,
        type: "Notification",
        show: true,
      });
      setShowConfirmModal(false);
      setSelectedAccount(null);

      fetchData();
    } else {
      setShowNotification({
        content: `Đã có lỗi trong quá trình xóa tài khoản của nhân viên ${selectedAccount.fullname} có tên đăng nhập là ${selectedAccount.username}!`,
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
            newAccount.isDelete ? "tạm dừng hoạt động" : "kích hoạt trở lại"
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
            newAccount.isDelete ? "tạm dừng hoạt động" : "kích hoạt trở lại"
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

  const handleSubmit = async () => {
    console.log("newAccount", newAccount);

    let formattedBirthDay = null;
    if (newAccount.birthDay) {
      const date = new Date(newAccount.birthDay);
      if (!isNaN(date.getTime())) {
        formattedBirthDay = date.toISOString(); // Chuyển đổi sang định dạng ISO nếu hợp lệ
      } else {
        setShowNotification({
          content: "Ngày sinh không hợp lệ, vui lòng kiểm tra lại",
          type: "Error",
          show: true,
        });
        return; // Dừng xử lý nếu ngày sinh không hợp lệ
      }
    }

    const dataRFID = await findCardByUUID(newAccount.rfidCard);

    const dataAccount = {
      ...newAccount,
      password: "123",
      rfidCard: dataRFID?._id, // Kiểm tra nếu `dataRFID` tồn tại
      birthDay: formattedBirthDay, // Gán giá trị đã định dạng
    };
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
    } else if (
      dataAccount.rfidCard === null ||
      dataAccount.rfidCard === undefined
    ) {
      setShowNotification({
        content: "Thẻ của bạn không có trong hệ thống",
        type: "Error",
        show: true,
      });
    } else {
      try {
        const response = await axios.post(SIGNUP, {
          username: dataAccount.username,
          password: dataAccount.password,
          birthDay: dataAccount.birthDay, // Truyền birthDay đã định dạng
          address: dataAccount.address,
          fullname: dataAccount.fullname,
          phoneNumber: dataAccount.phoneNumber,
          email: dataAccount.email,
          rfidCard: dataAccount.rfidCard,
        });

        const dataNewAccount = response.data.data;
        if (dataNewAccount) {
          setNewAccount("");
          setOpenModal(false);
          fetchData();
          setShowNotification({
            content: "Tài khoản đã được đăng kí thành công",
            type: "Notification",
            show: true,
          });
        } else {
          setShowNotification({
            content: "Đã có lỗi trong quá trình đăng ký",
            type: "Error",
            show: true,
          });
        }
      } catch (error) {
        // Xử lý lỗi
        if (error.response) {
          setOpenModal(false);
          setShowNotification({
            content:
              error.response.data.error || "Đã xảy ra lỗi không xác định",
            type: "Error",
            show: true,
          });
        } else if (error.request) {
          console.error("No response received:", error.request);
          setShowNotification({
            content: "Không thể kết nối tới server",
            type: "Error",
            show: true,
          });
        } else {
          console.error("Error during signup:", error.message);
          setShowNotification({
            content: "Đã xảy ra lỗi trong quá trình đăng ký",
            type: "Error",
            show: true,
          });
        }
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
                      Mã số thẻ
                    </th>
                    {/* <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      Trạng thái
                    </th> */}
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
                      <td className="border p-2">{account?.rfidCard?.uuid}</td>

                      {/* <td className="border p-2">
                        {account.isDelete === false
                          ? "Còn hoạt động"
                          : "Ngừng hoạt động"}
                      </td> */}
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
                          onClick={() => confirmDelete(account)}
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
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl w-96 p-6 relative animate-fade-in">
            {/* Close Icon */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
              onClick={() => setShowConfirmModal(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Header */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Xác nhận xóa
            </h3>

            {/* Content */}
            <p className="text-gray-600 text-center mb-6">
              Bạn có chắc chắn muốn xóa tài khoản của nhân viên{" "}
              <span className="font-bold text-blue-600">
                {selectedAccount?.fullname}
              </span>{" "}
              không?
            </p>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                className="flex-1 px-4 py-2 mr-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition shadow"
                onClick={() => setShowConfirmModal(false)}
              >
                Hủy
              </button>
              <button
                className="flex-1 px-4 py-2 ml-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow"
                onClick={handleDeleteAccount}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
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
    </div>
  );
};

export default Accounts;
