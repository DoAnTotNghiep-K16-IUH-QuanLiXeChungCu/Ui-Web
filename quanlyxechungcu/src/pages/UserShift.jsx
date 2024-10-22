import React, { useState, useEffect } from "react";
import Notification from "../components/Notification";
import { addDays, startOfWeek, format, addWeeks } from "date-fns";
import {
  addUserShift,
  deleteUserShift,
  filterUserShift,
  updateUserShift,
} from "../useAPI/useUserShiftAPI";

import UserShiftModal from "./UserShiftModal";
import { getData } from "../context/indexedDB";

const UserShift = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date())
  );
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  const [dateFilter, setDateFilter] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [userShifts, setUserShifts] = useState([]);
  const [dateShift, setDateShift] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [users, setUsers] = useState([]);

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
  const daysInWeek = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getData("userData");
        if (data) {
          setUsers(data.users);
          setShifts(data.shifts);
        } else {
        }
      } catch (err) {
        console.error("Failed to get User data:", err);
      }
    };
    fetchUserData();
    fetchUserShifts(currentWeekStart);
  }, [currentWeekStart]);

  // Fetch user shifts for the current week
  const fetchUserShifts = async (weekStart) => {
    try {
      const promises = daysInWeek.map((day) =>
        filterUserShift(day, "").catch(() => ({ userShifts: [] }))
      );

      const results = await Promise.all(promises); // Đợi tất cả các API gọi xong
      const shifts = results.flatMap((res) => res.userShifts || []); // Gộp tất cả kết quả lại

      setUserShifts(shifts); // Đặt mảng userShifts đã xử lý
    } catch (error) {
      console.error("Error fetching shifts:", error);
      setUserShifts([]); // Đặt userShifts là mảng rỗng nếu có lỗi
    }
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const handlePreviousWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, -1));
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    setDateFilter(e.target.value);
    setCurrentWeekStart(startOfWeek(selectedDate));
  };

  const handleTodayClick = () => {
    setCurrentWeekStart(startOfWeek(new Date()));
    setDateFilter(""); // Reset date filter input
  };

  // Function to get shift for a specific day and time
  const getShiftForDayAndTime = (day, shiftName) => {
    const dayStr = format(day, "yyyy-MM-dd");
    const shift = userShifts?.find(
      (s) =>
        format(new Date(s.dateTime), "yyyy-MM-dd") === dayStr &&
        s.shiftId.shiftName === shiftName
    );
    return shift ? shift : null; // Return the shift object or null if no shift
  };

  // Handle shift selection
  const handleShiftClick = (shift, day) => {
    const selectedShiftData = getShiftForDayAndTime(day, shift.shiftName);

    if (selectedShiftData) {
      setSelectedUserShift({
        id: selectedShiftData._id,
        userId: selectedShiftData.userId._id, // Lưu ID của nhân viên
        shiftId: selectedShiftData.shiftId._id, // Lưu ID của ca
        dateTime: format(day, "yyyy-MM-dd"),
        fullname: selectedShiftData.userId.fullname,
        shiftName: selectedShiftData.shiftId.shiftName,
      });

      // Cập nhật các select và input
      setSelectedShift(shift.shiftName);
      setSelectedDay(format(day, "yyyy-MM-dd"));
      setDateShift(format(day, "yyyy-MM-dd")); // Cập nhật ngày trực
    } else {
      // Nếu không có ca, bạn có thể reset các giá trị
      setSelectedUserShift({
        userId: "",
        shiftId: "",
        dateTime: "",
      });
      setSelectedShift(null);
      setSelectedDay(null);
      setDateShift("");
    }
  };

  const handleAddClick = () => {
    setShowAddForm(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const addedUserShift = await addUserShift(newUserShift);
    if (addedUserShift) {
      setShowNotification({
        content: `Đã phân Ca ${newUserShift.shiftName} ngày ${newUserShift.dateTime} cho nhân viên ${newUserShift.fullname}`,
        type: "Notification",
        show: true,
      });
      fetchUserShifts(currentWeekStart);
    } else {
      setShowNotification({
        content: addedUserShift,
        type: "Error",
        show: true,
      });
    }
  };
  const handleCloseModal = () => {
    setShowAddForm(false);
  };
  const handleDelete = async (id) => {
    // console.log("ID___", selectedUserShift);

    if (!id) {
      setShowNotification({
        content: "Bạn chưa chọn ca để xóa",
        type: "Error",
        show: true,
      });
    } else {
      const del = await deleteUserShift(id);
      if (del) {
        setShowNotification({
          content: `Ca ${selectedUserShift.dateTime} của nhân viên ${selectedUserShift.fullname} ngày ${selectedDay} đã được xóa`,
          type: "Notification",
          show: true,
        });
        setSelectedUserShift(null);
        setSelectedShift(null);
        setDateShift("");
        fetchUserShifts(currentWeekStart);
      }
    }
  };
  const handleEdit = async (usefShift) => {
    console.log("usefShift____", usefShift);

    if (!usefShift) {
      setShowNotification({
        content: "Bạn chưa chọn ca để sửa",
        type: "Error",
        show: true,
      });
    } else {
      const upd = await updateUserShift(usefShift);
      if (upd) {
        setShowNotification({
          content: `Ca của nhân viên ${selectedUserShift.fullname} ngày ${selectedDay} đã được sửa`,
          type: "Error",
          show: true,
        });
        // load lại dữ liệu
        setSelectedShift(null);
        setDateShift("");
        fetchUserShifts(currentWeekStart);
      }
    }
  };

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
            onClick={() => handleDelete(selectedUserShift?.id)}
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
                  {user.fullname}
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
                    </td>{" "}
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
                            selectedDay === format(day, "yyyy-MM-dd") // So sánh với chuỗi
                              ? "bg-gray-300"
                              : ""
                          }`}
                          onClick={() => handleShiftClick(shift, day)} // Thêm sự kiện click vào ô
                        >
                          {shiftData ? (
                            // Kiểm tra nếu shiftData hợp lệ
                            <span>
                              {shiftData.userId.fullname}{" "}
                              {/* Hoặc một thuộc tính khác để hiển thị */}
                            </span>
                          ) : (
                            ""
                          )}
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
