import React, { useEffect, useState } from "react";
import {
  addVehicle,
  getAllVehicle,
  updateVehicle,
} from "../useAPI/useVehicleAPI";
import { changeTypeVehicle } from "./../utils/ChangeTypeVehicle";
import { findCustomerByID, getAllCustomer } from "../useAPI/useCustomerAPI";
import { deleteVehicle } from "./../useAPI/useVehicleAPI";
import VehicleModal from "./VehicleModal";
import Notification from "../components/Notification";

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [customers, setCustomers] = useState([]);
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
  const fetchVehicles = async () => {
    try {
      const vehicles = await getAllVehicle();
      setVehicles(vehicles || []);
      const customers = await getAllCustomer();
      setCustomers(customers || []);
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesVehicleType =
      vehicleTypeFilter === "" || vehicle.type === vehicleTypeFilter;
    const matchesSearchTerm =
      (vehicle?.licensePlate || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (vehicle?.brand).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearchTerm && matchesVehicleType;
  });
  const handleAddClick = () => {
    setNewVehicle(null);
    setShowAddForm(true);
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    if (name === "customerId") {
      const customer = await findCustomerByID(value);
      console.log("CUSTOMER>>>>", customer);

      if (customer) {
        setNewVehicle((prev) => ({
          ...prev,
          customerId: customer, // Chỉ lưu ID ở đây
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
    if (vehicle) {
      // Cập nhật newVehicle với ID của customer
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
      if (newVehicle.id) {
        // Cập nhật xe
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
        // Cập nhật selectedVehicle với thông tin mới
      } else {
        // Thêm xe mới
        const addedVehicle = await addVehicle(newVehicle);
        if (addedVehicle) {
          setVehicles((prev) => [...prev, newVehicle]);
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
    setVehicleTypeFilter(e.target.value);
  };
  return (
    <div className="min-h-screen bg-gray-100 p-6 ">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">DANH SÁCH XE</h1>
        </div>
        {/* Search and Action Buttons */}
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
        <div className="flex space-x-4 mb-4 ">
          <label className="p-2 mr-2 ">Loại xe:</label>
          <select
            value={vehicleTypeFilter}
            onChange={handleVehicleTypeChange}
            className="border p-2 rounded"
          >
            <option value="">Tất cả</option>
            <option value="car">Xe hơi</option>
            <option value="motor">Xe máy</option>
          </select>
        </div>
        <div className="grid grid-cols-7">
          {/* Vehicle Table */}
          <div className="overflow-x-auto rounded bg-gray-100 border p-4 col-span-7">
            <div className="h-[400px] overflow-y-scroll">
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
                      Nhãn Hiệu
                    </th>
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      Chủ Xe
                    </th>
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      {" "}
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map((vehicle, index) => (
                    <tr
                      key={vehicle._id}
                      className={`text-center cursor-pointer ${
                        selectedVehicle && selectedVehicle._id === vehicle._id
                          ? "bg-gray-200"
                          : ""
                      }`}
                    >
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{vehicle?.licensePlate}</td>
                      <td className="border p-2">
                        {changeTypeVehicle(vehicle?.type)}
                      </td>
                      <td className="border p-2">{vehicle?.color}</td>
                      <td className="border p-2">{vehicle?.brand}</td>
                      <td className="border p-2">
                        {vehicle.customerId?.fullName || "Không có"}
                      </td>
                      <td className="border p-2">
                        {/* Nút Sửa */}
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
            </div>
          </div>
        </div>
        {/* Popup Modal Thêm Xe */}
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
    </div>
  );
};

export default Vehicle;
