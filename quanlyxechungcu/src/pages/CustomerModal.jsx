import React from "react";

const CustomerModal = ({
  showAddForm,
  newCustomer,
  apartments,
  handleInputChange,
  handleSubmit,
  handleCloseModal,
}) => {
  // console.log("newCustomer", newCustomer);

  if (!showAddForm) return null;

  // const isResident = newCustomer?.isResident === "true"; // Kiểm tra loại khách hàng

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[400px]">
        <h2 className="text-lg font-semibold mb-4">
          {newCustomer?._id ? "Cập nhật Khách Hàng" : "Thêm Khách Hàng Mới"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Họ và tên:</label>
            <input
              type="text"
              name="fullName"
              className="border p-2 rounded w-full"
              value={newCustomer?.fullName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Phòng:</label>
            <select
              name="apartmentsId"
              className="border p-2 rounded w-full"
              value={newCustomer?.apartmentsId || ""} // Đảm bảo giá trị _id được gán
              onChange={handleInputChange}
              // disabled={isResident} // Vô hiệu hóa khi là khách vãn lai
            >
              <option value="">Chọn phòng</option>
              {apartments.map((apartment) => (
                <option key={apartment._id} value={apartment._id}>
                  {apartment.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Số điện thoại:</label>
            <input
              type="text"
              name="phoneNumber"
              className="border p-2 rounded w-full"
              value={newCustomer?.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Địa chỉ:</label>
            <input
              type="text"
              name="address"
              className="border p-2 rounded w-full"
              value={newCustomer?.address}
              onChange={handleInputChange}
              // disabled={!isResident} // Vô hiệu hóa khi là cư dân trong khu
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Loại khách hàng:</label>
            <select
              name="isResident"
              className="border p-2 rounded w-full"
              value={newCustomer?.isResident}
              onChange={handleInputChange}
            >
              <option value="">Chọn loại khách hàng</option>
              <option value="true">Trong khu dân cư</option>
              <option value="false">Vãn lai</option>
            </select>
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {newCustomer?._id ? "Cập nhật" : "Thêm"}
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

export default CustomerModal;
