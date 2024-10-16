import React from "react";

const ReportPerMonth = () => {
  const data = [
    {
      vehicleType: "Ô tô",
      ticketType: "Vé lượt",
      initialBalance: 20,
      entered: 25,
      exited: 25,
      finalBalance: 20,
      total: "1,150,000 đ",
    },
    {
      vehicleType: "Xe Tháng",
      ticketType: "Vé lượt",
      initialBalance: 0,
      entered: 0,
      exited: 0,
      finalBalance: 0,
      total: "0 đ",
    },
    // Thêm các dòng dữ liệu ở đây
    {
      vehicleType: "Tổng vé lượt",
      ticketType: "",
      initialBalance: 135,
      entered: 36,
      exited: 38,
      finalBalance: 133,
      total: "1,309,000 đ",
    },
    {
      vehicleType: "Tổng vé tháng",
      ticketType: "",
      initialBalance: 513,
      entered: 1,
      exited: 0,
      finalBalance: 514,
      total: "2,000,000 đ",
    },
    {
      vehicleType: "Tổng cộng",
      ticketType: "",
      initialBalance: 648,
      entered: 37,
      exited: 38,
      finalBalance: 647,
      total: "3,309,000 đ",
    },
  ];

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4">Thống kê</h2>
      <table className="min-w-full border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 p-2">Loại vé</th>
            <th className="border border-gray-400 p-2">Loại</th>
            <th className="border border-gray-400 p-2">Tồn đầu kỳ</th>
            <th className="border border-gray-400 p-2">Vào trong kỳ</th>
            <th className="border border-gray-400 p-2">Ra trong kỳ</th>
            <th className="border border-gray-400 p-2">Tồn cuối kỳ</th>
            <th className="border border-gray-400 p-2">Tổng tiền</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={
                index < data.length - 3 ? "hover:bg-gray-100" : "bg-gray-300"
              }
            >
              <td className="border border-gray-400 p-2">{item.vehicleType}</td>
              <td className="border border-gray-400 p-2">{item.ticketType}</td>
              <td className="border border-gray-400 p-2">
                {item.initialBalance}
              </td>
              <td className="border border-gray-400 p-2">{item.entered}</td>
              <td className="border border-gray-400 p-2">{item.exited}</td>
              <td className="border border-gray-400 p-2">
                {item.finalBalance}
              </td>
              <td className="border border-gray-400 p-2">{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportPerMonth;
