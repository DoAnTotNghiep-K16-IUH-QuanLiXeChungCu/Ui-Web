import React, { useEffect, useState } from "react";
import { getAllApartment } from "../useAPI/useApartmentAPI";
import CustomerModal from "./CustomerModal";
import {
  addCustomer,
  getAllCustomer,
  updateCustomer,
} from "../useAPI/useCustomerAPI";

const Customer = () => {
  const [customer, setCustomer] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  const fetchcustomer = async () => {
    try {
      const customer = await getAllCustomer();
      setCustomer(customer || []);
      const apartments = await getAllApartment();
      setApartments(apartments || []);
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
    }
  };

  useEffect(() => {
    fetchcustomer();
  }, []);

  const filteredcustomer =
    customer?.length > 0
      ? customer.filter(
          (customer) =>
            (customer.fullName?.toLowerCase() || "").includes(
              searchTerm.toLowerCase()
            ) ||
            (customer.address?.toLowerCase() || "").includes(
              searchTerm.toLowerCase()
            ) ||
            (customer.phoneNumber?.toLowerCase() || "").includes(
              searchTerm.toLowerCase()
            )
        )
      : [];

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

  const handleDeleteCustomer = async (id) => {
    if (!id) {
      console.error("ID của khách hàng không hợp lệ");
      return;
    }

    try {
      // await deleteCustomer(id);
      setCustomer((prev) => prev.filter((customer) => customer._id !== id));
      console.log(`Khách hàng với ID ${id} đã được xóa thành công.`);
    } catch (error) {
      console.error("Có lỗi khi xóa xe:", error);
    }
  };

  const handleEditClick = (customer) => {
    if (customer) {
      setNewCustomer({
        ...customer,
        _id: customer._id,
        apartmentsId: customer.apartmentsId?._id || "", // Đảm bảo bạn đang truyền đúng _id của apartmentsId
      });
      setShowAddForm(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneNumberLength = newCustomer.phoneNumber.length;
    if (phoneNumberLength < 10 || phoneNumberLength > 11) {
      alert("Số điện thoại phải có từ 10 đến 11 số.");
      return;
    }

    try {
      if (newCustomer._id) {
        const updateC = await updateCustomer(newCustomer);
        if (updateC) {
          setCustomer((prev) =>
            prev.map((customer) =>
              customer._id === newCustomer._id ? newCustomer : customer
            )
          );
          console.log(`Khách hàng với ID ${newCustomer._id} đã được cập nhật.`);
        }
      } else {
        const addC = await addCustomer(newCustomer);
        // console.log("Data nè _______", addC);

        if (addC) {
          fetchcustomer();
          // console.log("CUSTOMER___", customer);
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">DANH SÁCH KHÁCH HÀNG</h1>
        </div>

        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="border p-2 rounded w-[500px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex space-x-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleAddClick}
            >
              THÊM
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7">
          <div className="overflow-x-auto rounded bg-gray-100 border p-4 col-span-7">
            <div className="h-[400px] overflow-y-scroll">
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
                  {filteredcustomer.map((customer, index) => (
                    <tr key={customer._id} className="text-center">
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{customer.fullName}</td>
                      <td className="border p-2">
                        {customer.apartmentsId?.name || ""}
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
                          onClick={() => handleDeleteCustomer(customer._id)}
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
      </div>
    </div>
  );
};

export default Customer;
