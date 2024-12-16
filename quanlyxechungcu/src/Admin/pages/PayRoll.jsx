import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { GetPayRollByPeriod, UpdatePayRoll } from "../../useAPI/usePayRollAPI";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import * as XLSX from "xlsx";
import Notification from "../components/Notification";
import PayRollPerUser from "./PayRollPerUser";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PayRoll = () => {
  const [payRoll, setPayRoll] = useState([]);
  const [selectedPay, setSelectedPay] = useState(""); // Thêm state để lưu ghi chú hiện tại

  const now = new Date();
  const dayHere = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );
  const monthHere = dayHere.getMonth() + 1;
  const yearHere = dayHere.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(monthHere);
  const [selectedYear, setSelectedYear] = useState(yearHere);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "addAllowance" hoặc "addDeduction"
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [more, setMore] = useState(false);
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  const fetchData = async (month, year) => {
    try {
      const listPayRoll = await GetPayRollByPeriod(month, year);
      setPayRoll(listPayRoll);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleSubmitModal = async () => {
    if (!selectedEmployee || !amount) {
      setShowNotification({
        content: "Vui lòng chọn nhân viên và nhập số tiền!",
        type: "Error",
        show: true,
      });
      return; // Ngăn chặn đoạn mã tiếp tục chạy
    }

    // Định dạng ngày hiện tại
    const currentDate = new Date();
    const formattedDate = `${currentDate
      .getDate()
      .toString()
      .padStart(2, "0")}/${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${currentDate.getFullYear()}`;
    const updatedNote = `Thêm tiền ${
      modalType === "addAllowance" ? "trợ cấp" : "trừ"
    } với lý do "${note}" vào ngày ${formattedDate}`.trim();

    // Chuẩn bị dữ liệu payroll cập nhật
    const {
      _id: id,
      userID,
      payPeriod,
      totalRegularHours,
      totalOvertimeHours,
      basicSalary,
      overtimeSalary,
      deductions = 0,
      allowance = 0,
      totalSalary,
      note: existingNote = "",
    } = selectedEmployee;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      setShowNotification({
        content: "Số tiền không hợp lệ, vui lòng nhập lại!",
        type: "Error",
        show: true,
      });
      return;
    }

    const updatedFields =
      modalType === "addAllowance"
        ? {
            allowance: allowance + parsedAmount,
            totalSalary: totalSalary + parsedAmount,
          }
        : modalType === "addDeduction"
        ? {
            deductions: deductions + parsedAmount,
            totalSalary: totalSalary - parsedAmount,
          }
        : {};

    const updatedPayRollEmployee = {
      id,
      userID: userID._id,
      payPeriod,
      totalRegularHours,
      totalOvertimeHours,
      basicSalary,
      overtimeSalary,
      ...updatedFields,
      note: `${existingNote}\n${updatedNote}`.trim(),
    };

    // Gọi API cập nhật payroll
    try {
      const updatePay = await UpdatePayRoll(updatedPayRollEmployee);

      if (updatePay) {
        setShowNotification({
          content: `Đã ${
            modalType === "addAllowance" ? "thêm trợ cấp" : "trừ lương"
          } cho nhân viên ${updatePay.userID.fullname} với lý do "${note}"`,
          type: "Notification",
          show: true,
        });
        fetchData(selectedMonth, selectedYear);
      } else {
        setShowNotification({
          content: `Đã có lỗi khi ${
            modalType === "addAllowance" ? "thêm trợ cấp" : "trừ lương"
          }. Vui lòng thử lại.`,
          type: "Error",
          show: true,
        });
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi khi cập nhật:", error);
      setShowNotification({
        content: "Đã xảy ra lỗi hệ thống, vui lòng thử lại sau.",
        type: "Error",
        show: true,
      });
    }

    // Đặt lại trạng thái modal
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setAmount("");
    setNote("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setAmount("");
    setNote("");
  };

  const chartData = {
    labels: payRoll.map((item) => item.userID.fullname),
    datasets: [
      {
        label: "Lương trong ca",
        data: payRoll.map((item) => item.basicSalary),
        backgroundColor: "rgba(75, 192, 192, 1)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Lương làm ngoài giờ",
        data: payRoll.map((item) => item.overtimeSalary),
        backgroundColor: "rgba(153, 102, 255, 1)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
      {
        label: "Tiền trừ",
        data: payRoll.map((item) => item.deductions),
        backgroundColor: "rgba(255, 159, 64,1)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const handleClick = (pay) => {
    setSelectedPay(pay); // Đặt ghi chú vào state
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      payRoll.map((pay) => ({
        "Nhân viên": pay.userID.fullname,
        "Số giờ làm trong ca": pay.totalRegularHours,
        "Số giờ làm tăng ca": pay.totalOvertimeHours,
        "Tiền theo ca": pay.basicSalary,
        "Tiền làm tăng ca": pay.overtimeSalary,
        "Tiền phạt": pay.deductions,
        "Trợ cấp": pay.allowance,
        "Tổng tiền": pay.totalSalary,
        "Ghi chú": pay?.note ? pay.note.replace(/\n/g, "\n") : "",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      ws,
      `Salary ${selectedMonth} ${selectedYear}`
    );
    XLSX.writeFile(wb, "payroll.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">
          Bảng lương nhân viên tháng {selectedMonth}/{selectedYear}
        </h1>
        {/* Phần chọn tháng và năm */}
        <div className="flex items-center mb-6 justify-between">
          <div>
            <select
              className="mr-4 p-2 border rounded-md"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">Chọn tháng</option>
              {Array.from({ length: 12 }, (_, index) => index + 1).map(
                (month) => (
                  <option key={month} value={month}>
                    Tháng {month}
                  </option>
                )
              )}
            </select>
            <select
              className="mr-4 p-2 border rounded-md"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">Chọn năm</option>
              {Array.from({ length: 5 }, (_, index) => yearHere - index).map(
                (year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              )}
            </select>
          </div>
          <div>
            <button
              className="ml-4 p-2 bg-green-500 text-white rounded-md"
              onClick={() => openModal("addAllowance")}
            >
              Thêm trợ cấp
            </button>
            <button
              className="ml-4 p-2 bg-red-500 text-white rounded-md"
              onClick={() => openModal("addDeduction")}
            >
              Thêm tiền trừ
            </button>
            <button
              className="ml-4 p-2 bg-green-500 text-white rounded-md"
              onClick={exportToExcel} // Export to Excel
            >
              Xuất file Excel
            </button>
          </div>
        </div>

        {/* Selected */}
        <div className="grid grid-cols-12">
          {/* Chart Section */}
          <div className="mb-6 col-span-9 mr-3 h-96">
            <Bar data={chartData} options={{ responsive: true }} />
          </div>
          <div className="mb-4 col-span-3">
            <p>
              Ghi chú của nhân viên{" "}
              <span className="font-bold">{selectedPay?.userID?.fullname}</span>
            </p>
            <textarea
              value={
                selectedPay?.note ? selectedPay.note.replace(/\n/g, "\n") : ""
              }
              readOnly
              rows={4}
              className="w-full p-4 border rounded-md bg-gray-100"
              placeholder="Click on a note to view it here..."
            />
          </div>
        </div>

        {/* PayRoll Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-blue-300">
                <th className="p-4 text-left border">Nhân viên</th>
                <th className="p-4 text-left border">Giờ làm trong ca</th>
                <th className="p-4 text-left border">Giờ làm tăng ca</th>
                <th className="p-4 text-left border">Tiền theo ca</th>
                <th className="p-4 text-left border">Tiền làm tăng ca</th>
                <th className="p-4 text-left border">Tiền trừ</th>
                <th className="p-4 text-left border">Tiền trợ cấp</th>
                <th className="p-4 text-left border">Tổng số tiền</th>
                <th className="p-4 text-left border">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {payRoll.map((pay, index) => (
                <tr key={pay._id} className="border-b">
                  <td className="p-4 border">{pay.userID.fullname}</td>
                  <td className="p-4 border">{pay.totalRegularHours}</td>
                  <td className="p-4 border">{pay.totalOvertimeHours}</td>
                  <td className="p-4 border">
                    {pay.basicSalary?.toLocaleString() || "0"}
                  </td>
                  <td className="p-4 border">
                    {pay.overtimeSalary?.toLocaleString() || "0"}
                  </td>
                  <td className="p-4 border">
                    {pay.deductions?.toLocaleString() || "0"}
                  </td>
                  <td className="p-4 border">
                    {pay.allowance?.toLocaleString() || "0"}
                  </td>
                  <td className="p-4 border">
                    {pay.totalSalary?.toLocaleString() || "0"}
                  </td>
                  <td
                    className="p-4  border cursor-pointer text-blue-600"
                    onClick={() => handleClick(pay)}
                  >
                    {pay.note ? "Xem ghi chú" : "Chưa có ghi chú"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {more === false && (
          <div className="flex justify-center items-center mt-4">
            <button
              className="p-2 bg-blue-500 text-white rounded-md"
              onClick={() => setMore(true)}
            >
              Xem lương nhân viên từng năm
            </button>
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {modalType === "addAllowance" ? "Thêm trợ cấp" : "Thêm tiền trừ"}
            </h2>
            <select
              className="w-full p-2 border rounded-md mb-4"
              value={selectedEmployee ? selectedEmployee._id : ""}
              onChange={(e) => {
                const employee = payRoll.find(
                  (pay) => pay._id === e.target.value
                );
                setSelectedEmployee(employee);
              }}
            >
              <option value="" disabled>
                Chọn nhân viên
              </option>
              {payRoll.map((pay) => (
                <option key={pay._id} value={pay._id}>
                  {pay.userID.fullname}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Nhập số tiền"
              className="w-full p-2 border rounded-md mb-4"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <textarea
              placeholder="Nhập ghi chú (nếu có)"
              className="w-full p-2 border rounded-md mb-4"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="flex justify-between">
              <button
                onClick={handleSubmitModal}
                className="p-2 bg-blue-500 text-white rounded-md"
              >
                Xác nhận
              </button>
              <button
                onClick={closeModal}
                className="p-2 bg-red-500 text-white rounded-md"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
      {more && <PayRollPerUser></PayRollPerUser>}
      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
    </div>
  );
};

export default PayRoll;
