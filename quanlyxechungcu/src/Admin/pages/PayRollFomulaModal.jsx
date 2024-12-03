import React from "react";

const PayRollFomulaModal = ({
  openModal,
  newPayRollFomula,
  setNewPayRollFomula,
  handleAddPayRollFomula,
  setOpenModal,
}) => {
  if (!openModal) return null;

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setNewPayRollFomula((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[400px]">
        <header className=" text-lg font-semibold p-4 rounded-t">
          Thêm công thức tính tiền cho nhân viên
        </header>
        <div className="bg-white p-4">
          <div className="mb-4">
            <label className="block font-medium">Công thức tính cho:</label>
            <select
              className="w-full mt-1 p-2 border rounded"
              value={newPayRollFomula?.role || ""}
              onChange={handleInputChange("role")}
            >
              <option value="">------</option>
              <option value="User">Nhân viên</option>
              <option value="Manager">Quản lý</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-medium">Lương cơ bản theo giờ:</label>
            <input
              type="number"
              className="w-full mt-1 p-2 border rounded"
              placeholder="Nhập số giờ"
              value={newPayRollFomula?.basicRatePerHour || ""}
              onChange={handleInputChange("basicRatePerHour")}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Lương làm ngoài giờ:</label>
            <input
              type="number"
              className="w-full mt-1 p-2 border rounded"
              placeholder="Nhập số giờ"
              value={newPayRollFomula?.overtimeRate || ""}
              onChange={handleInputChange("overtimeRate")}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Phạt đi trễ:</label>
            <input
              type="number"
              className="w-full mt-1 p-2 border rounded"
              placeholder="Nhập giá"
              value={newPayRollFomula?.deductions || ""}
              onChange={handleInputChange("deductions")}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Trợ cấp:</label>
            <input
              type="number"
              className="w-full mt-1 p-2 border rounded"
              placeholder="Nhập giá"
              value={newPayRollFomula?.allowance || ""}
              onChange={handleInputChange("allowance")}
            />
          </div>
        </div>
        <footer className="mt-4 flex justify-end space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {
              handleAddPayRollFomula();
              setOpenModal(false);
            }}
          >
            THÊM
          </button>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            onClick={() => setOpenModal(false)}
          >
            ĐÓNG
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PayRollFomulaModal;
