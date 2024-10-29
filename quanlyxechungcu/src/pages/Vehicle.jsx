import React, { useContext, useEffect, useState } from "react";
import {
  addVehicle,
  getAllVehicle,
  getAllVehicleByType,
  updateVehicle,
} from "../useAPI/useVehicleAPI";
import { changeTypeVehicle } from "../utils/index";
import { findCustomerByID, getAllCustomer } from "../useAPI/useCustomerAPI";
import { deleteVehicle } from "../useAPI/useVehicleAPI";
import VehicleModal from "./VehicleModal";
import Notification from "../components/Notification";
import UserContext from "../context/UserContext";
import { getData } from "../context/indexedDB";

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(vehicles.length / pageSize);
  const [searchTerm, setSearchTerm] = useState("");

  const [filteredVehicles, setFilteredVehicles] = useState([]);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    id: "",
    licensePlate: "",
    type: "",
    color: "",
    brand: "",
    customerId: "",
  });
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState(""); // State cho loại xe
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const data = await getData("userData");
        if (data) {
          setCustomers(data.customers);
          setVehicles(data.vehicles);
          // console.log("data.vehicles", data.vehicles);
        } else {
        }
      } catch (err) {
        console.error("Failed to get Customers data:", err);
      }
    };
    fetchVehicleData(); // Gọi hàm để lấy dữ liệu
  }, []);
  const handleAddClick = () => {
    setNewVehicle(null);
    setShowAddForm(true);
  };
  const handleRowClick = (ticket) => {
    if (selectedVehicle && selectedVehicle._id === ticket._id) {
      setSelectedVehicle(null);
    } else {
      setSelectedVehicle(ticket);
    }
  };
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    if (name === "customerId") {
      // Cập nhật customerId trực tiếp
      const customer = await findCustomerByID(value);
      if (customer) {
        setNewVehicle((prev) => ({
          ...prev,
          customerId: {
            _id: customer._id,
            fullName: customer.fullName,
            phoneNumber: customer.phoneNumber,
          }, // Lưu đối tượng khách hàng
        }));
      } else {
        setNewVehicle((prev) => ({
          ...prev,
          customerId: { _id: "", fullName: "", phoneNumber: "" }, // Không có khách hàng
        }));
      }
    } else {
      setNewVehicle((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDeleteVehicle = async (veh) => {
    if (!veh._id) {
      console.error("ID của xe không hợp lệ");
      return;
    }
    try {
      await deleteVehicle(veh._id);
      setVehicles((prev) => prev.filter((vehicle) => vehicle._id !== veh._id));
      setSelectedVehicle(null);
      setShowNotification({
        content: `Xe có biển số ${veh.licensePlate} đã bị xóa khỏi danh sách.`,
        type: "Notification",
        show: true,
      });
    } catch (error) {
      setShowNotification({
        content: `Đã có lỗi khi xóa xe có biển số ${veh.licensePlate} ra khỏi danh sách.`,
        type: "Error",
        show: true,
      });
    }
  };

  const handleEditClick = (vehicle) => {
    console.log("Sửa xe:", vehicle); // Thêm dòng này để kiểm tra
    if (vehicle) {
      setNewVehicle({
        ...vehicle,
        customerId: vehicle.customerId?._id || "", // Đảm bảo có ID của customer
      });
      setShowAddForm(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (newVehicle._id) {
        // Cập nhật xe
        // console.log("HEHE___-", newVehicle);

        const updatedVehicle = await updateVehicle(newVehicle);
        if (updatedVehicle) {
          setVehicles((prev) =>
            prev.map((vehicle) =>
              vehicle._id === newVehicle.id ? newVehicle : vehicle
            )
          );
          setSelectedVehicle(updatedVehicle);
          setShowNotification({
            content: `Xe có biển số ${newVehicle.licensePlate} đã được cập nhật`,
            type: "Notification",
            show: true,
          });
        } else {
          setShowNotification({
            content: updatedVehicle,
            type: "Error",
            show: true,
          });
        }
      } else {
        // Thêm xe mới
        const addedVehicle = await addVehicle(newVehicle);
        if (addedVehicle) {
          setVehicles((prev) => [...prev, addedVehicle]);
          setSelectedVehicle(addedVehicle);
          setShowNotification({
            content: `Xe có biển số ${newVehicle.licensePlate} đã được thêm vào danh sách`,
            type: "Notification",
            show: true,
          });
        } else {
          setShowNotification({
            content: addedVehicle,
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
  const handleVehicleTypeChange = (e) => {
    const type = e.target.value;
    setVehicleTypeFilter(type);
    // if (type) {
    //   fetchVehiclesByType(type);
    // } else {
    //   fetchVehicles();
    // }
  };
  const applyPaginationAndFilter = () => {
    let filtered = vehicles.filter((vehicle) => {
      const matchesVehicleType =
        vehicleTypeFilter === "" || vehicle.type === vehicleTypeFilter;
      return matchesVehicleType;
    });
    filtered = filtered.filter(
      (vehicle) =>
        (vehicle.licensePlate &&
          vehicle.licensePlate
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (vehicle.brand &&
          vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredVehicles(filtered);
    setCurrentPage(1);
  };
  const currentVehicle = filteredVehicles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  useEffect(() => {
    applyPaginationAndFilter();
  }, [vehicles, vehicleTypeFilter, searchTerm]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 ">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">DANH SÁCH XE</h1>
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="border p-2 rounded w-[500px] mb-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
          <label className="p-2 mr-2 ">Loại xe:</label>
          <select
            value={vehicleTypeFilter}
            onChange={handleVehicleTypeChange}
            className="border p-2 rounded"
          >
            <option value="">Tất cả</option>
            <option value="car">Ô tô</option>
            <option value="motor">Xe máy</option>
          </select>
        </div>
        <div className="grid grid-cols-7">
          {/* Vehicle Table */}
          <div className="rounded bg-gray-100 border p-4 col-span-7">
            <table className="min-w-full bg-white border rounded">
              <thead>
                <tr className="bg-slate-300">
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    #
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Biển Số
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Loại Xe
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Màu
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Hãng
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Khách Hàng
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentVehicle.map((vehicle, index) => (
                  <tr
                    key={vehicle._id}
                    className={`text-center cursor-pointer ${
                      selectedVehicle && selectedVehicle._id === vehicle._id
                        ? "bg-gray-200"
                        : ""
                    }`}
                    onClick={() => handleRowClick(vehicle)}
                  >
                    <td className="border p-2">
                      {index + 1 + (currentPage - 1) * pageSize}
                    </td>
                    <td className="border p-2">{vehicle.licensePlate}</td>
                    <td className="border p-2">
                      {changeTypeVehicle(vehicle.type)}
                    </td>
                    <td className="border p-2">{vehicle.color}</td>
                    <td className="border p-2">{vehicle.brand}</td>
                    <td className="border p-2">
                      {vehicle.customerId?.fullName}
                    </td>
                    <td className="border p-2 flex justify-center items-center">
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                        onClick={() => handleEditClick(vehicle)}
                      >
                        Sửa
                      </button>
                      {/* Nút Xóa */}
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleDeleteVehicle(vehicle)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Phân trang */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Trước
              </button>
              <span>
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
      </div>
      <VehicleModal
        showAddForm={showAddForm}
        newVehicle={newVehicle}
        customers={customers}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        handleCloseModal={handleCloseModal}
      />
      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
    </div>
  );
};

export default Vehicle;
