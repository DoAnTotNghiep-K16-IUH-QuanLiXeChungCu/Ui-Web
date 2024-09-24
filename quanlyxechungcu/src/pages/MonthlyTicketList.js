// src/components/MonthlyTicketList.js
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const ticketsData = [
  {
    id: "03009FB17C",
    // cardNumber: 123,
    license: "59Z-128.45",
    owner: "BÙI CÔNG KHANH",
    activatedDate: "04/08/2021",
    expiryDate: "04/11/2021",
    vehicleType: "Ô tô",
    slotCode: "A.01",
    price: "1,900,000",
  },
  {
    id: "0300986AB6",
    // cardNumber: 204,
    license: "75H1-9664",
    owner: "BÙI ĐỨC THÁI",
    activatedDate: "20/09/2019",
    expiryDate: "31/10/2019",
    vehicleType: "Xe Máy",
    slotCode: "A.02",
    price: "180,000",
  },
  // Thêm nhiều ticket hơn...
];

const MonthlyTicketList = () => {
  const [tickets, setTickets] = useState(ticketsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null); // Trạng thái cho dòng được chọn

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.license.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">DANH SÁCH VÉ THÁNG</h1>
        </div>

        {/* Search and Action Buttons */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="border p-2 rounded w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex space-x-2">
            <Link
              to="./registration"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              ĐĂNG KÝ
            </Link>
            <button className="bg-red-500 text-white px-4 py-2 rounded">
              XÓA
            </button>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded">
              ĐỔI THẺ
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              GIA HẠN
            </button>
          </div>
        </div>
        <div className="flex-grow">
          <Outlet />
        </div>
        {/* Ticket Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded">
            <thead>
              <tr>
                <th className="border p-2">#</th>
                <th className="border p-2">Mã Thẻ</th>
                {/* <th className="border p-2">Số Thẻ</th> */}
                <th className="border p-2">Biển Số</th>
                <th className="border p-2">Chủ Xe</th>
                <th className="border p-2">Ngày Kích Hoạt</th>
                <th className="border p-2">Ngày Hết Hạn</th>
                <th className="border p-2">Loại xe</th>
                <th className="border p-2">Vị trí</th>
                <th className="border p-2">Giá Vé</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket, index) => (
                <tr
                  key={ticket.id}
                  className={`text-center cursor-pointer ${
                    selectedTicket && selectedTicket.id === ticket.id
                      ? "bg-gray-200"
                      : ""
                  }`}
                  onClick={() => handleRowClick(ticket)}
                >
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{ticket.id}</td>
                  {/* <td className="border p-2">{ticket.cardNumber}</td> */}
                  <td className="border p-2">{ticket.license}</td>
                  <td className="border p-2">{ticket.owner}</td>
                  <td className="border p-2">{ticket.activatedDate}</td>
                  <td className="border p-2">{ticket.expiryDate}</td>
                  <td className="border p-2">{ticket.vehicleType}</td>
                  <td className="border p-2">{ticket.slotCode}</td>
                  <td className="border p-2">{ticket.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <span>
            Từ {filteredTickets.length > 0 ? 1 : 0} đến {filteredTickets.length}{" "}
            của tổng số {tickets.length} xe tháng
          </span>
          <div className="flex space-x-1">
            <button className="px-2 py-1 bg-gray-300 rounded">1</button>
            <button className="px-2 py-1 bg-gray-300 rounded">2</button>
            {/* Thêm nhiều nút phân trang ở đây nếu cần */}
          </div>
        </div>

        {/* Hiển thị thông tin vé được chọn */}
        {selectedTicket && (
          <div className="mt-6 bg-gray-200 p-4 rounded">
            <h2 className="text-lg font-semibold">Thông tin vé được chọn:</h2>
            <p>
              <strong>Mã Thẻ:</strong> {selectedTicket.id}
            </p>
            <p>
              <strong>Biển Số:</strong> {selectedTicket.license}
            </p>
            <p>
              <strong>Chủ Xe:</strong> {selectedTicket.owner}
            </p>
            <p>
              <strong>Ngày Kích Hoạt:</strong> {selectedTicket.activatedDate}
            </p>
            <p>
              <strong>Ngày Hết Hạn:</strong> {selectedTicket.expiryDate}
            </p>
            <p>
              <strong>Loại xe:</strong> {selectedTicket.vehicleType}
            </p>
            <p>
              <strong>Vị trí:</strong> {selectedTicket.slotCode}
            </p>
            <p>
              <strong>Giá Vé:</strong> {selectedTicket.price}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyTicketList;
