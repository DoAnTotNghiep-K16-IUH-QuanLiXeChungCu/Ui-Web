import React, { useContext, useEffect, useState } from "react";
import { getAllParkingRate } from "../useAPI/useParkingRateAPI";
import { changeTypeVehicle } from "../utils/index";
import UserContext from "../context/UserContext";
import { getData } from "../context/indexedDB";

const ParkingFeeConfiguration = () => {
  const [fees, setFees] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newFee, setNewFee] = useState({
    vehicleType: "",
    hourly: "",
    price: "",
  });
  useEffect(() => {
    const fetchFeeData = async () => {
      const fees = await getAllParkingRate();
      setFees(fees || []);
    };
    fetchFeeData(); // Gọi hàm để lấy dữ liệu
  }, []);
  const filteredfee =
    fees.length > 0
      ? fees.filter(
          (fee) =>
            fee.vehicleType &&
            fee.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) // Kiểm tra fee.uuid tồn tại trước khi gọi toLowerCase
        )
      : [];

  const handlefeeClick = (fee) => {
    if (selectedFee && selectedFee._id === fee._id) {
      setSelectedFee(null); // Nếu thẻ đã được chọn, bỏ chọn
      setNewFee(""); // Xóa giá trị input
    } else {
      setSelectedFee(fee); // Chọn thẻ mới
      setNewFee({
        vehicleType: fee.vehicleType,
        hourly: fee.hourly,
        price: fee.price,
      }); // Cập nhật giá trị input thành UUID của thẻ đã chọn
    }
  };

  const isFeeExists = fees.some((fee) => fee.uuid === newFee);

  const handleAddfee = async (newFee) => {
    if (newFee) {
      console.log("Fee ", newFee);
      // const addedfee = await addfee(newFee); // Kiểm tra xem addedfee có đúng không
      // console.log("Thẻ mới được thêm:", addedfee); // Thêm log để kiểm tra
      // setFee((prev) => [...prev, addedfee]); // Thêm thẻ mới vào danh sách
      setNewFee(""); // Reset giá trị input sau khi thêm
    }
  };

  const handleDeletefee = async (id) => {
    if (!id) {
      console.error("ID của Fee không hợp lệ");
      return;
    }

    try {
      // await deletefee(id);
      setFees((prev) => prev.filter((fee) => fee._id !== id));
      setSelectedFee(null);
      console.log(`Fee có ID ${id} đã được xóa thành công.`);
    } catch (error) {
      console.error("Có lỗi khi xóa Fee:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-xl font-semibold">Danh sách Phí đỗ xe</h1>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="border p-2 rounded w-[500px]"
            value={searchTerm}
            onChange={(e) => setNewFee({ ...newFee, hourly: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3 bg-gray-50 border rounded p-4">
            <div className="h-[400px] overflow-y-scroll">
              <table className="min-w-full bg-white border rounded">
                <tbody>
                  {filteredfee.map((fee) => (
                    <tr
                      key={fee._id}
                      className={`text-center cursor-pointer ${
                        selectedFee && selectedFee._id === fee._id
                          ? "bg-gray-200" // Đổi màu nền khi thẻ được chọn
                          : ""
                      }`}
                      onClick={() => handlefeeClick(fee)} // Thêm hàm nhấn vào thẻ
                    >
                      <td className="border p-2">
                        {changeTypeVehicle(fee.vehicleType)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-span-9 bg-white border rounded p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Loại xe:</label>
                <select
                  className="w-full mt-1 p-2 border rounded"
                  value={changeTypeVehicle(newFee.vehicleType)} // Sử dụng giá trị trực tiếp từ newFee.vehicleType
                  onChange={
                    (e) => setNewFee({ ...newFee, vehicleType: e.target.value }) // Cập nhật giá trị vehicleType khi người dùng thay đổi
                  }
                >
                  <option value="Ô tô">Ô tô</option>
                  <option value="Xe máy">Xe máy</option>
                </select>
              </div>

              <div>
                <label className="block font-medium">Số giờ:</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Nhập số giờ"
                  value={newFee.hourly} // Giá trị của input là mã số thẻ mới
                  onChange={(e) =>
                    setNewFee({ ...newFee, hourly: e.target.value })
                  }
                  // Cập nhật giá trị khi người dùng gõ vào input
                />
              </div>
              <div>
                <label className="block font-medium">Giá:</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Nhập giá"
                  value={newFee.price} // Giá trị của input là mã số thẻ mới
                  onChange={(e) =>
                    setNewFee({ ...newFee, price: e.target.value })
                  }
                  // Cập nhật giá trị khi người dùng gõ vào input
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-4">
              <button
                className={`bg-blue-500 text-white px-4 py-2 rounded ${
                  isFeeExists ? "opacity-50 cursor-not-allowed" : ""
                }`} // Thêm class để vô hiệu hóa nút nếu UUID đã tồn tại
                disabled={isFeeExists} // Vô hiệu hóa nút nếu UUID đã tồn tại
                onClick={() => handleAddfee(newFee)} // Hàm thêm thẻ mới khi nhấn nút
              >
                THÊM
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleDeletefee(selectedFee._id)}
              >
                XÓA
              </button>
              {/* <button className="bg-yellow-500 text-white px-4 py-2 rounded">
                Sửa
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingFeeConfiguration;
