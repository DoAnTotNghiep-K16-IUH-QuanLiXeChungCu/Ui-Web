import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import "react-datepicker/dist/react-datepicker.css";
import { getVehicleStatsForToday } from "../../useAPI/useRecordAPI";
import { getTotalFeesForTodayResident } from "../../useAPI/useMonthlyTicketAPI";
import { getTotalFeesForToday } from "../../useAPI/useParkingTransactionAPI"; 
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

// Đăng ký các thành phần cần thiết cho chart.js
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
  const [data, setData] = useState([]);
  const [total, setTotal] = useState({ monthlyTickets: { entered: 0, exited: 0 } });

  // Hàm xử lý lấy và cập nhật dữ liệu
  const fetchData = async () => {
    try {
      // Lấy dữ liệu về số lượng xe vào/ra từ API
      const apiData = await getVehicleStatsForToday();
  
      if (apiData) {
        const formatData = (type, group, entered = 0, exited = 0, revenue = 0) => ({
          vehicleType: type,
          group,
          entered,
          exited,
          revenue,
        });
  
        setData([
          formatData("Ô tô của cư dân", "Vé lượt", apiData.resident?.carIn, apiData.resident?.carOut, apiData.resident?.carRevenue),
          formatData("Xe máy của cư dân", "Vé lượt", apiData.resident?.motorIn, apiData.resident?.motorOut, apiData.resident?.motorRevenue),
          formatData("Ô tô vãng lai", "Vé lượt", apiData.nonResident?.carIn, apiData.nonResident?.carOut, apiData.nonResident?.carRevenue),
          formatData("Xe máy vãng lai", "Vé lượt", apiData.nonResident?.motorIn, apiData.nonResident?.motorOut, apiData.nonResident?.motorRevenue),
        ]);
      }
  
      // Lấy dữ liệu doanh thu cho cư dân từ API
      const feesResidentData = await getTotalFeesForTodayResident();
  
      if (feesResidentData && feesResidentData.data && Array.isArray(feesResidentData.data.today)) {
        setData(prevData =>
          prevData.map(item => {
            if (item.vehicleType === "Ô tô của cư dân") {
              const carData = feesResidentData.data.today.find(i => i.type === "car");
              return { ...item, revenue: carData?.totalFee || 0 };
            }
            if (item.vehicleType === "Xe máy của cư dân") {
              const motorData = feesResidentData.data.today.find(i => i.type === "motor");
              return { ...item, revenue: motorData?.totalFee || 0 };
            }
            return item;
          })
        );
      } else {
        console.error("Dữ liệu không hợp lệ từ API feesResidentData");
      }
  
      // Lấy dữ liệu doanh thu cho vãng lai từ API
      const feesData = await getTotalFeesForToday();
  
      if (feesData && feesData.data && Array.isArray(feesData.data.today)) {
        setData(prevData =>
          prevData.map(item => {
            if (item.vehicleType === "Ô tô vãng lai") {
              const carData = feesData.data.today.find(i => i.type === "car");
              return { ...item, revenue: carData?.totalFee || 0 };
            }
            if (item.vehicleType === "Xe máy vãng lai") {
              const motorData = feesData.data.today.find(i => i.type === "motor");
              return { ...item, revenue: motorData?.totalFee || 0 };
            }
            return item;
          })
        );
      } else {
        console.error("Dữ liệu không hợp lệ từ API feesData");
      }

      // Set the total counts for vehicles entering and exiting
      const totalEntered = apiData?.resident?.carIn + apiData?.resident?.motorIn + apiData?.nonResident?.carIn + apiData?.nonResident?.motorIn;
      const totalExited = apiData?.resident?.carOut + apiData?.resident?.motorOut + apiData?.nonResident?.carOut + apiData?.nonResident?.motorOut;
      setTotal({ monthlyTickets: { entered: totalEntered, exited: totalExited } });
  
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };  

  useEffect(() => {
    fetchData();
  }, []);

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

  const getRevenueData = () => {
    const filteredData = data.filter(item => item.revenue > 0);
    return {
      labels: filteredData.map(item => item.vehicleType),
      datasets: [
        {
          label: 'Doanh thu',
          data: filteredData.length > 0 ? filteredData.map(item => item.revenue) : [0],
          backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FFEB33'].slice(0, filteredData.length),
          borderWidth: 1,
        },
      ],
      plugins: {
        datalabels: {
          formatter: (value) => `${value.toLocaleString()} đ`,
          color: '#fff',
          font: { weight: 'bold' },
          align: 'center',
          anchor: 'center',
        },
      },
    };
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-bold text-[#FF0000] text-center flex-1">
          Báo cáo doanh thu bãi xe ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row lg:space-x-6">
        <div className="lg:w-1/2 p-4 flex flex-col justify-between bg-white shadow-md rounded-lg">
          <h3 className="font-semibold text-center text-2xl text-gray-700 mb-5">
            Số lượng xe vào/ra theo loại
          </h3>
          <Bar data={getVehicleTypeData()} />
        </div>

        <div className="lg:w-1/2 p-4 flex flex-col justify-between bg-white shadow-md rounded-lg">
          <h3 className="font-semibold text-center text-2xl text-gray-700 mb-5">
            Doanh thu theo loại xe
          </h3>
          <div className="flex justify-center" style={{ height: '340px' }}>
            <Pie data={getRevenueData()} />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-center text-2xl text-[#FF0000] mb-4">
          Doanh thu theo loại xe vào ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
        </h3>
        <table className="min-w-full border-collapse border border-gray-400 mb-5 bg-white shadow-md rounded-lg">
          <thead className="bg-[#F1F1F1]">
            <tr>
              <th className="border border-gray-400 p-2 text-sm font-semibold text-gray-700">Loại xe</th>
              <th className="border border-gray-400 p-2 text-sm font-semibold text-gray-700">Nhóm</th>
              <th className="border border-gray-400 p-2 text-sm font-semibold text-gray-700">Số xe vào</th>
              <th className="border border-gray-400 p-2 text-sm font-semibold text-gray-700">Số xe ra</th>
              <th className="border border-gray-400 p-2 text-sm font-semibold text-gray-700">Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-400 p-2 text-sm text-center">{item.vehicleType}</td>
                <td className="border border-gray-400 p-2 text-sm text-center">{item.group}</td>
                <td className="border border-gray-400 p-2 text-sm text-center">{item.entered}</td>
                <td className="border border-gray-400 p-2 text-sm text-center">{item.exited}</td>
                <td className="border border-gray-400 p-2 text-sm text-center">{item.revenue.toLocaleString()} đ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer for totals */}
      <div className="mt-6 p-4 bg-white shadow-md rounded-lg">
        <h3 className="font-semibold text-center text-2xl text-[#FF0000] mb-4">
          Tổng kết
        </h3>
        <div className="flex justify-between text-sm text-gray-700">
          <div>
            <strong>Số xe vào:</strong> {total.monthlyTickets.entered}
          </div>
          <div>
            <strong>Số xe ra:</strong> {total.monthlyTickets.exited}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPerDay;
