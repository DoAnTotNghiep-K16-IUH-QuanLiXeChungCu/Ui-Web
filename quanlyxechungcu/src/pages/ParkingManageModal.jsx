import React, { useState, useEffect } from "react";
import { changeTypeVehicle } from "../utils/index";
import { getAllAvailabeParkingSlotByType } from "../useAPI/useParkingSlotAPI";
const ParkingManageModal = ({
  showAddForm,
  newTickets,
  vehicles,
  handleInputChange,
  handleSubmit,
  handleCloseModal,
}) => {
  const [slots, setSlots] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedSlotType, setSelectedSlotType] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);

  const fetchData = async (type) => {
    try {
      const slotByType = await getAllAvailabeParkingSlotByType(type);
      setSlots(slotByType);
    } catch (error) {
      console.error("Error fetching parking slots:", error);
    }
  };
  const handleSlotTypeChange = (e) => {
    const type = e.target.value;
    setSelectedSlotType(type);
    fetchData(type); // Gọi hàm fetchData khi thay đổi loại bãi đỗ
  };
  const handleSlotChange = (e) => {
    const slotId = e.target.value;
    const slot = slots.find((s) => s._id === slotId);
    setSelectedSlot(slot);

    // Cập nhật newTickets với slot mới
    handleInputChange({
      target: {
        name: "parking_slotId",
        value: slotId,
      },
    });
  };
  const handleVehicleChange = (e) => {
    const vehicleId = e.target.value;
    const vehicle = vehicles.find((v) => v._id === vehicleId);

    // Cập nhật selectedVehicle
    setSelectedVehicle(vehicle);

    // Cập nhật newTickets với vehicleId
    handleInputChange({
      target: {
        name: "vehicleId",
        value: vehicleId,
      },
    });

    // Gọi fetchData để lấy slot dựa trên loại xe nếu xe tồn tại
    if (vehicle) {
      fetchData(vehicle.type);
    }
  };

  if (!showAddForm) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="mx-auto p-4 bg-white shadow-md rounded">
        <h2 className="text-lg font-semibold mb-4">Đăng ký Vé tháng</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Chọn biển số xe */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block font-medium">Biển số:</label>
              <select
                className="w-full mt-1 p-2 border rounded"
                name="vehicleId"
                value={newTickets?.vehicleId || ""} // Sử dụng newTickets.vehicleId
                onChange={handleVehicleChange} // Thay đổi sự kiện onChange
              >
                <option value="">Chọn xe</option>
                {vehicles?.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.licensePlate}
                  </option>
                ))}
              </select>
            </div>

            {/* Loại xe */}
            <div>
              <label className="block font-medium">Loại xe:</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded bg-gray-300"
                name="vehicleType"
                value={
                  selectedVehicle ? changeTypeVehicle(selectedVehicle.type) : ""
                }
                readOnly
              />
            </div>

            {/* Nhãn hiệu */}
            <div>
              <label className="block font-medium">Nhãn hiệu:</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded bg-gray-300"
                name="vehicleBrand"
                value={selectedVehicle ? selectedVehicle.brand : ""}
                readOnly
              />
            </div>

            {/* Chủ xe */}
            <div>
              <label className="block font-medium">Chủ xe:</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded bg-gray-300"
                name="customer"
                value={selectedVehicle?.customerId?.fullName || ""}
                readOnly
              />
            </div>

            {/* Phòng */}
            <div>
              <label className="block font-medium">Phòng:</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded bg-gray-300"
                value={
                  selectedVehicle?.customerId?.apartmentId?.name ||
                  "Khách bên ngoài"
                }
                readOnly
              />
            </div>

            {/* Địa chỉ */}
            <div>
              <label className="block font-medium">Địa chỉ:</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded bg-gray-300"
                value={selectedVehicle?.customerId?.address || ""}
                readOnly
              />
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block font-medium">Số điện thoại:</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded bg-gray-300"
                value={selectedVehicle?.customerId?.phoneNumber || ""}
                readOnly
              />
            </div>
          </div>

          {/* Parking Slot */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block font-medium">Loại bãi đỗ</label>
              <select
                name="slotType"
                type="text"
                className="border p-2 rounded w-full"
                value={selectedSlotType} // Sử dụng giá trị từ state
                onChange={handleSlotTypeChange} // Gọi hàm khi thay đổi loại bãi đỗ
              >
                <option value="car">Ô tô</option>
                <option value="motor">Xe máy</option>
              </select>
            </div>
            <div>
              <label className="block font-medium">Khu:</label>
              <select
                className="w-full mt-1 p-2 border rounded"
                name="parking_slotId"
                value={newTickets?.parking_slotId || ""}
                onChange={handleSlotChange}
              >
                <option value="">Chọn khu</option>
                {slots.map((slot) => (
                  <option key={slot._id} value={slot._id}>
                    {slot.slotCode}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium">Số lượng:</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded bg-gray-300"
                value={selectedSlot?.totalQuantity || ""} // Cập nhật số lượng dựa trên slot đã chọn
                readOnly
              />
            </div>
            <div>
              <label className="block font-medium">Còn trống:</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded bg-gray-300"
                value={selectedSlot?.availableSlots || ""} // Cập nhật số slot còn trống
                readOnly
              />
            </div>
          </div>
          {/* Other Fields */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block font-medium">Ngày kích hoạt:</label>
              <input
                type="date"
                className="w-full mt-1 p-2 border rounded"
                onChange={handleInputChange}
                name="startDate"
              />
            </div>
            <div>
              <label className="block font-medium">Ngày hết hạn:</label>
              <input
                type="date"
                className="w-full mt-1 p-2 border rounded"
                onChange={handleInputChange}
                name="endDate"
              />
            </div>
            <div>
              <label className="block font-medium">Giá vé:</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                onChange={handleInputChange}
                name="monthlyFee"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Thêm
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              onClick={handleCloseModal}
            >
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParkingManageModal;
