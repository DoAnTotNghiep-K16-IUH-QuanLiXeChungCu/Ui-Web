import React, { useState, useEffect } from "react";
import Notification from "../components/Notification";
import { addDays, startOfWeek, format, addWeeks } from "date-fns";
import { filterUserShift, getAllUserShift } from "../../useAPI/useUserShiftAPI";
import { getAllShift } from "../../useAPI/useShiftAPI";
import Loading from "../components/Loading";

const UserShiftEmployee = () => {
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
  const [shifts, setShifts] = useState([]);
  const [userShifts, setUserShifts] = useState([]);
  const [highlightedUser, setHighlightedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        const shifts = await getAllShift();
        setShifts(shifts);
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

    return shifts.length > 0 ? shifts : [];
  };
  if (loading) {
    return <Loading />; // Hiển thị Loading nếu đang tải dữ liệu
  }
  return (
    <div className="min-h-screen bg-gray-100 p-6 ">
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">LỊCH TRỰC</h1>
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
                        <td key={index} className={`border p-2 text-center`}>
                          {shiftData && shiftData.length > 0
                            ? shiftData.map((user, idx) => (
                                <span
                                  key={idx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setHighlightedUser(user.userId);
                                  }}
                                  className={`cursor-pointer hover:text-blue-500 ${
                                    highlightedUser === user.userId
                                      ? "font-bold"
                                      : ""
                                  }`}
                                >
                                  {user?.userId?.fullname}
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
      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
    </div>
  );
};

export default UserShiftEmployee;
