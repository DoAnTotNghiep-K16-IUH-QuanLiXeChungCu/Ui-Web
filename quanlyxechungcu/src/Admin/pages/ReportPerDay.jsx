import React from "react";

const ReportPerDay = () => {
  const data = [
    {
      vehicleType: "Ô tô",
      group: "Vé lượt",
      initialBalance: 6,
      entered: 30,
      exited: 29,
      notExited: 7,
      revenue: "800,000 đ",
    },
    {
      vehicleType: "Xe Máy",
      group: "Vé lượt",
      initialBalance: 28,
      entered: 410,
      exited: 408,
      notExited: 30,
      revenue: "1,732,000 đ",
    },
    {
      vehicleType: "Nhà Thầu Lavita Charm",
      group: "Vé lượt",
      initialBalance: 11,
      entered: 147,
      exited: 148,
      notExited: 10,
      revenue: "0 đ",
    },
    {
      vehicleType: "Ô tô",
      group: "Vé tháng",
      initialBalance: 13,
      entered: 11,
      exited: 10,
      notExited: 14,
      revenue: "0 đ",
    },
    {
      vehicleType: "Xe Máy",
      group: "Vé tháng",
      initialBalance: 2,
      entered: 11,
      exited: 11,
      notExited: 2,
      revenue: "0 đ",
    },
    {
      vehicleType: "Nhà Thầu Lavita Charm",
      group: "Vé tháng",
      initialBalance: 0,
      entered: 0,
      exited: 0,
      notExited: 0,
      revenue: "0 đ",
    },
  ];

  const total = {
    monthlyTickets: {
      initialBalance: 15,
      entered: 22,
      exited: 21,
      notExited: 16,
    },
    hourlyTickets: {
      initialBalance: 45,
      entered: 587,
      exited: 585,
      notExited: 47,
    },
    overall: { initialBalance: 60, entered: 609, exited: 606, notExited: 63 },
  };

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4 text-orange-600">
        Báo cáo doanh thu bãi xe ngày 27/05/2021
      </h2>
      <table className="min-w-full border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 p-2">Loại xe</th>
            <th className="border border-gray-400 p-2">Nhóm</th>
            <th className="border border-gray-400 p-2">Tồn đầu kỳ</th>
            <th className="border border-gray-400 p-2">Vào trong kỳ</th>
            <th className="border border-gray-400 p-2">Ra trong kỳ</th>
            <th className="border border-gray-400 p-2">Chưa ra</th>
            <th className="border border-gray-400 p-2">Doanh thu</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "hover:bg-gray-100" : ""}
            >
              <td className="border border-gray-400 p-2">{item.vehicleType}</td>
              <td className="border border-gray-400 p-2">{item.group}</td>
              <td className="border border-gray-400 p-2">
                {item.initialBalance}
              </td>
              <td className="border border-gray-400 p-2">{item.entered}</td>
              <td className="border border-gray-400 p-2">{item.exited}</td>
              <td className="border border-gray-400 p-2">{item.notExited}</td>
              <td className="border border-gray-400 p-2 text-red-600">
                {item.revenue}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-5">
        <div className="font-bold">Tổng Vé tháng:</div>
        <div className="ml-5">
          Tồn đầu kỳ: {total.monthlyTickets.initialBalance}, Vào trong kỳ:{" "}
          {total.monthlyTickets.entered}, Ra trong kỳ:{" "}
          {total.monthlyTickets.exited}, Chưa ra:{" "}
          {total.monthlyTickets.notExited}
        </div>
        <div className="font-bold">Tổng Vé lượt:</div>
        <div className="ml-5">
          Tồn đầu kỳ: {total.hourlyTickets.initialBalance}, Vào trong kỳ:{" "}
          {total.hourlyTickets.entered}, Ra trong kỳ:{" "}
          {total.hourlyTickets.exited}, Chưa ra: {total.hourlyTickets.notExited}
        </div>
        <div className="font-bold">Tổng cộng:</div>
        <div className="ml-5">
          Tồn đầu kỳ: {total.overall.initialBalance}, Vào trong kỳ:{" "}
          {total.overall.entered}, Ra trong kỳ: {total.overall.exited}, Chưa ra:{" "}
          {total.overall.notExited}
        </div>
      </div>
    </div>
  );
};

export default ReportPerDay;
