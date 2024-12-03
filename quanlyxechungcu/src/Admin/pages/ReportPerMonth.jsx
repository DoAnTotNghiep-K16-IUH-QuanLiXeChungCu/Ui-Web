import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getNumberVehicleInMonth } from "../../useAPI/useRecordAPI";
import { getTotalFeesForCurrentAndPreviousMonthResident } from "../../useAPI/useMonthlyTicketAPI";
import { getTotalFeesForCurrentAndPreviousMonth } from "../../useAPI/useParkingTransactionAPI"; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

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
  const [data, setData] = useState([]);
  const [total, setTotal] = useState({
    monthlyTickets: { entered: 0, exited: 0 },
    hourlyTickets: { entered: 0, exited: 0 },
    overall: { entered: 0, exited: 0 },
  });
  const [previousMonthData, setPreviousMonthData] = useState({
    "Ô tô của cư dân": 0,
    "Xe máy của cư dân": 0,
    "Ô tô vãng lai": 0,
    "Xe máy vãng lai": 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy dữ liệu về số lượng xe vào/ra từ API
        const apiData = await getNumberVehicleInMonth(selectedDate.getMonth() + 1, selectedDate.getFullYear());
        console.log("API data: ", apiData);

        if (apiData) {
          const formatData = (type, group, entered, exited, revenue) => ({
            vehicleType: type,
            group,
            entered: entered || 0,
            exited: exited || 0,
            revenue: revenue || 0,
          });

          setData([
            formatData("Ô tô của cư dân", "Vé lượt", apiData.resident?.carIn, apiData.resident?.carOut, apiData.resident?.carRevenue),
            formatData("Xe máy của cư dân", "Vé lượt", apiData.resident?.motorIn, apiData.resident?.motorOut, apiData.resident?.motorRevenue),
            formatData("Ô tô vãng lai", "Vé lượt", apiData.nonResident?.carIn, apiData.nonResident?.carOut, apiData.nonResident?.carRevenue),
            formatData("Xe máy vãng lai", "Vé lượt", apiData.nonResident?.motorIn, apiData.nonResident?.motorOut, apiData.nonResident?.motorRevenue),
          ]);

          setTotal({
            monthlyTickets: {
              entered: apiData.total?.totalIn || 0,
              exited: apiData.total?.totalOut || 0,
            },
            hourlyTickets: { entered: 0, exited: 0 },
            overall: {
              entered: apiData.total?.totalIn || 0,
              exited: apiData.total?.totalOut || 0,
            },
          });
        }

        // Gọi API lấy doanh thu cho cư dân
        const feesResidentData = await getTotalFeesForCurrentAndPreviousMonthResident(selectedDate.getMonth() + 1, selectedDate.getFullYear());
        if (feesResidentData) {
          setPreviousMonthData((prevData) => ({
            ...prevData,
            "Ô tô của cư dân": feesResidentData.currentMonth?.find(item => item.type === "car")?.totalFee || 0,
            "Xe máy của cư dân": feesResidentData.currentMonth?.find(item => item.type === "motor")?.totalFee || 0,
          }));
        }

        // Gọi API lấy doanh thu cho vãng lai
        const feesData = await getTotalFeesForCurrentAndPreviousMonth(selectedDate.getMonth() + 1, selectedDate.getFullYear());
        if (feesData) {
          setPreviousMonthData((prevData) => ({
            ...prevData,
            "Ô tô vãng lai": feesData.currentMonth?.find(item => item.type === "car")?.totalFee || 0,
            "Xe máy vãng lai": feesData.currentMonth?.find(item => item.type === "motor")?.totalFee || 0,
          }));
        }

      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [selectedDate]);

  const calculatePercentageChange = (currentRevenue, previousRevenue) => {
    if (previousRevenue === 0) return currentRevenue > 0 ? 100 : 0;
    const change = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    return change.toFixed(2);
  };

  const getVehicleTypeData = () => ({
    labels: ['Ô tô của cư dân', 'Xe máy của cư dân', 'Ô tô vãng lai', 'Xe máy vãng lai'],
    datasets: [
      {
        label: 'Số lượng xe vào trong kỳ',
        data: data.map(item => item.entered),
        backgroundColor: 'rgba(255, 99, 132, 0.3)',
        borderColor: '#FF6F61',
        borderWidth: 1,
      },
      {
        label: 'Số lượng xe đã ra',
        data: data.map(item => item.exited),
        backgroundColor: 'rgba(54, 162, 235, 0.3)',
        borderColor: '#36A2EB',
        borderWidth: 1,
      },
    ],
  });

  const getRevenueData = () => ({
    labels: ['Ô tô của cư dân', 'Xe máy của cư dân', 'Ô tô vãng lai', 'Xe máy vãng lai'],
    datasets: [
      {
        label: 'Doanh thu',
        data: data.map(item => item.revenue),
        backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FFEB33'],
        borderWidth: 1,
      },
    ],
    plugins: {
      datalabels: {
        formatter: value => `${value.toLocaleString()} đ`,
        color: '#fff',
        font: { weight: 'bold' },
        align: 'center',
        anchor: 'center',
      },
    },
  });

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-bold text-[#FF0000] text-center flex-1">
          Báo cáo doanh thu bãi xe tháng {selectedDate.getMonth() + 1} năm {selectedDate.getFullYear()}
        </h2>
        <div className="ml-4">
          <label className="block font-semibold text-sm text-gray-600">Chọn tháng/năm</label>
          <DatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            className="mt-2 p-2 border border-blue-500 rounded"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-6">
        <div className="lg:w-1/2 p-4 bg-white shadow-md rounded-lg">
          <h3 className="font-semibold text-center text-2xl text-gray-700 mb-5">Số lượng xe vào/ra theo loại</h3>
          <Bar data={getVehicleTypeData()} />
        </div>
        <div className="lg:w-1/2 p-4 bg-white shadow-md rounded-lg">
          <h3 className="font-semibold text-center text-2xl text-gray-700 mb-5">Doanh thu theo loại xe</h3>
          <div className="flex justify-center" style={{ height: '340px' }}>
            <Pie data={getRevenueData()} />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-center text-2xl text-[#FF0000] mb-4">Bảng dữ liệu chi tiết</h3>
        <table className="min-w-full border-collapse border border-gray-400 mb-5 bg-white shadow-md rounded-lg">
          <thead className="bg-[#F1F1F1]">
            <tr>
              {['Loại xe', 'Nhóm', 'Vào trong kỳ', 'Ra trong kỳ', 'Doanh thu', '% Thay đổi Doanh thu'].map((header, idx) => (
                <th key={idx} className="border border-gray-400 p-2 text-sm font-semibold text-gray-700">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-[#F9F9F9]" : ""}>
                <td className="border border-gray-400 p-2 text-sm text-gray-700 font-semibold">{item.vehicleType}</td>
                <td className="border border-gray-400 p-2 text-sm text-gray-700 font-semibold">{item.group}</td>
                <td className="border border-gray-400 p-2 text-sm text-gray-700">{item.entered}</td>
                <td className="border border-gray-400 p-2 text-sm text-gray-700">{item.exited}</td>
                <td className="border border-gray-400 p-2 text-sm text-gray-700">{item.revenue.toLocaleString()} đ</td>
                <td className="border border-gray-400 p-2 text-sm text-gray-700">
                  {calculatePercentageChange(item.revenue, previousMonthData[item.vehicleType])} %
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-5 text-sm text-gray-700">
          {['Tổng Vé tháng'].map((label, idx) => (
            <div className="flex justify-start mt-2" key={idx}>
              <div className="font-bold text-blue-600">{label}:</div>
              <div className="ml-4">
                Vào trong kỳ: <span className="font-bold">{total.monthlyTickets.entered}</span>, Ra trong kỳ:{" "}
                <span className="font-bold">{total.monthlyTickets.exited}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportPerDay;
