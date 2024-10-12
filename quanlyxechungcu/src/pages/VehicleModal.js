import React from "react";

const VehicleModal = ({
  showAddForm,
  newVehicle,
  customers,
  handleInputChange,
  handleSubmit,
  handleCloseModal,
}) => {
  console.log("newVehicle_____", newVehicle);

  if (!showAddForm) return null; // Nếu showAddForm là false, không hiển thị modal

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[400px]">
        <h2 className="text-lg font-semibold mb-4">
          {newVehicle?._id ? "Cập nhật Xe" : "Thêm Xe Mới"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Biển Số:</label>
            <input
              type="text"
              name="licensePlate"
              className={`border p-2 rounded w-full ${
                newVehicle?._id ? "bg-gray-400" : "bg-white"
              }`}
              value={newVehicle?.licensePlate || ""}
              onChange={handleInputChange}
              readOnly={!!newVehicle?._id}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Loại xe:</label>
            <select
              name="type"
              className="border p-2 rounded w-full"
              value={newVehicle?.type}
              onChange={handleInputChange}
            >
              <option value="car">Ô tô</option>
              <option value="motor">Xe máy</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Màu:</label>
            <input
              type="text"
              name="color"
              className="border p-2 rounded w-full"
              value={newVehicle?.color}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Nhãn hiệu:</label>
            <input
              type="text"
              name="brand"
              className="border p-2 rounded w-full"
              value={newVehicle?.brand}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Chủ xe:</label>
            <select
              name="customerId"
              className="border p-2 rounded w-full"
              value={newVehicle?.customerId || ""} // Gán giá trị từ customerId
              onChange={handleInputChange}
            >
              <option value="">Chọn chủ xe</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.fullName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {newVehicle?._id ? "Cập nhật" : "Thêm"}
            </button>

            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded"
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

export default VehicleModal;
