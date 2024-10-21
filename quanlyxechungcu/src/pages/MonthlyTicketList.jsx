import React, { useContext, useEffect, useState } from "react";
import {
  addMonthlyTicket,
  filterMonthlyTicket,
} from "../useAPI/useMonthlyTicketAPI";
import { formatDate } from "../utils/index";
import { changeTypeVehicle } from "../utils/index";
import MonthlyTicketModal from "./MonthlyTicketModal";
import Notification from "../components/Notification";
import UserContext from "../context/UserContext";
import { getData, saveData } from "../context/indexedDB";

const MonthlyTicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(tickets.length / pageSize);
  const [searchTerm, setSearchTerm] = useState(""); // Kích thước trang

  const [filteredTickets, setFilteredTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTickets, setNewTickets] = useState({
    vehicleId: "",
    parking_slotId: "",
    monthlyFee: 0,
    startDate: "",
    endDate: "",
  });
  const [listChoosenTickets, setListChoosenTickets] = useState([]);
  const [newEndDate, setNewEndDate] = useState("");
  const [showExtend, setShowExtend] = useState(false);

  //// Filter
  const [statusFilter, setStatusFilter] = useState(""); // State cho tình trạng
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState(""); // State cho loại xe
  const [parkingSlotFilter, setParkingSlotFilter] = useState(""); // State cho khu
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const data = await getData("userData");
        if (data) {
          setTickets(data.tickets);
          setVehicles(data.vehicles);
          console.log("vehicles", data.vehicles);
        } else {
        }
      } catch (err) {
        console.error("Failed to get Tickets data:", err);
      }
    };
    fetchTicketData(); // Gọi hàm để lấy dữ liệu
  }, []);
  const handleRowClick = (ticket) => {
    if (selectedTicket && selectedTicket._id === ticket._id) {
      setSelectedTicket(null);
    } else {
      setSelectedTicket(ticket);
    }
  };

  const handleAddClick = () => {
    setNewTickets(null);
    setShowAddForm(true);
  };

  const handleCloseModal = () => {
    setShowAddForm(false);
  };
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setNewTickets({ ...newTickets, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    addNewMonthlyTicket(newTickets, "Thông báo tạo vé tháng mới thành công");
    setShowAddForm(false);
  };
  const addNewMonthlyTicket = async (newTicket, content) => {
    console.log("newTicket______", newTicket);

    if (newTicket.monthlyFee <= 0) {
      setShowNotification({
        content: "Phí không được <0",
        type: "Error",
        show: true,
      });
      return; // Không tiếp tục nếu giá vé không hợp lệ
    }

    const addTicket = await addMonthlyTicket(newTicket);
    if (addTicket._id) {
      setTickets((prev) => [...prev, addTicket]);
      const data = await getData("userData");
      if (data) {
        await saveData({
          id: "userData",
          ...data,
          tickets: [...data.tickets, addTicket], // Cập nhật danh sách thẻ mới
        });
      }
      setSelectedTicket(addTicket);
      setShowNotification({
        content: content,
        type: "Notification",
        show: true,
      });
    } else {
      setShowNotification({
        content: addTicket,
        type: "Error",
        show: true,
      });
    }
  };
  const handleExtendSubmit = async (listTicket) => {
    // Tạo một mảng các promise để thêm vé tháng mới
    const ticketPromises = listTicket.map(async (ticket) => {
      await addNewMonthlyTicket(ticket, "Thông báo danh sách đã được gia hạn"); // Gọi hàm thêm vé tháng cho từng ticket
    });
    await Promise.all(ticketPromises);
    setListChoosenTickets([]);
    setShowExtend(false);
  };

  const handleDeleteTicket = async (id) => {
    if (!id) {
      console.error("ID của xe không hợp lệ");
      return;
    }
    try {
      setTickets((prev) => prev.filter((ticket) => ticket._id !== id));
      setSelectedTicket(null);
      console.log(`Vé với ID ${id} đã được xóa thành công.`);
    } catch (error) {
      console.error("Có lỗi khi xóa xe:", error);
    }
  };
  const handleCheckboxChange = (ticket) => {
    if (listChoosenTickets.includes(ticket._id)) {
      setListChoosenTickets(
        listChoosenTickets.filter((id) => id !== ticket._id)
      );
    } else {
      setListChoosenTickets([...listChoosenTickets, ticket._id]);
    }
  };
  const handleExtend = async () => {
    // Kiểm tra nếu ngày gia hạn không có
    if (!newEndDate) {
      setShowNotification({
        content: "Vui lòng chọn ngày gia hạn",
        type: "Error",
        show: true,
      });
      return;
    }

    // Cập nhật các vé đã chọn
    const updatedTickets = await Promise.all(
      listChoosenTickets.map(async (ticketId) => {
        const ticket = tickets.find((t) => t._id === ticketId);
        if (ticket) {
          // Chuyển đổi dữ liệu về định dạng mong muốn
          const transformedTicket = {
            vehicleId: ticket.vehicle._id, // Lấy _id của vehicleId
            parking_slotId: ticket.parkingSlot._id, // Lấy _id của parking_slotId
            monthlyFee: ticket.monthlyFee, // Số tiền hàng tháng
            startDate: new Date().toISOString().split("T")[0],
            endDate: newEndDate, // Đặt endDate là ngày gia hạn mới
          };
          return transformedTicket;
        }
        return null;
      })
    );

    const validUpdatedTickets = updatedTickets.filter(
      (ticket) => ticket !== null
    );

    handleExtendSubmit(validUpdatedTickets);
  };
  // Lọc và phân trang
  const applyPaginationAndFilter = () => {
    let filtered = tickets.filter((ticket) => {
      const matchesStatusFilter =
        statusFilter === "" || ticket.isExpired === (statusFilter === "true");

      const matchesVehicleTypeFilter =
        vehicleTypeFilter === "" || ticket.vehicle?.type === vehicleTypeFilter;

      const matchesParkingSlotFilter =
        parkingSlotFilter === "" ||
        ticket.parkingSlot?.slotCode === parkingSlotFilter;

      const matchesMonthFilter =
        monthFilter === "" ||
        new Date(ticket.startDate).getMonth() + 1 === parseInt(monthFilter) ||
        new Date(ticket.endDate).getMonth() + 1 === parseInt(monthFilter);

      const matchesYearFilter =
        yearFilter === "" ||
        new Date(ticket.startDate).getFullYear() === parseInt(yearFilter) ||
        new Date(ticket.endDate).getFullYear() === parseInt(yearFilter);

      return (
        matchesStatusFilter &&
        matchesVehicleTypeFilter &&
        matchesParkingSlotFilter &&
        matchesMonthFilter &&
        matchesYearFilter
      );
    });

    // Tìm kiếm theo từ khóa
    filtered = filtered.filter(
      (ticket) =>
        ticket.vehicle?.customer?.fullName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        ticket.vehicle?.licensePlate
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

    // Cập nhật vé đã lọc và áp dụng phân trang
    setFilteredTickets(filtered);
    setCurrentPage(1); // Reset trang về 1 khi filter
  };

  const currentTickets = filteredTickets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  useEffect(() => {
    applyPaginationAndFilter();
  }, [
    tickets,
    statusFilter,
    vehicleTypeFilter,
    parkingSlotFilter,
    monthFilter,
    yearFilter,
    searchTerm,
  ]);
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">DANH SÁCH VÉ THÁNG</h1>
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="border p-2 rounded w-[500px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex justify-end items-center mb-4">
          <div className="flex space-x-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleAddClick}
            >
              THÊM
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => handleDeleteTicket(selectedTicket?._id)}
            >
              XÓA
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded"
              onClick={() => setShowExtend(true)}
            >
              GIA HẠN
            </button>
          </div>
        </div>
        {showExtend && (
          <div className="my-1">
            <h2 className="text-lg font-semibold mb-4">Gia hạn vé tháng</h2>
            <div className="flex space-x-4 mb-4 ">
              <label className="block font-medium mr-2 p-2">
                Gia hạn đến ngày:
              </label>
              <input
                type="date"
                className="border p-2 rounded"
                name="newEndDate"
                value={newEndDate} // Không có children ở đây
                onChange={(e) => setNewEndDate(e.target.value)}
              />
            </div>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => handleExtend()}
            >
              XÁC NHẬN
            </button>
          </div>
        )}
        <div className="flex space-x-4 mb-4 ">
          <label className="mr-2 p-2">Tình trạng:</label>
          <select
            className="border p-2 rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="false">Còn hiệu lực</option>
            <option value="true">Hết hiệu lực</option>
          </select>
          <label className="p-2 mr-2 ">Loại xe:</label>
          <select
            value={vehicleTypeFilter}
            onChange={(e) => setVehicleTypeFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Tất cả</option>
            <option value="car">Xe hơi</option>
            <option value="motor">Xe máy</option>
          </select>
          <label className="mr-2 p-2">Khu đỗ:</label>
          <select
            value={parkingSlotFilter}
            onChange={(e) => setParkingSlotFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Tất cả</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="C">D</option>
          </select>
          <label className="p-2 mr-2 ">Tháng:</label>
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Tất cả</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <label className="p-2 mr-2 ">Năm:</label>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Tất cả</option>
            {Array.from({ length: 10 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => applyPaginationAndFilter()}
          >
            TÌM
          </button>
        </div>
        <div>
          {/* Ticket Table */}
          <div className="overflow-x-auto rounded bg-gray-100 border p-4">
            <table className="min-w-full bg-white border rounded">
              <thead>
                <tr className="bg-slate-300">
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10"></th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    #
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Biển Số
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Chủ Xe
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Ngày Kích Hoạt
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Ngày Hết Hạn
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Loại xe
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Khu
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Giá Vé
                  </th>
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Tình trạng
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentTickets.map((ticket, index) => (
                  <tr
                    key={ticket._id}
                    className={`text-center cursor-pointer ${
                      selectedTicket && selectedTicket._id === ticket._id
                        ? "bg-gray-200"
                        : ""
                    }`}
                    onClick={() => handleRowClick(ticket)}
                  >
                    <td className="border p-2">
                      <input
                        type="checkbox"
                        checked={listChoosenTickets.includes(ticket._id)}
                        onChange={() => handleCheckboxChange(ticket)}
                      />
                    </td>
                    <td className="border p-2">
                      {index + 1 + (currentPage - 1) * pageSize}
                    </td>
                    <td className="border p-2">
                      {ticket.vehicle.licensePlate}
                    </td>
                    <td className="border p-2">
                      {ticket.vehicle.customer
                        ? ticket.vehicle.customer.fullName
                        : "N/A"}
                    </td>
                    <td className="border p-2">
                      {formatDate(ticket.startDate)}
                    </td>
                    <td className="border p-2">{formatDate(ticket.endDate)}</td>
                    <td className="border p-2">
                      {changeTypeVehicle(ticket.vehicle.type)}
                    </td>
                    <td className="border p-2">
                      {ticket.parkingSlot.slotCode}
                    </td>
                    <td className="border p-2">{ticket.monthlyFee}</td>
                    <td className="border p-2">
                      {new Date(ticket.endDate) < new Date() ? (
                        "Hết hạn"
                      ) : (
                        <span>
                          Còn{" "}
                          {Math.ceil(
                            (new Date(ticket.endDate) - new Date()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          ngày
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between mt-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Trang trước
              </button>
              <span>{`Trang ${currentPage} / ${totalPages}`}</span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Trang sau
              </button>
            </div>
          </div>
        </div>
      </div>
      <MonthlyTicketModal
        showAddForm={showAddForm}
        newTickets={newTickets}
        vehicles={vehicles}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        handleCloseModal={handleCloseModal}
      />

      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
    </div>
  );
};

export default MonthlyTicketList;
