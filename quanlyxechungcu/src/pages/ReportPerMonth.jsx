import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import ChartDataLabels from "chartjs-plugin-datalabels";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Đăng ký các thành phần cần thiết
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const ReportPerDay = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  // Previous month's data for percentage calculation
  const previousMonthData = {
    "Ô tô của cư dân": 750000,
    "Xe máy của cư dân": 1600000,
    "Ô tô vãng lai": 0,
    "Xe máy vãng lai": 0,
  };

  // Calculate percentage change
  const calculatePercentageChange = (currentRevenue, previousRevenue) => {
    if (previousRevenue === 0) return currentRevenue > 0 ? 100 : 0;
    const change = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    return change.toFixed(2); // Limit to 2 decimal places
  };

  const vehicleTypeData = {
    labels: ['Ô tô của cư dân', 'Xe máy của cư dân', 'Ô tô vãng lai', 'Xe máy vãng lai'],
    datasets: [
      {
        label: 'Số lượng xe vào trong kỳ',
        data: [30, 410, 147, 11],
        backgroundColor: 'rgba(255, 99, 132, 0.3)',
        borderColor: '#FF6F61',
        borderWidth: 1,
      },
      {
        label: 'Số lượng xe đã ra',
        data: [29, 408, 148, 10],
        backgroundColor: 'rgba(54, 162, 235, 0.3)',
        borderColor: '#36A2EB',
        borderWidth: 1,
      },
    ],
  };

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
    plugins: {
      datalabels: {
        formatter: (value) => `${value.toLocaleString()} đ`,
        color: '#fff',
        font: {
          weight: 'bold',
        },
        align: 'center',
        anchor: 'center',
      },
    },
  };

  const handlePrint = () => {
    const doc = new jsPDF();
    doc.text(`Báo cáo doanh thu bãi xe tháng ${selectedDate.getMonth() + 1} năm ${selectedDate.getFullYear()}`, 14, 10);
    doc.autoTable({
      head: [
        ["Loại xe", "Nhóm", "Vào trong kỳ", "Ra trong kỳ", "Chưa ra", "Doanh thu", "% Thay đổi Doanh thu"],
      ],
      body: data.map(item => [
        item.vehicleType,
        item.group,
        item.entered,
        item.exited,
        item.notExited,
        `${item.revenue.toLocaleString()} đ`,
        `${calculatePercentageChange(item.revenue, previousMonthData[item.vehicleType])} %`,
      ]),
      startY: 20,
    });
    doc.save('bao_cao_doanh_thu.pdf');
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-bold text-blue-800 text-center flex-1">
          Báo cáo doanh thu bãi xe tháng {selectedDate.getMonth() + 1} năm {selectedDate.getFullYear()}
        </h2>

        <div className="ml-4">
          <label className="block font-semibold text-sm text-gray-600">Chọn tháng/năm</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            className="mt-2 p-2 border border-blue-500 rounded"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-6">
        <div className="lg:w-1/2 p-4 flex flex-col justify-between bg-white shadow-md rounded-lg">
          <h3 className="font-semibold text-center text-2xl text-gray-700 mb-5">
            Số lượng xe vào/ra theo loại
          </h3>
          <Bar data={vehicleTypeData} />
        </div>

        <div className="lg:w-1/2 p-4 flex flex-col justify-between bg-white shadow-md rounded-lg">
          <h3 className="font-semibold text-center text-2xl text-gray-700 mb-5">
            Doanh thu theo loại xe
          </h3>
          <div className="flex justify-center" style={{ height: '340px' }}>
            <Pie data={revenueData} />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-center text-2xl text-[#FF0000] mb-4">
            Bảng dữ liệu chi tiết tháng {selectedDate.getMonth() + 1} năm {selectedDate.getFullYear()}
        </h3>
        <table className="min-w-full border-collapse border border-gray-400 mb-5 bg-white shadow-md rounded-lg">
          <thead className="bg-[#F1F1F1]">
            <tr>
              <th className="border border-gray-400 p-2 text-sm font-semibold text-gray-700">Loại xe</th>
              <th className="border border-gray-400 p-2 text-sm font-semibold text-gray-700">Nhóm</th>
              <th className="border border-gray-400 p-2 text-sm font-semibold text-gray-700">Vào trong kỳ</th>
              <th className="border border-gray-400 p-2 text-sm font-semibold text-gray-700">Ra trong kỳ</th>
              <th className="border border-gray-400 p-2 text-sm font-semibold text-gray-700">Chưa ra</th>
              <th className="border border-gray-400 p-2 text-sm font-semibold text-gray-700">Doanh thu</th>
              <th className="border border-gray-400 p-2 text-sm font-semibold text-gray-700">% Thay đổi Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-[#F9F9F9]" : ""}>
                <td className="border border-gray-400 p-2 text-sm text-gray-700 font-semibold">{item.vehicleType}</td>
                <td className="border border-gray-400 p-2 text-sm text-gray-700 font-semibold">{item.group}</td>
                <td className="border border-gray-400 p-2 text-sm text-gray-700">{item.entered}</td>
                <td className="border border-gray-400 p-2 text-sm text-gray-700">{item.exited}</td>
                <td className="border border-gray-400 p-2 text-sm text-gray-700">{item.notExited}</td>
                <td className="border border-gray-400 p-2 text-sm text-gray-700">
                  {item.revenue.toLocaleString()} đ
                </td>
                <td className="border border-gray-400 p-2 text-sm text-gray-700">
                  {calculatePercentageChange(item.revenue, previousMonthData[item.vehicleType])} %
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-5 text-sm text-gray-700">
          <div className="flex justify-start">
            <div className="font-bold text-blue-600">Tổng Vé tháng:</div>
            <div className="ml-4">
              Vào trong kỳ: <span className="font-bold">{total.monthlyTickets.entered}</span>, Ra trong kỳ:{" "}
              <span className="font-bold">{total.monthlyTickets.exited}</span>, Chưa ra:{" "}
              <span className="font-bold">{total.monthlyTickets.notExited}</span>
            </div>
          </div>
          <div className="flex justify-start mt-2">
            <div className="font-bold text-blue-600">Tổng Vé lượt:</div>
            <div className="ml-6">
              Vào trong kỳ: <span className="font-bold">{total.hourlyTickets.entered}</span>, Ra trong kỳ:{" "}
              <span className="font-bold">{total.hourlyTickets.exited}</span>, Chưa ra:{" "}
              <span className="font-bold">{total.hourlyTickets.notExited}</span>
            </div>
          </div>
          <div className="flex justify-start mt-2">
            <div className="font-bold text-blue-600">Tổng cộng:</div>
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
