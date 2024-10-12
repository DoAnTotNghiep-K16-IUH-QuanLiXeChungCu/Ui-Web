import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  addMonthlyTicket,
  getAllMonthlyTicket,
} from "../useAPI/useMonthlyTicketAPI";
import {
  FindCustomerByVehicleID,
  getAllVehicle,
} from "../useAPI/useVehicleAPI"; // Import hàm lấy thông tin khách hàng
import { formatDate } from "./../utils/FormatDate";
import { changeTypeVehicle } from "./../utils/ChangeTypeVehicle";
import MonthlyTicketModal from "./MonthlyTicketModal";
import { findCustomerByID } from "../useAPI/useCustomerAPI";
import {
  findParkingSlotByID,
  getAllParkingSlot,
} from "../useAPI/useParkingSlotAPI";
import ExtendMonthlyTicketModal from "./ExtendMonthlyTicketModal";
import Notification from "../components/Notification";

const MonthlyTicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showExtendForm, setShowExtendForm] = useState();
  const [newTickets, setNewTickets] = useState({
    vehicleId: "",
    parking_slotId: "",
    monthlyFee: 0,
    startDate: "",
    endDate: "",
  });
  const [listChoosenTickets, setListChoosenTickets] = useState([]);
  const [newEndDate, setNewEndDate] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [slots, setSlots] = useState([]);
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
  const fetchData = async () => {
    try {
      const monthlyTickets = await getAllMonthlyTicket(1); // Sử dụng await để lấy dữ liệu
      const ticketsWithCustomer = await Promise.all(
        monthlyTickets.map(async (ticket) => {
          const c = await FindCustomerByVehicleID(ticket.vehicleId._id);
          const customer = await findCustomerByID(c._id);
          const slots = await getAllParkingSlot();
          setSlots(slots);
          const parkingSlot = await findParkingSlotByID(
            ticket.parking_slotId._id
          );
          return {
            ...ticket,
            customer,
            parking_slotId: parkingSlot, // Cập nhật thông tin khu đỗ xe
          };
        })
      );
      // console.log("ticketsWithCustomer: ", ticketsWithCustomer);

      setTickets(ticketsWithCustomer || []);

      const vehilces = await getAllVehicle();
      const vehilceDetail = await Promise.all(
        vehilces.map(async (vehile) => {
          const customer = await findCustomerByID(vehile.customerId._id);
          return {
            ...vehile,
            customerId: customer, // Cập nhật thông tin khu đỗ xe
          };
        })
      );

      setVehicles(vehilceDetail || []);
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const ticketDate = new Date(ticket.startDate);
    const ticketMonth = ticketDate.getMonth() + 1;
    const ticketYear = ticketDate.getFullYear();

    const matchesMonth =
      monthFilter === "" || ticketMonth === parseInt(monthFilter);
    const matchesYear =
      yearFilter === "" || ticketYear === parseInt(yearFilter);

    const matchesSearchTerm =
      (ticket?.vehicleId?.licensePlate?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (ticket.customer &&
        (ticket?.customer?.fullName?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ));

    const matchesStatus =
      statusFilter === "" ||
      (statusFilter === "active" && new Date(ticket.endDate) >= new Date()) ||
      (statusFilter === "expired" && new Date(ticket.endDate) < new Date());

    const matchesVehicleType =
      vehicleTypeFilter === "" || ticket.vehicleId.type === vehicleTypeFilter;

    const matchesParkingSlot =
      parkingSlotFilter === "" ||
      ticket.parking_slotId.slotCode === parkingSlotFilter;
    return (
      matchesSearchTerm &&
      matchesStatus &&
      matchesVehicleType &&
      matchesParkingSlot &&
      matchesMonth &&
      matchesYear
    );
  });

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
  const handleCloseExtendModal = () => {
    setShowExtendForm(false);
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setNewTickets({ ...newTickets, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    addNewMonthlyTicket(newTickets, "Thông báo tạo vé tháng mới thành công");
    fetchData();
    setShowAddForm(false);
  };
  const addNewMonthlyTicket = async (newTicket, content) => {
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
      setShowNotification({
        content: content,
        type: "Notification",
        show: true,
      });
      // Cập nhật selectedVehicle
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
    fetchData();
    setShowExtendForm(false);
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
  // Hàm xử lý thay đổi lọc
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleVehicleTypeChange = (e) => {
    setVehicleTypeFilter(e.target.value);
  };

  const handleParkingSlotChange = (e) => {
    setParkingSlotFilter(e.target.value);
  };
  const handleCheckboxChange = (ticket) => {
    // Kiểm tra nếu vé đã có trong danh sách đã chọn
    if (listChoosenTickets.includes(ticket._id)) {
      // Nếu có, bỏ nó ra khỏi danh sách
      setListChoosenTickets(
        listChoosenTickets.filter((id) => id !== ticket._id)
      );
    } else {
      // Nếu không, thêm nó vào danh sách
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
            vehicleId: ticket.vehicleId._id, // Lấy _id của vehicleId
            parking_slotId: ticket.parking_slotId._id, // Lấy _id của parking_slotId
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

    handleCloseExtendModal();
  };
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">DANH SÁCH VÉ THÁNG</h1>
        </div>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="border p-2 rounded w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => handleExtend()}
            >
              GIA HẠN
            </button>
          </div>
        </div>
        <h2 className="text-lg font-semibold mb-4">Gia hạn vé tháng</h2>
        <div className="grid grid-cols-3">
          <div>
            <label className="block font-medium">Gia hạn đến ngày:</label>
            <input
              type="date"
              className="w-full mt-1 p-2 border rounded"
              name="newEndDate"
              value={newEndDate} // Không có children ở đây
              onChange={(e) => setNewEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="flex space-x-4 mb-4 ">
          <label className="mr-2 p-2">Tình trạng:</label>
          <select
            className="border p-2 rounded"
            value={statusFilter}
            onChange={handleStatusChange}
          >
            <option value="">Tất cả</option>
            <option value="active">Còn hiệu lực</option>
            <option value="expired">Hết hiệu lực</option>
          </select>
          <label className="p-2 mr-2 ">Loại xe:</label>
          <select
            value={vehicleTypeFilter}
            onChange={handleVehicleTypeChange}
            className="border p-2 rounded"
          >
            <option value="">Tất cả</option>
            <option value="car">Xe hơi</option>
            <option value="motor">Xe máy</option>
          </select>
          <label className="mr-2 p-2">Khu đỗ:</label>
          <select
            value={parkingSlotFilter}
            onChange={handleParkingSlotChange}
            className="border p-2 rounded"
          >
            <option value="">Tất cả</option>
            {slots.map((slot) => (
              <option key={slot._id} value={slot.slotCode}>
                {slot.slotCode}
              </option>
            ))}
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
        </div>
        <div>
          {/* Ticket Table */}
          <div className="overflow-x-auto rounded bg-gray-100 border p-4">
            <div className="h-[400px] overflow-y-scroll">
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
                  {filteredTickets.map((ticket, index) => (
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
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">
                        {ticket.vehicleId.licensePlate}
                      </td>
                      <td className="border p-2">
                        {ticket.customer ? ticket.customer.fullName : "N/A"}
                      </td>
                      <td className="border p-2">
                        {formatDate(ticket.startDate)}
                      </td>
                      <td className="border p-2">
                        {formatDate(ticket.endDate)}
                      </td>
                      <td className="border p-2">
                        {changeTypeVehicle(ticket.vehicleId.type)}
                      </td>
                      <td className="border p-2">
                        {ticket.parking_slotId.slotCode}
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
      {/* <ExtendMonthlyTicketModal
        showExtendForm={showExtendForm}
        tickets={tickets}
        slots={slots}
        handleExtendSubmit={handleExtendSubmit}
        handleCloseExtendModal={handleCloseExtendModal}
      /> */}
      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
    </div>
  );
};

export default MonthlyTicketList;
