import React from "react";

const ParkingFeeConfigurationModal = ({
  openModal,
  newFee,
  setNewFee,
  handleAddfee,
  setOpenModal,
}) => {
  if (!openModal) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[400px]">
        <h2 className="text-lg font-semibold mb-4">
          Thêm công thức tính tiền gửi xe
        </h2>
        <div>
          <div className="col-span-9 bg-white border rounded p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Loại xe:</label>
                <select
                  className="w-full mt-1 p-2 border rounded"
                  value={newFee?.vehicleType}
                  onChange={(e) =>
                    setNewFee((prev) => ({
                      ...prev,
                      vehicleType: e.target.value, // Cập nhật trạng thái
                    }))
                  }
                >
                  <option value="">Chọn loại phương tiện</option>
                  <option value="car">Ô tô</option>
                  <option value="motor">Xe máy</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">Giá gửi ngày:</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Nhập số giờ"
                  value={newFee?.hourly_rate}
                  onChange={(e) =>
                    setNewFee((prev) => ({
                      ...prev,
                      hourly_rate: e.target.value, // Cập nhật trạng thái
                    }))
                  }
                />
              </div>
              <div>
                <label className="block font-medium">Giá gửi đêm:</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Nhập giá"
                  value={newFee?.overnight_rate}
                  onChange={(e) =>
                    setNewFee((prev) => ({
                      ...prev,
                      overnight_rate: e.target.value, // Cập nhật trạng thái
                    }))
                  }
                />
              </div>
              <div>
                <label className="block font-medium">Giá gửi 1 ngày:</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Nhập giá"
                  value={newFee?.daily_rate}
                  onChange={(e) =>
                    setNewFee((prev) => ({
                      ...prev,
                      daily_rate: e.target.value, // Cập nhật trạng thái
                    }))
                  }
                />
              </div>
              <div>
                <label className="block font-medium">Giá gửi theo tuần:</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Nhập giá"
                  value={newFee?.weekly_rate}
                  onChange={(e) =>
                    setNewFee((prev) => ({
                      ...prev,
                      weekly_rate: e.target.value, // Cập nhật trạng thái
                    }))
                  }
                />
              </div>
              <div>
                <label className="block font-medium">Giá gửi theo tháng:</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Nhập giá"
                  value={newFee?.monthly_rate}
                  onChange={(e) =>
                    setNewFee((prev) => ({
                      ...prev,
                      monthly_rate: e.target.value, // Cập nhật trạng thái
                    }))
                  }
                />
              </div>
              <div>
                <label className="block font-medium">Giá gửi theo năm:</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Nhập giá"
                  value={newFee?.yearly_rate}
                  onChange={(e) =>
                    setNewFee((prev) => ({
                      ...prev,
                      yearly_rate: e.target.value, // Cập nhật trạng thái
                    }))
                  }
                />
              </div>
              <div>
                <label className="block font-medium" htmlFor="status-in-using">
                  Trạng thái:
                </label>
                <div className="flex flex-row justify-around mt-3">
                  <div>
                    <span className="mr-2">Đang dùng</span>
                    <input
                      type="radio"
                      id="status-in-using"
                      className="mt-1"
                      checked={newFee?.status === "in_using"} // Kiểm tra trạng thái
                      onChange={() =>
                        setNewFee((prev) => ({
                          ...prev,
                          status: "in_using", // Cập nhật trạng thái
                        }))
                      }
                    />
                  </div>
                  <div>
                    <span className="mr-2">Không dùng</span>
                    <input
                      type="radio"
                      id="status-not-using"
                      className="mt-1"
                      checked={newFee?.status === "not_using"} // Kiểm tra trạng thái
                      onChange={() =>
                        setNewFee((prev) => ({
                          ...prev,
                          status: "not_using", // Cập nhật trạng thái
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-4">
              <button
                className={`bg-blue-500 text-white px-4 py-2 rounded`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenModal(false);
                  handleAddfee();
                }}
                // onClick={handleAddfee}
                // onClick={() => setOpenModal(false)}
              >
                THÊM
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded"
                onClick={() => setOpenModal(false)}
              >
                ĐÓNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingFeeConfigurationModal;
