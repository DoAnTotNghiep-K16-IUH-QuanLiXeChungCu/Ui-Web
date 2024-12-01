import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import CSS cho DatePicker
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Đăng ký các thành phần cần thiết
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ReportPerDay = () => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // Trạng thái cho ngày được chọn

  const data = [
    {
      vehicleType: "Ô tô của cư dân",
      group: "Vé lượt",
      entered: 30,
      exited: 29,
      notExited: 7,
      revenue: 800000,
    },
    {
      vehicleType: "Xe máy của cư dân",
      group: "Vé lượt",
      entered: 410,
      exited: 408,
      notExited: 30,
      revenue: 1732000,
    },
    {
      vehicleType: "Ô tô vãng lai",
      group: "Vé lượt",
      entered: 147,
      exited: 148,
      notExited: 10,
      revenue: 0,
    },
    {
      vehicleType: "Xe máy vãng lai",
      group: "Vé lượt",
      entered: 11,
      exited: 10,
      notExited: 14,
      revenue: 0,
    },
  ];

  const total = {
    monthlyTickets: {
      entered: 22,
      exited: 21,
      notExited: 16,
    },
    hourlyTickets: {
      entered: 587,
      exited: 585,
      notExited: 47,
    },
    overall: {
      entered: 609,
      exited: 606,
      notExited: 63,
    },
  };

  // Dữ liệu cho biểu đồ Bar: Số lượng xe vào/ra theo loại
  const vehicleTypeData = {
    labels: ['Ô tô của cư dân', 'Xe máy của cư dân', 'Ô tô vãng lai', 'Xe máy vãng lai'],
    datasets: [
      {
        label: 'Số lượng xe vào trong kỳ',
        data: [30, 410, 147, 11],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Số lượng xe đã ra',
        data: [29, 408, 148, 10],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Dữ liệu cho biểu đồ Pie: Doanh thu theo loại xe
  const revenueData = {
    labels: ['Ô tô của cư dân', 'Xe máy của cư dân', 'Ô tô vãng lai', 'Xe máy vãng lai'],
    datasets: [
      {
        label: 'Doanh thu',
        data: [800000, 1732000, 0, 0],
        backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FFEB33'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6">
      {/* Tiêu đề và phần chọn ngày nằm cùng một dòng */}
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold text-orange-600">
          Báo cáo doanh thu bãi xe ngày {selectedDate.toLocaleDateString()}
        </h2>
        <div>
          <label className="block font-semibold text-sm text-gray-600">Chọn ngày</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            className="mt-2 p-2 border border-gray-400 rounded"
          />
        </div>
      </div>

      {/* Cột chứa biểu đồ và bảng tổng kết */}
      <div className="flex flex-col lg:flex-row lg:space-x-6">
        {/* Cột bên trái: Biểu đồ Số lượng xe vào/ra */}
        <div className="lg:w-1/2 p-4 flex flex-col justify-between">
          <h3 className="font-semibold text-center text-lg text-gray-700 mb-5">
            Số lượng xe vào/ra theo loại
          </h3>
          <Bar data={vehicleTypeData} />
        </div>

        {/* Cột bên phải: Biểu đồ Doanh thu theo loại xe */}
        <div className="lg:w-1/2 p-4 flex flex-col justify-between">
          <h3 className="font-semibold text-center text-lg text-gray-700 mb-5">
            Doanh thu theo loại xe
          </h3>
          <div className="flex justify-center" style={{ height: '300px' }}>
            <Pie data={revenueData} />
          </div>
        </div>
      </div>

      {/* Bảng tổng kết */}
      <div className="mt-6">
        <table className="min-w-full border-collapse border border-gray-400 mb-5">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 p-2 text-sm font-semibold text-gray-700">Loại xe</th>
              <th className="border border-gray-400 p-2 text-sm font-semibold text-gray-700">Nhóm</th>
              <th className="border border-gray-400 p-2 text-sm font-semibold text-gray-700">Vào trong kỳ</th>
              <th className="border border-gray-400 p-2 text-sm font-semibold text-gray-700">Ra trong kỳ</th>
              <th className="border border-gray-400 p-2 text-sm font-semibold text-gray-700">Chưa ra</th>
              <th className="border border-gray-400 p-2 text-sm font-semibold text-gray-700">Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                <td className="border border-gray-400 p-2 text-sm">{item.vehicleType}</td>
                <td className="border border-gray-400 p-2 text-sm">{item.group}</td>
                <td className="border border-gray-400 p-2 text-sm">{item.entered}</td>
                <td className="border border-gray-400 p-2 text-sm">{item.exited}</td>
                <td className="border border-gray-400 p-2 text-sm">{item.notExited}</td>
                <td className="border border-gray-400 p-2 text-sm text-red-600">
                  {item.revenue.toLocaleString()} đ
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tổng kết */}
        <div className="mt-5 text-sm text-gray-700">
          <div className="flex justify-start">
            <div className="font-bold">Tổng Vé tháng:</div>
            <div className="ml-4">
              Vào trong kỳ: <span className="font-bold">{total.monthlyTickets.entered}</span>, Ra trong kỳ:{" "}
              <span className="font-bold">{total.monthlyTickets.exited}</span>, Chưa ra:{" "}
              <span className="font-bold">{total.monthlyTickets.notExited}</span>
            </div>
          </div>
          <div className="flex justify-start mt-2">
            <div className="font-bold">Tổng Vé lượt:</div>
            <div className="ml-6">
              Vào trong kỳ: <span className="font-bold">{total.hourlyTickets.entered}</span>, Ra trong kỳ:{" "}
              <span className="font-bold">{total.hourlyTickets.exited}</span>, Chưa ra:{" "}
              <span className="font-bold">{total.hourlyTickets.notExited}</span>
            </div>
          </div>
          <div className="flex justify-start mt-2">
            <div className="font-bold">Tổng cộng:</div>
            <div className="ml-12">
              Vào trong kỳ: <span className="font-bold">{total.overall.entered}</span>, Ra trong kỳ:{" "}
              <span className="font-bold">{total.overall.exited}</span>, Chưa ra:{" "}
              <span className="font-bold">{total.overall.notExited}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPerDay;
