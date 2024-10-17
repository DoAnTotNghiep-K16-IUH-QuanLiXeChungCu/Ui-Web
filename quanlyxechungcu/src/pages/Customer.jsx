import React, { useEffect, useState } from "react";
import { getAllApartment } from "../useAPI/useApartmentAPI";
import CustomerModal from "./CustomerModal";
import {
  addCustomer,
  deleteCustomer,
  filterCustomer,
  getAllCustomer,
  updateCustomer,
} from "../useAPI/useCustomerAPI";
import Notification from "../components/Notification";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false); // State để hiển thị form thêm xe
  const [newCustomer, setNewCustomer] = useState({
    _id: "",
    apartmentsId: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    isResident: "",
  }); // State lưu trữ thông tin xe mới
  const [apartments, setApartments] = useState([]);
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  // Trạng thái cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [apartmentFilter, setApartmentFilter] = useState("");
  const [customerTypeFilter, setCustomerTypeFilter] = useState("");

  const fetchCustomer = async (
    isResident,
    apartmentName,
    pageNumber,
    pageSize
  ) => {
    const all = await filterCustomer(
      isResident,
      apartmentName,
      pageNumber,
      pageSize
    );
    const allCustomer = all?.customers;
    setTotalPages(all.totalPages);
    setPageSize(all.pageSize);
    setCustomers(allCustomer);
  };

  const fetchData = async () => {
    try {
      const all = await filterCustomer("", "", 1, 10);
      const allCustomer = all?.customers;
      setTotalPages(all.totalPages);
      setPageSize(all.pageSize);
      setCustomers(allCustomer);
      const apartments = await getAllApartment();
      setApartments(apartments || []);
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleAddClick = () => {
    setNewCustomer(null);
    setShowAddForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({
      ...newCustomer,
      [name]: name === "isResident" ? value === "true" : value,
    });
  };

  const handleDeleteCustomer = async (cus) => {
    if (!cus._id) {
      console.error("ID của khách hàng không hợp lệ");
      return;
    }

    try {
      const deleteC = await deleteCustomer(cus._id);
      if (deleteC) {
        setCustomers((prev) =>
          prev.filter((customer) => customer._id !== cus._id)
        );
        setShowNotification({
          content: `Khách hàng ${cus.fullName} đã bị xóa khỏi danh sách.`,
          type: "Notification",
          show: true,
        });
      } else {
        setShowNotification({
          content: deleteC,
          type: "Error",
          show: true,
        });
      }
    } catch (error) {
      setShowNotification({
        content: `Có lỗi khi xóa khách hàng ${cus.fullName} đã bị xóa khỏi danh sách.`,
        type: "Error",
        show: true,
      });
    }
  };

  const handleEditClick = (customer) => {
    if (customer) {
      setNewCustomer(customer);
      setShowAddForm(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("newCustomer___", newCustomer);

    const phoneNumberLength = newCustomer.phoneNumber.length;
    if (phoneNumberLength < 10 || phoneNumberLength > 11) {
      setShowNotification({
        content: "Số điện thoại phải có từ 10 đến 11 số.",
        type: "Error",
        show: true,
      });
      return;
    }
    if (
      (newCustomer.isResident === "true" &&
        (!newCustomer.apartmentsId || newCustomer.apartmentsId === "")) ||
      (newCustomer.isResident === undefined && newCustomer.apartmentsId !== "")
    ) {
      setShowNotification({
        content: "Bạn phải chọn loại khách hàng trước khi chọn phòng",
        type: "Error",
        show: true,
      });
      return; // Ngăn không cho submit form
    }
    if (
      newCustomer.isResident === true &&
      newCustomer.apartmentsId === undefined
    ) {
      setShowNotification({
        content: "Bạn phải chọn phòng cho khách trong khu dân cư",
        type: "Error",
        show: true,
      });
      return; // Ngăn không cho submit form
    }

    try {
      if (newCustomer._id) {
        const updateC = await updateCustomer(newCustomer);
        if (updateC) {
          setCustomers((prev) =>
            prev.map((customer) =>
              customer._id === updateC._id ? updateC : customer
            )
          );
          setShowNotification({
            content: `Thông tin về khách hàng ${updateC.fullName} đã được cập nhật`,
            type: "Notification",
            show: true,
          });
          // fetchData();
        } else {
          setShowNotification({
            content: updateC,
            type: "Error",
            show: true,
          });
        }
      } else {
        const addC = await addCustomer(newCustomer);
        // console.log("Data nè _______", addC);

        if (addC) {
          setShowNotification({
            content: `Đã thêm khách hàng ${addC.fullName} vào danh sách`,
            type: "Notification",
            show: true,
          });
          // fetchData();
          setCustomers((prev) => [...prev, addC]);
          // console.log("CUSTOMER___", customer);
        } else {
          setShowNotification({
            content: addC,
            type: "Error",
            show: true,
          });
        }
      }
    } catch (error) {
      console.error("Có lỗi khi thêm/cập nhật xe:", error);
    }
    setShowAddForm(false);
  };

  const handleCloseModal = () => {
    setShowAddForm(false);
  };
  const handleApartmentChange = (e) => {
    setApartmentFilter(e.target.value);
  };
  const handleCustomerTypeChange = (e) => {
    setCustomerTypeFilter(e.target.value);
  };
  const handleFilter = () => {
    fetchCustomer(customerTypeFilter, apartmentFilter, 1, 10);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      fetchCustomer(customerTypeFilter, apartmentFilter, currentPage + 1, 10);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchCustomer(customerTypeFilter, apartmentFilter, currentPage - 1, 10);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">DANH SÁCH KHÁCH HÀNG</h1>
        </div>

        <div className="flex justify-end items-center mb-4">
          <div className="flex space-x-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleAddClick}
            >
              THÊM
            </button>
          </div>
        </div>
        <div className="flex space-x-4 mb-4 ">
          <label className="mr-2 p-2">Loại khách:</label>
          <select
            className="border p-2 rounded"
            value={customerTypeFilter}
            onChange={handleCustomerTypeChange}
          >
            <option value="">Tất cả</option>
            <option value="true">Trong khu dân cư</option>
            <option value="false">Vãn lai</option>
          </select>
          <label className="mr-2 p-2">Phòng:</label>
          <select
            value={apartmentFilter}
            onChange={handleApartmentChange}
            className="border p-2 rounded"
          >
            <option value="">Tất cả</option>
            {apartments.map((apartment) => (
              <option key={apartment._id} value={apartment.name}>
                {apartment.name}
              </option>
            ))}
          </select>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => handleFilter()}
          >
            LỌC
          </button>
        </div>
        <div className="grid grid-cols-7">
          <div className="overflow-x-auto rounded bg-gray-100 border p-4 col-span-7">
            <table className="min-w-full bg-white border rounded">
              <thead>
                <tr className="bg-slate-300">
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    #
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Họ và tên
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Phòng
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Số điện thoại
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Địa chỉ
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Loại khách
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr key={customer._id} className="text-center">
                    <td className="border p-2">
                      {index + 1 + (currentPage - 1) * pageSize}
                    </td>
                    <td className="border p-2">{customer.fullName}</td>
                    <td className="border p-2">
                      {customer.apartment?.name || ""}
                    </td>
                    <td className="border p-2">{customer.phoneNumber}</td>
                    <td className="border p-2">{customer.address}</td>
                    <td className="border p-2">
                      {customer.isResident === true
                        ? "Trong khu dân cư"
                        : "Khách vãn lai"}
                    </td>
                    <td className="border p-2">
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded mr-1"
                        onClick={() => handleDeleteCustomer(customer)}
                      >
                        XÓA
                      </button>
                      <button
                        className="bg-yellow-500 text-white px-4 py-2 rounded"
                        onClick={() => handleEditClick(customer)}
                      >
                        Sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center items-center mt-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Trước
              </button>
              <span className="mx-5">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Sau
              </button>
            </div>
          </div>
        </div>

        <CustomerModal
          showAddForm={showAddForm}
          newCustomer={newCustomer}
          apartments={apartments}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleCloseModal={handleCloseModal}
        />
        <Notification
          showNotification={showNotification}
          setShowNotification={setShowNotification}
        />
      </div>
    </div>
  );
};

export default Customer;
