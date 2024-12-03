import React, { useEffect, useState } from "react";
import {
  createParkingRate,
  deleteParkingRate,
  getAllParkingRate,
  updateParkingRate,
} from "../../useAPI/useParkingRateAPI";
import { changeTypeVehicle } from "../../utils/index";

import Loading from "../components/Loading";
import Notification from "../components/Notification";
import ConfirmationModal from "../components/ConfirmationModal ";
import ParkingFeeConfigurationModal from "./ParkingFeeConfigurationModal";

const ParkingFeeConfiguration = () => {
  const [fees, setFees] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [similarFee, setSimilarFee] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const [loading, setLoading] = useState(true);
  const [newFee, setNewFee] = useState({
    vehicleType: "",
    hourly_rate: "",
    overnight_rate: "",
    daily_rate: "",
    weekly_rate: "",
    monthly_rate: "",
    yearly_rate: "",
    status: "",
  });
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  const fetchFeeData = async () => {
    try {
      const fees = await getAllParkingRate();
      setFees(fees || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFeeData();
  }, []);
  const handlefeeClick = (fee) => {
    if (selectedFee && selectedFee._id === fee._id) {
      setSelectedFee(null);
    } else {
      setSelectedFee(fee);
    }
  };
  const findSimilarVehicleInUse = (fees, fee) => {
    return fees.find(
      (item) =>
        item._id !== fee._id && // ID khác
        item.vehicleType === fee.vehicleType && // Cùng loại xe
        item.status === "in_using" // Trạng thái đang sử dụng
    );
  };

  const handleUpdatefee = async (Fee) => {
    if (!Fee) {
      setShowNotification({
        content: `Bạn chưa chọn đối tượng để chỉnh sửa`,
        type: "Error",
        show: true,
      });
      return;
    } else {
      const similar = findSimilarVehicleInUse(fees, Fee);

      if (similar) {
        setSimilarFee(similar);
      }
      if (Fee.status === "in_using" && similar) {
        setMessage(
          "Công thức tính tiền dành phương tiện này đã được dùng, nếu bạn sử dụng nó thì công thức trước sẽ không dùng nữa, bạn có chắc sẽ sửa lại thành như vậy chứ"
        );
        setType("update");
        setShowModal(true);
      } else {
        updateFee(selectedFee);
        setNewFee("");

        fetchFeeData();
      }
    }
  };
  const handleEditSimilar = async () => {
    setSimilarFee({ ...similarFee, status: "not_using" });
    const simil = { ...similarFee, status: "not_using" };
    console.log("simil", simil);

    updateFee(simil);
    updateFee(selectedFee);
    setNewFee("");

    fetchFeeData();
  };
  const handleAddSimilar = async () => {
    setSimilarFee({ ...similarFee, status: "not_using" });
    const simil = { ...similarFee, status: "not_using" };
    console.log("simil", simil);

    updateFee(simil);
    try {
      const add = await createParkingRate(newFee);
      if (add) {
        setShowNotification({
          content: `Đã thêm thành công công thức tính tiền xe mới`,
          type: "Notification",
          show: true,
        });
        setNewFee("");
        fetchFeeData();
      } else {
        setShowNotification({
          content: `Đã có lỗi khi thêm công thức tính tiền xe mới`,
          type: "Error",
          show: true,
        });
      }
    } catch (error) {
      console.error("Có lỗi khi xóa Fee:", error);
    }
  };
  const updateFee = async (Fee) => {
    try {
      await updateParkingRate(Fee);
      setNewFee("");
      fetchFeeData();
    } catch (error) {
      setShowNotification({
        content: `Đã có lỗi khi sửa bảng tính phí này`,
        type: "Error",
        show: true,
      });
    }
  };
  const handleDeletefee = async (id) => {
    console.log("id", id);
    try {
      const deleteFee = await deleteParkingRate(id);
      if (deleteFee) {
        setFees((prev) => prev.filter((fee) => fee._id !== id));
        setSelectedFee(null);
        setShowNotification({
          content: `Đã xóa bảng tính phí này`,
          type: "Notification",
          show: true,
        });
      } else {
        setShowNotification({
          content: `Đã có lỗi khi xóa bảng tính phí này`,
          type: "Error",
          show: true,
        });
      }
    } catch (error) {
      console.error("Có lỗi khi xóa Fee:", error);
    }
  };
  const handleAddfee = async () => {
    console.log("newFee", newFee);

    const similar = fees.find(
      (item) =>
        item.vehicleType === newFee.vehicleType && // Cùng loại xe
        item.status === "in_using" // Trạng thái đang sử dụng
    );
    console.log("similar____", similar);

    if (!newFee) {
      console.error("Bạn chưa điền thông tin cho công thức tính tiền xe mới");
      return;
    } else if (similar && newFee.status === "in_using") {
      setSimilarFee(similar);
      setMessage(
        "Công thức tính tiền dành phương tiện này đã được dùng, nếu bạn muống tạo mới và sử dụng nó thì công thức trước sẽ không dùng nữa, bạn có chắc sẽ sửa lại thành như vậy chứ"
      );
      setShowModal(true);
      setType("add");
      return;
    }
    try {
      const add = await createParkingRate(newFee);
      if (add) {
        setShowNotification({
          content: `Đã thêm thành công công thức tính tiền xe mới`,
          type: "Notification",
          show: true,
        });
        setNewFee("");
        fetchFeeData();
      } else {
        setShowNotification({
          content: `Đã có lỗi khi thêm công thức tính tiền xe mới`,
          type: "Error",
          show: true,
        });
      }
    } catch (error) {
      console.error("Có lỗi khi xóa Fee:", error);
    }
  };
  if (loading) {
    return <Loading />; // Hiển thị Loading nếu đang tải dữ liệu
  }
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">DANH SÁCH PHÍ ĐỖ XE</h1>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3 bg-gray-50 border rounded p-4">
            <div className="h-[400px] overflow-y-scroll">
              <table className="min-w-full bg-white border rounded">
                <thead>
                  <tr className="bg-slate-300">
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      Tên
                    </th>
                    <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((fee) => (
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
                      <td className="border p-2">
                        {fee.status === "in_using" ? "Đang dùng" : "Không dùng"}
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
                  value={selectedFee?.vehicleType}
                >
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
                  value={selectedFee?.hourly_rate} // Giá trị của input là mã số thẻ mới
                />
              </div>
              <div>
                <label className="block font-medium">Giá gửi đêm:</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Nhập giá"
                  value={selectedFee?.overnight_rate}
                />
              </div>
              <div>
                <label className="block font-medium">Giá gửi 1 ngày:</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Nhập giá"
                  value={selectedFee?.daily_rate}
                />
              </div>
              <div>
                <label className="block font-medium">Giá gửi theo tuần:</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Nhập giá"
                  value={selectedFee?.weekly_rate}
                />
              </div>
              <div>
                <label className="block font-medium">Giá gửi theo tháng:</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Nhập giá"
                  value={selectedFee?.monthly_rate}
                />
              </div>
              <div>
                <label className="block font-medium">Giá gửi theo năm:</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Nhập giá"
                  value={selectedFee?.yearly_rate}
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
                      name="status"
                      checked={selectedFee?.status === "in_using"} // Kiểm tra trạng thái
                      onChange={() =>
                        setSelectedFee((prev) => ({
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
                      name="status"
                      checked={selectedFee?.status === "not_using"} // Kiểm tra trạng thái
                      onChange={() =>
                        setSelectedFee((prev) => ({
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
                onClick={() => setOpenModal(true)}
              >
                THÊM
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleDeletefee(selectedFee._id)}
              >
                XÓA
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded"
                onClick={() => handleUpdatefee(selectedFee)}
              >
                Sửa
              </button>
            </div>
          </div>
        </div>
      </div>
      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
      <ConfirmationModal
        isOpen={showModal}
        message={message}
        onConfirm={handleEditSimilar}
        onConfirmAdd={handleAddSimilar}
        type={type}
        onCancel={() => setShowModal(false)} // Đóng modal khi hủy
      />
      <ParkingFeeConfigurationModal
        openModal={openModal}
        newFee={newFee}
        setNewFee={setNewFee}
        handleAddfee={handleAddfee}
        setOpenModal={setOpenModal}
      />
    </div>
  );
};

export default ParkingFeeConfiguration;
