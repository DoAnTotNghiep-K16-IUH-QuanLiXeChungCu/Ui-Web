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

  const filteredVehicles =
    vehicles.length > 0
      ? vehicles.filter((vehicle) => {
          const licensePlate = vehicle?.licensePlate || "";
          const brand = vehicle?.brand || "";
          return (
            licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
            brand.toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
      : [];

  const handleRowClick = (vehicle) => {
    if (selectedVehicle && selectedVehicle._id === vehicle._id) {
      setSelectedVehicle(null);
    } else {
      setSelectedVehicle(vehicle);
      setNewVehicle((prev) => ({
        ...prev,
        customerId: vehicle.customerId?._id || "", // Cập nhật ID của khách hàng khi chọn xe
      }));
    }
  };

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

  const handleDeleteVehicle = async (id) => {
    if (!id) {
      console.error("ID của xe không hợp lệ");
      return;
    }

    try {
      await deleteVehicle(id);
      setVehicles((prev) => prev.filter((vehicle) => vehicle._id !== id));
      setSelectedVehicle(null);
      console.log(`Xe với ID ${id} đã được xóa thành công.`);
    } catch (error) {
      console.error("Có lỗi khi xóa xe:", error);
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
        setVehicles((prev) =>
          prev.map((vehicle) =>
            vehicle._id === newVehicle.id ? newVehicle : vehicle
          )
        );
        setSelectedVehicle(updatedVehicle); // Cập nhật selectedVehicle với thông tin mới
      } else {
        // Thêm xe mới
        const addedVehicle = await addVehicle(newVehicle);

        setVehicles((prev) => [...prev, newVehicle]);
        setSelectedVehicle(addedVehicle); // Cập nhật selectedVehicle với addedVehicle
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
    <div className="bg-gray-100 p-6">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
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
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => handleDeleteVehicle(selectedVehicle?._id)}
            >
              XÓA
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded"
              onClick={() => handleEditClick(selectedVehicle)}
              disabled={!selectedVehicle}
            >
              SỬA
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7">
          {/* Vehicle Table */}
          <div className="overflow-x-auto rounded bg-gray-100 border p-4 col-span-5">
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
                      onClick={() => handleRowClick(vehicle)}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedVehicle && (
            <div className="ml-2 bg-gray-200 p-4 rounded col-span-2 h-[200px]">
              <h2 className="text-lg font-semibold">Thông tin xe được chọn:</h2>
              <p>
                <strong>Biển Số:</strong> {selectedVehicle.licensePlate}
              </p>
              <p>
                <strong>Loại xe:</strong>{" "}
                {changeTypeVehicle(selectedVehicle.type)}
              </p>
              <p>
                <strong>Màu:</strong> {selectedVehicle.color}
              </p>
              <p>
                <strong>Nhãn hiệu:</strong> {selectedVehicle.brand}
              </p>
              <p>
                <strong>Chủ xe:</strong>{" "}
                {selectedVehicle.customerId?.fullName || "Không có"}
              </p>
              <p>
                <strong>Số điện thoại:</strong>{" "}
                {selectedVehicle.customerId?.phoneNumber || "Không có"}
              </p>
            </div>
          )}
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
      </div>
    </div>
  );
};

export default Vehicle;
