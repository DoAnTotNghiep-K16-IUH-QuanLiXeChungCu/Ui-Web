import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import Notification from "../components/Notification";
import ConfirmationModal from "../components/ConfirmationModal ";
import ParkingFeeConfigurationModal from "./ParkingFeeConfigurationModal";
import {
  CreatePayRollFomula,
  DeletePayRollFomula,
  GetAllPayRollFomula,
  UpdatePayRollFomula,
} from "./../useAPI/usePayRollFomula";
import PayRollFomulaModal from "./PayRollFomulaModal";
const PayRollFomula = () => {
  const [payRollFomulas, setPayRollFomulas] = useState([]);
  const [selectedPayRollFomula, setSelectedPayRollFomula] = useState(null);
  const [similarPayRollFomula, setSimilarPayRollFomula] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const [loading, setLoading] = useState(true);
  const [newPayRollFomula, setNewPayRollFomula] = useState({});
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  const fetchFeeData = async () => {
    try {
      const payRollFomula = await GetAllPayRollFomula();
      setPayRollFomulas(payRollFomula || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFeeData();
  }, []);
  const handlePayRollFomulaClick = (pay) => {
    if (selectedPayRollFomula && selectedPayRollFomula._id === pay._id) {
      setSelectedPayRollFomula(null);
    } else {
      setSelectedPayRollFomula(pay);
    }
  };
  const findSimilarRoleInUse = (payRollFomulas, pay) => {
    return payRollFomulas.find(
      (item) =>
        item._id !== pay._id && // ID khác
        item.role === pay.role && // Cùng loại xe
        item.status === "in_using" // Trạng thái đang sử dụng
    );
  };

  const handleUpdatePayRollFomula = async (Pay) => {
    if (!Pay) {
      setShowNotification({
        content: `Bạn chưa chọn đối tượng để chỉnh sửa`,
        type: "Error",
        show: true,
      });
      return;
    } else {
      const similar = findSimilarRoleInUse(payRollFomulas, Pay);

      if (similar) {
        setSimilarPayRollFomula(similar);
      }
      if (Pay.status === "in_using" && similar) {
        setMessage(
          "Công thức tính tiền dành phương tiện này đã được dùng, nếu bạn sử dụng nó thì công thức trước sẽ không dùng nữa, bạn có chắc sẽ sửa lại thành như vậy chứ"
        );
        setType("update");
        setShowModal(true);
      } else {
        updateFomula(selectedPayRollFomula);
        setNewPayRollFomula("");

        fetchFeeData();
      }
    }
  };
  const handleEditSimilar = async () => {
    setSimilarPayRollFomula({ ...similarPayRollFomula, status: "not_using" });
    const simil = { ...similarPayRollFomula, status: "not_using" };
    console.log("simil", simil);

    updateFomula(simil);
    updateFomula(selectedPayRollFomula);
    setNewPayRollFomula("");

    fetchFeeData();
  };
  const updateFomula = async (Fee) => {
    try {
      await UpdatePayRollFomula(Fee);
      setNewPayRollFomula("");
      fetchFeeData();
    } catch (error) {
      setShowNotification({
        content: `Đã có lỗi khi sửa công thức tính lương này`,
        type: "Error",
        show: true,
      });
    }
  };
  const handleDeletePayRollFomula = async (id) => {
    console.log("id", id);
    try {
      const deleteFee = await DeletePayRollFomula(id);
      if (deleteFee) {
        setPayRollFomulas((prev) => prev.filter((fee) => fee._id !== id));
        setSelectedPayRollFomula(null);
        setShowNotification({
          content: `Đã xóa công thức tính lương này`,
          type: "Notification",
          show: true,
        });
      } else {
        setShowNotification({
          content: `Đã có lỗi khi xóa công thức tính lương này`,
          type: "Error",
          show: true,
        });
      }
    } catch (error) {
      console.error("Có lỗi khi xóa PayRollFomula:", error);
    }
  };
  const handleAddPayRollFomula = async () => {
    console.log("newPayRollFomula", newPayRollFomula);
    if (!newPayRollFomula) {
      console.error("Bạn chưa điền thông tin cho công thức tính tiền xe mới");
      return;
    }
    try {
      const add = await CreatePayRollFomula(newPayRollFomula);
      if (add) {
        setShowNotification({
          content: `Đã thêm thành công công thức tính tiền mới dành cho nhân viên`,
          type: "Notification",
          show: true,
        });
        setNewPayRollFomula("");
        fetchFeeData();
      } else {
        setShowNotification({
          content: `Đã có lỗi khi thêm công thức tính tiền mới`,
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
                  {payRollFomulas.map((fomula) => (
                    <tr
                      key={fomula._id}
                      className={`text-center cursor-pointer ${
                        selectedPayRollFomula &&
                        selectedPayRollFomula._id === fomula._id
                          ? "bg-gray-200" // Đổi màu nền khi thẻ được chọn
                          : ""
                      }`}
                      onClick={() => handlePayRollFomulaClick(fomula)} // Thêm hàm nhấn vào thẻ
                    >
                      <td className="border p-2">
                        {fomula.role === "User"
                          ? "Nhân viên"
                          : fomula.role === "Manager"
                          ? "Quản lý"
                          : "Admin"}
                      </td>
                      <td className="border p-2">
                        {fomula.status === "in_using"
                          ? "Đang dùng"
                          : "Không dùng"}
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
                <label className="block font-medium">
                  Lương cơ bản theo giờ:
                </label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Nhập số giờ"
                  value={selectedPayRollFomula?.basicRatePerHour} // Giá trị của input là mã số thẻ mới
                />
              </div>

              <div>
                <label className="block font-medium">
                  Lương làm ngoài giờ:
                </label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Nhập số giờ"
                  value={selectedPayRollFomula?.overtimeRate} // Giá trị của input là mã số thẻ mới
                />
              </div>
              <div>
                <label className="block font-medium">Phạt đi trễ:</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Nhập giá"
                  value={selectedPayRollFomula?.deductions}
                />
              </div>
              <div>
                <label className="block font-medium">Trợ cấp:</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Nhập giá"
                  value={selectedPayRollFomula?.allowance}
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
                      checked={selectedPayRollFomula?.status === "in_using"} // Kiểm tra trạng thái
                      onChange={() =>
                        setSelectedPayRollFomula((prev) => ({
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
                      checked={selectedPayRollFomula?.status === "not_using"} // Kiểm tra trạng thái
                      onChange={() =>
                        setSelectedPayRollFomula((prev) => ({
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
                onClick={() =>
                  handleDeletePayRollFomula(selectedPayRollFomula._id)
                }
              >
                XÓA
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded"
                onClick={() => handleUpdatePayRollFomula(selectedPayRollFomula)}
              >
                SỬA
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
        onConfirmAdd={handleEditSimilar}
        type={type}
        onCancel={() => setShowModal(false)} // Đóng modal khi hủy
      />
      <PayRollFomulaModal
        openModal={openModal}
        newPayRollFomula={newPayRollFomula}
        setNewPayRollFomula={setNewPayRollFomula}
        handleAddPayRollFomula={handleAddPayRollFomula}
        setOpenModal={setOpenModal}
      />
    </div>
  );
};

export default PayRollFomula;
