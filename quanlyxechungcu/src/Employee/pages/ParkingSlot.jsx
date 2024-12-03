import React, { useEffect, useState } from "react";
import Notification from "../components/Notification";
import {
  getAllAvailabeParkingSlotByType,
  getAllParkingSlot,
} from "../../useAPI/useParkingSlotAPI";
import { changeTypeVehicle } from "../../utils/index";
import Loading from "../components/Loading";

const ParkingSlot = () => {
  const [parkingSlots, setParkingSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotTypeFilter, setSlotTypeFilter] = useState(""); // State cho loại xe
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParkingSlotData = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        const parkingSlots = await getAllParkingSlot();
        setParkingSlots(parkingSlots || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Dừng loading khi dữ liệu đã được fetch
      }
    };

    fetchParkingSlotData(); // Gọi hàm để lấy dữ liệu
  }, []);

  const fetchDataByCode = async (code) => {
    try {
      const slots = await getAllAvailabeParkingSlotByType(code);
      setParkingSlots(slots || []);
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
    }
  };

  const handleSlotTypeChange = (e) => {
    const type = e.target.value;
    setSlotTypeFilter(type);
    if (type) {
      fetchDataByCode(type);
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa bãi đỗ này?");
    if (confirmDelete) {
      try {
        const updatedSlots = parkingSlots.filter((slot) => slot._id !== id);
        setParkingSlots(updatedSlots);

        setShowNotification({
          content: "Xóa thành công!",
          type: "success",
          show: true,
        });
      } catch (error) {
        console.error("Có lỗi khi xóa bãi đỗ:", error);
        setShowNotification({
          content: "Xóa thất bại!",
          type: "error",
          show: true,
        });
      }
    }
  };

  const handleRowClick = (slot) => {
    setSelectedSlot(slot); // Cập nhật selectedSlot khi nhấp vào dòng
  };

  if (loading) {
    return <Loading />; // Hiển thị Loading nếu đang tải dữ liệu
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 ">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">DANH SÁCH BÃI ĐỖ</h1>
        </div>
        <div className="flex justify-end items-center mb-4">
          <div className="flex space-x-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              THÊM
            </button>
          </div>
        </div>
        <div className="flex space-x-4 mb-4 ">
          <label className="p-2 mr-2 ">Loại xe:</label>
          <select
            value={slotTypeFilter}
            onChange={handleSlotTypeChange}
            className="border p-2 rounded"
          >
            <option value="">Tất cả</option>
            <option value="car">Xe hơi</option>
            <option value="motor">Xe máy</option>
          </select>
        </div>
        <div className="grid grid-cols-7">
          <div className="overflow-x-auto rounded bg-gray-100 border p-4 col-span-7">
            <div className="h-[400px] overflow-y-scroll">
              <table className="min-w-full bg-white border rounded">
                <thead>
                  <tr className="bg-slate-300">
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      #
                    </th>
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      Loại bãi đỗ
                    </th>
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      Khu
                    </th>
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      Số lượng
                    </th>
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      Còn trống
                    </th>
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(parkingSlots) && parkingSlots.length > 0 ? (
                    parkingSlots.map((slot, index) => (
                      <tr
                        key={slot._id}
                        className={`text-center cursor-pointer ${
                          selectedSlot && selectedSlot._id === slot._id
                            ? "bg-gray-200"
                            : ""
                        }`}
                        onClick={() => handleRowClick(slot)} // Xử lý khi nhấp vào dòng
                      >
                        <td className="border p-2">{index + 1}</td>
                        <td className="border p-2">
                          {changeTypeVehicle(slot?.slotType)}
                        </td>
                        <td className="border p-2">{slot?.slotCode}</td>
                        <td className="border p-2">{slot?.totalQuantity}</td>
                        <td className="border p-2">{slot?.availableSlots}</td>
                        <td className="border p-2">
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded"
                            onClick={() => handleDelete(slot._id)} // Sự kiện xóa
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center p-4">
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Popup Modal Thêm Xe */}
        <Notification
          showNotification={showNotification}
          setShowNotification={setShowNotification}
        />
      </div>
    </div>
  );
};

export default ParkingSlot;
