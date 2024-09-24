// src/components/ParkingFeeConfiguration.js
import React, { useState } from "react";

const ParkingFeeConfiguration = () => {
  const [vehicleName, setVehicleName] = useState("Xe Máy");
  const [status, setStatus] = useState("Sử dụng");
  const [fee, setFee] = useState({
    regularFee: 3000,
    nightFee: 5000,
    dayFee: 8000,
    monthlyFee: 0,
    freeTime: 0,
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className=" mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">
            Công thức tính tiền theo công văn
          </h1>
          <span className="text-green-500">CẬP NHẬT THÀNH CÔNG</span>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Sidebar with vehicle list */}
          <div className="col-span-3 bg-gray-50 border rounded p-4">
            <div className="flex justify-around mb-2">
              <button className="bg-blue-500 text-white px-3 py-1 rounded">
                Thêm
              </button>
              <button className="bg-red-500 text-white px-3 py-1 rounded">
                Xóa
              </button>
              <button className="bg-gray-500 text-white px-3 py-1 rounded">
                Khôi phục
              </button>
            </div>
            <div className="mt-2">
              <div className="p-2 border-b cursor-pointer bg-blue-100">
                Xe Máy
              </div>
              {/* Additional items can be added here */}
            </div>
          </div>

          {/* Configuration form */}
          <div className="col-span-9 bg-white border rounded p-4">
            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Tên:</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                />
              </div>
              <div className="col-span-2 flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>Thu tiền trước</span>
                <input type="checkbox" className="ml-4 mr-2" />
                <span>Chụp Camera phụ</span>
              </div>

              <div className="col-span-1">
                <label className="block font-medium">Giá thường:</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  value={fee.regularFee}
                  onChange={(e) =>
                    setFee({ ...fee, regularFee: parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="col-span-1">
                <label className="block font-medium">Giá đêm:</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  value={fee.nightFee}
                  onChange={(e) =>
                    setFee({ ...fee, nightFee: parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="col-span-1">
                <label className="block font-medium">Giá ngày đêm:</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  value={fee.dayFee}
                  onChange={(e) =>
                    setFee({ ...fee, dayFee: parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="col-span-1">
                <label className="block font-medium">Giá vé tháng:</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  value={fee.monthlyFee}
                  onChange={(e) =>
                    setFee({ ...fee, monthlyFee: parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="col-span-1">
                <label className="block font-medium">TG miễn phí (phút):</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  value={fee.freeTime}
                  onChange={(e) =>
                    setFee({ ...fee, freeTime: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex justify-end space-x-4">
              <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                Đồng ý sửa
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Tính thử giá vé
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingFeeConfiguration;
