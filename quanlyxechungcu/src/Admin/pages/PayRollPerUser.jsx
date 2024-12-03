import React, { useEffect, useState } from "react";
import { GetPayRollByYearAndUserID } from "../../useAPI/usePayRollAPI";
import { getAllUser } from "../../useAPI/useUserAPI";
import * as XLSX from "xlsx";
import { Bar } from "react-chartjs-2";

const PayRollPerUser = () => {
  const [payRoll, setPayRoll] = useState([]);
  const [selectedPay, setSelectedPay] = useState(null); // Initialize as null
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  // Fetch payroll data based on selected user and year
  const fetchUserData = async () => {
    const fetchedUsers = await getAllUser();
    console.log("fetchedUsers", fetchedUsers);
    setUsers(fetchedUsers);
    setSelectedUser(fetchedUsers[0]); // Set initial user
  };
  useEffect(() => {
    fetchUserData();
  }, []);
  const fetchData = async (userId, year) => {
    try {
      const payrollData = await GetPayRollByYearAndUserID(year, userId);
      setPayRoll(payrollData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Call fetchData when user or year changes
  useEffect(() => {
    if (selectedUser) {
      fetchData(selectedUser, selectedYear);
    }
  }, [selectedUser, selectedYear]);

  // Process data for chart
  // Tính toán tổng lương cho từng tháng
  const chartData = payRoll.reduce(
    (acc, item) => {
      const month = new Date(item.payPeriod).getMonth(); // Lấy chỉ số tháng (0-11)

      // Tính tổng các loại lương cho mỗi tháng
      acc.totalSalaries[month] += item.totalSalary;
      acc.basicSalaries[month] += item.basicSalary;
      acc.overtimeSalaries[month] += item.overtimeSalary;
      acc.deductions[month] += item.deductions;

      return acc;
    },
    {
      totalSalaries: Array(12).fill(0),
      basicSalaries: Array(12).fill(0),
      overtimeSalaries: Array(12).fill(0),
      deductions: Array(12).fill(0),
    }
  );

  // Dữ liệu cho biểu đồ
  const dataForChart = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Lương trong ca",
        data: chartData.basicSalaries, // Dữ liệu từ chartData
        backgroundColor: "rgba(75, 192, 192, 1)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Lương làm ngoài giờ",
        data: chartData.overtimeSalaries, // Dữ liệu từ chartData
        backgroundColor: "rgba(153, 102, 255, 1)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
      {
        label: "Tiền trừ",
        data: chartData.deductions, // Dữ liệu từ chartData
        backgroundColor: "rgba(255, 159, 64, 1)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
  };

  const handleClick = (pay) => {
    setSelectedPay(pay); // Set selectedPay on click
  };
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      payRoll.map((pay) => ({
        Tháng: new Date(pay?.payPeriod).toLocaleString("vi-VN", {
          month: "long",
          year: "numeric",
        }),
        "Số giờ làm trong ca": pay.totalRegularHours,
        "Số giờ làm tăng ca": pay.totalOvertimeHours,
        "Tiền theo ca": pay.basicSalary,
        "Tiền làm tăng ca": pay.overtimeSalary,
        "Tiền phạt": pay.deductions,
        "Trợ cấp": pay.allowance,
        "Tổng tiền": pay.totalSalary,
        "Ghi chú": pay?.note
          ? pay.note.replace(/\n/g, " ").replace(/\r?\n/g, " ")
          : "", // Đảm bảo thay thế xuống dòng phù hợp
      }))
    );
    console.log("selectedUser", selectedUser);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      ws,
      `Lương ${selectedUser?.fullname} năm ${selectedYear}`
    );
    XLSX.writeFile(wb, "payroll.xlsx");
  };
  const handleSelectedUser = (e) => {
    const selectedUserId = e.target.value;
    const user = users.find((user) => user._id === selectedUserId);
    setSelectedUser(user);
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">
          Lương năm {selectedYear} của nhân viên{" "}
          {selectedUser?.fullname || "Chưa chọn nhân viên"}
        </h1>

        {/* User Selector */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 justify-between">
          <div className="flex flex-row">
            <div className="flex flex-col mr-3">
              <label className="text-gray-600 font-medium">
                Chọn nhân viên
              </label>
              <select
                className="border border-gray-300 p-2 rounded"
                value={selectedUser?._id || ""}
                onChange={handleSelectedUser}
              >
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.fullname}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium">Chọn năm</label>
              <select
                className="border border-gray-300 p-2 rounded"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {[2023, 2024, 2025].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            className="ml-4 p-2 bg-green-500 text-white rounded-md"
            onClick={exportToExcel} // Export to Excel
          >
            Xuất file Excel
          </button>
        </div>

        {/* Chart */}
        <div className="grid grid-cols-12">
          <div className="mb-3 col-span-9 mr-3 h-96">
            <Bar data={dataForChart} options={chartOptions} />
          </div>
          <div className="mb-4 col-span-3">
            <p>
              Ghi chú{" "}
              <span className="font-bold">
                {selectedPay
                  ? new Date(selectedPay?.payPeriod).toLocaleString("vi-VN", {
                      month: "long",
                      year: "numeric",
                    })
                  : ""}
              </span>
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

        {/* Payroll Table */}
        <div className="bg-white p-4 rounded shadow mt-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Chi tiết</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-300">
                <th className="p-4 text-left border">Tháng</th>
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
              {payRoll.map((item) => (
                <tr key={item._id} className="hover:bg-gray-100">
                  <td className="p-4 border">
                    {new Date(item.payPeriod).toLocaleString("vi-VN", {
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-4 border">{item.totalRegularHours}</td>
                  <td className="p-4 border">{item.totalOvertimeHours}</td>
                  <td className="p-4 border">
                    {item.basicSalary?.toLocaleString() || "0"}
                  </td>
                  <td className="p-4 border">
                    {item.overtimeSalary?.toLocaleString() || "0"}
                  </td>
                  <td className="p-4 border">
                    {item.deductions?.toLocaleString() || "0"}
                  </td>
                  <td className="p-4 border">
                    {item.allowance?.toLocaleString() || "0"}
                  </td>
                  <td className="p-4 border">
                    {item.totalSalary?.toLocaleString() || "0"}
                  </td>
                  <td
                    className="p-4 border cursor-pointer text-blue-600"
                    onClick={() => handleClick(item)}
                  >
                    {item.note ? "Xem ghi chú" : "Chưa có ghi chú"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PayRollPerUser;
