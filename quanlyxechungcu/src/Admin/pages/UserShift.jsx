import React, { useState, useEffect, useContext } from "react";
import Notification from "../components/Notification";
import { addDays, startOfWeek, format, addWeeks } from "date-fns";
import {
  addUserShift,
  deleteUserShift,
  filterUserShift,
  getAllUserShift,
  updateUserShift,
} from "../../useAPI/useUserShiftAPI";
import UserShiftModal from "./UserShiftModal";
import { getAllShift } from "../../useAPI/useShiftAPI";
import { getAllUser } from "../../useAPI/useUserAPI";
import Loading from "./../components/Loading";

const UserShift = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }) // Thay đổi ở đây
  );
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  const [dateFilter, setDateFilter] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [userShiftsHere, setUserShiftsHere] = useState([]);
  const [dateShift, setDateShift] = useState([]);
  const [selectedUserShift, setSelectedUserShift] = useState({
    id: "",
    userId: "",
    shiftId: "",
    dateTime: "",
    fullname: "",
    shiftName: "",
  });

  const [newUserShift, setNewUserShift] = useState({
    userId: "",
    shiftId: "",
    dateTime: "",
    fullname: "",
  });

  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [userShifts, setUserShifts] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [highlightedUser, setHighlightedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        const shifts = await getAllShift();
        setShifts(shifts);
        const users = await getAllUser();
        setUsers(users);
        const userShifts = await getAllUserShift();
        setUserShifts(userShifts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const daysInWeek = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );

  useEffect(() => {
    filterUserShiftsForWeek(currentWeekStart);
  }, [currentWeekStart, userShifts]);

  const filterUserShiftsForWeek = async (weekStart) => {
    const weekStartDate = new Date(weekStart); // Chuyển weekStart thành đối tượng Date
    const weekEndDate = addDays(weekStartDate, 6); // Ngày Chủ nhật
    const filUserShift = await filterUserShift(weekStartDate, weekEndDate);
    // console.log("filUserShift", filUserShift);
    setUserShiftsHere(filUserShift);
  };

  const handleNextWeek = () => {
    const nextWeek = addWeeks(currentWeekStart, 1);
    setCurrentWeekStart(nextWeek);
    filterUserShiftsForWeek(nextWeek);
  };

  const handlePreviousWeek = () => {
    const prevWeek = addWeeks(currentWeekStart, -1);
    setCurrentWeekStart(prevWeek);
    filterUserShiftsForWeek(prevWeek);
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    setDateFilter(e.target.value);
    setCurrentWeekStart(startOfWeek(selectedDate));
    filterUserShiftsForWeek(startOfWeek(selectedDate));
  };

  const handleTodayClick = () => {
    setCurrentWeekStart(startOfWeek(new Date()));
    setDateFilter(""); // Reset date filter input
    filterUserShiftsForWeek(startOfWeek(new Date()));
  };

  // Function to get shift for a specific day and time
  const getShiftForDayAndTime = (day, shiftName) => {
    const dayStr = format(day, "yyyy-MM-dd");
    if (!Array.isArray(userShiftsHere) || userShiftsHere.length === 0) {
      return [];
    }
    const shifts = userShiftsHere.filter(
      (s) =>
        format(new Date(s.dateTime), "yyyy-MM-dd") === dayStr &&
        s.shiftId.shiftName === shiftName
    );

    // Trả về kết quả hoặc mảng rỗng nếu không tìm thấy
    return shifts.length > 0 ? shifts : [];
  };

  // Handle shift selection
  const handleShiftClick = (shift, day) => {
    const selectedShiftData = getShiftForDayAndTime(day, shift.shiftName);
    if (selectedShiftData) {
      if (selectedShiftData.length === 1) {
        setSelectedUserShift({
          id: selectedShiftData[0]._id,
          userId: selectedShiftData[0].userId._id,
          shiftId: selectedShiftData[0].shiftId._id,
          dateTime: format(day, "yyyy-MM-dd"),
          fullname: selectedShiftData[0]?.userId?.fullname,
          shiftName: selectedShiftData[0].shiftId.shiftName,
        });
      } else if (selectedShiftData.length > 1) {
        // console.log("selectedShiftData", selectedShiftData);
        // console.log("selectedUser", selectedUser);

        if (selectedUser) {
          const userShift = selectedShiftData.find(
            (s) => s.userId._id === selectedUser.userId._id
          );
          setSelectedUserShift({
            id: userShift._id,
            userId: userShift.userId._id,
            shiftId: userShift.shiftId._id,
            dateTime: format(day, "yyyy-MM-dd"),
            fullname: userShift?.userId?.fullname,
            shiftName: userShift.shiftId.shiftName,
          });
        } else {
          setSelectedUserShift({
            id: selectedShiftData[0]._id,
            userId: selectedShiftData[0].userId._id,
            shiftId: selectedShiftData[0].shiftId._id,
            dateTime: format(day, "yyyy-MM-dd"),
            fullname: selectedShiftData[0]?.userId?.fullname,
            shiftName: selectedShiftData[0].shiftId.shiftName,
          });
        }
      }
      setSelectedShift(shift.shiftName);
      setSelectedDay(format(day, "yyyy-MM-dd"));
      setDateShift(format(day, "yyyy-MM-dd"));
    } else {
      setSelectedUserShift({ userId: "", shiftId: "", dateTime: "" });
      setSelectedShift(null);
      setSelectedDay(null);
      setDateShift(""); // Reset nếu không có ca
    }
  };

  const handleAddClick = () => setShowAddForm(true);
  const handleCloseModal = () => setShowAddForm(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const addedUserShift = await addUserShift(newUserShift);
      console.log("addedUserShift", addedUserShift);

      if (addedUserShift) {
        setShowNotification({
          content: `Đã phân Ca ${newUserShift.shiftName} ngày ${newUserShift.dateTime} cho nhân viên ${newUserShift?.fullname}`,
          type: "Notification",
          show: true,
        });
        setUserShifts((prev) => [...prev, addedUserShift]);
        filterUserShiftsForWeek(currentWeekStart);
      }
    } catch (error) {
      console.error("Error adding user shift:", error);
      setShowNotification({
        content: "Đã xảy ra lỗi khi thêm ca. Vui lòng thử lại.",
        type: "Error",
        show: true,
      });
    }
  };

  const handleDelete = async (selectedUserShift) => {
    if (!selectedUserShift) {
      setShowNotification({
        content: "Bạn chưa chọn ca để xóa",
        type: "Error",
        show: true,
      });
    } else {
      const del = await deleteUserShift(selectedUserShift?.id);
      if (del) {
        setShowNotification({
          content: `Ca ${selectedUserShift.dateTime} của nhân viên ${selectedUserShift?.fullname} đã được xóa`,
          type: "Notification",
          show: true,
        });
        setUserShifts(
          userShifts.filter((shift) => shift._id !== selectedUserShift.id)
        ); // Xóa khỏi dữ liệu đầy đủ
        filterUserShiftsForWeek(currentWeekStart); // Cập nhật lại tuần hiện tại
      }
    }
  };

  const handleEdit = async (userShift) => {
    // Kiểm tra nếu không có ca nào được chọn
    if (!userShift) {
      setShowNotification({
        content: "Bạn chưa chọn ca để sửa",
        type: "Error",
        show: true,
      });
      return; // Thoát khỏi hàm nếu không có ca nào được chọn
    }

    try {
      // Cập nhật ca làm việc
      const updatedShift = await updateUserShift({
        ...userShift,
        dateTime: format(dateShift, "yyyy-MM-dd"), // Gửi giá trị ngày trực từ dateShift
      });
      console.log("Updated Shift:", updatedShift);

      // Kiểm tra nếu cập nhật thành công
      if (updatedShift) {
        setShowNotification({
          content: `Ca của nhân viên ${selectedUserShift?.fullname} đã được sửa`,
          type: "Notification",
          show: true,
        });

        // Cập nhật danh sách ca làm việc
        const updatedShifts = userShifts.map((shift) =>
          shift._id === updatedShift._id ? updatedShift : shift
        );

        // Cập nhật trạng thái userShifts nếu bạn đang sử dụng useState
        setUserShifts(updatedShifts);

        // Cập nhật lại tuần hiện tại
        filterUserShiftsForWeek(currentWeekStart);
      }
    } catch (error) {
      console.error("Error updating shift:", error);
      setShowNotification({
        content: "Đã xảy ra lỗi khi cập nhật ca. Vui lòng thử lại.",
        type: "Error",
        show: true,
      });
    }
  };
  if (loading) {
    return <Loading />; // Hiển thị Loading nếu đang tải dữ liệu
  }
  return (
    <div className="min-h-screen bg-gray-100 p-6 ">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">DANH SÁCH CA TRỰC</h1>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleAddClick}
          >
            THÊM
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => handleDelete(selectedUserShift)}
          >
            XÓA
          </button>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={() => handleEdit(selectedUserShift)}
          >
            SỬA
          </button>
        </div>
        <div className="grid grid-cols-6">
          <div className="mb-4 mx-2">
            <label className="block mb-2">Nhân viên:</label>
            <select
              name="user"
              className="border p-2 rounded w-full"
              value={selectedUserShift?.userId}
              onChange={(e) =>
                setSelectedUserShift({
                  ...selectedUserShift,
                  userId: e.target.value,
                })
              }
            >
              <option value="">Chọn nhân viên</option>
              {users?.map((user) => (
                <option key={user._id} value={user._id}>
                  {user?.fullname}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 mx-2">
            <label className="block mb-2">Ca trực:</label>
            <select
              name="shift"
              className="border p-2 rounded w-full"
              value={selectedUserShift?.shiftId}
              onChange={(e) =>
                setSelectedUserShift({
                  ...selectedUserShift,
                  shiftId: e.target.value,
                })
              }
            >
              <option value="">Chọn ca trực</option>
              {shifts?.map((shift) => (
                <option key={shift._id} value={shift._id}>
                  {shift.shiftName}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 mx-2">
            <label className="block mb-2">Ngày trực:</label>
            <input
              type="date"
              value={dateShift}
              onChange={(e) => {
                setDateShift(e.target.value);
              }}
              className="border p-2 rounded"
            />
          </div>
        </div>
        {/* Date Filter */}
        <div className="flex space-x-4 mb-4 items-center">
          <label className="p-2">Ngày :</label>
          <input
            type="date"
            className="border p-2 rounded"
            onChange={handleDateChange}
            value={dateFilter}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleTodayClick}
          >
            Hiện tại
          </button>
        </div>
        {/* Shift Table */}
        <div className="grid grid-cols-8 gap-4">
          <div className="col-span-8">
            <table className="min-w-full bg-white border rounded">
              <thead>
                <tr className="bg-slate-300">
                  <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                    Ca
                  </th>{" "}
                  {/* Cột ca */}
                  {daysInWeek.map((day, index) => (
                    <th
                      key={index}
                      className="border p-2 sticky top-0 bg-slate-300 z-10"
                    >
                      {format(day, "EEEE dd/MM")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shifts.map((shift, i) => (
                  <tr key={i}>
                    <td className="border p-2 text-center">
                      {shift.shiftName}
                    </td>
                    {/* Hiển thị tên ca */}
                    {daysInWeek.map((day, index) => {
                      const shiftData = getShiftForDayAndTime(
                        day,
                        shift.shiftName
                      );
                      return (
                        <td
                          key={index}
                          className={`border p-2 text-center ${
                            selectedShift === shift.shiftName &&
                            selectedDay === format(day, "yyyy-MM-dd")
                              ? "bg-gray-300"
                              : ""
                          }`}
                          onClick={() => handleShiftClick(shift, day)}
                        >
                          {shiftData && shiftData.length > 0
                            ? shiftData.map((user, idx) => (
                                <span
                                  key={idx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedUser(user);
                                    setHighlightedUser(user.userId);
                                    handleShiftClick(shift, day);
                                  }}
                                  className={`cursor-pointer hover:text-blue-500 ${
                                    highlightedUser === user.userId
                                      ? "font-bold"
                                      : ""
                                  }`}
                                >
                                  {user.userId?.fullname}
                                  {idx < shiftData.length - 1 && ", "}
                                </span>
                              ))
                            : ""}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination for weeks */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePreviousWeek}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Tuần trước
              </button>
              <button
                onClick={handleNextWeek}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Tuần sau
              </button>
            </div>
          </div>
        </div>
      </div>
      <UserShiftModal
        showAddForm={showAddForm}
        newUserShift={newUserShift}
        setNewUserShift={setNewUserShift}
        handleSubmit={handleSubmit}
        handleCloseModal={handleCloseModal}
        shifts={shifts}
        users={users}
      />
      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
    </div>
  );
};

export default UserShift;
