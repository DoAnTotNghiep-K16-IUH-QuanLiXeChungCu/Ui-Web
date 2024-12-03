import React, { useEffect, useState } from "react";
import { getAllShift, updateShift } from "../../useAPI/useShiftAPI";
import Loading from "../components/Loading";

const Shift = () => {
  const [loading, setLoading] = useState(true);
  const [shifts, setShifts] = useState([]);
  const [editingShift, setEditingShift] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const listShift = await getAllShift();
      setShifts(listShift);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (shiftId) => {
    setEditingShift(shiftId);
  };

  const handleCancel = () => {
    setEditingShift(null);
  };

  const handleSave = async (shiftHere) => {
    console.log("shiftHere", shiftHere);

    const update = await updateShift(shiftHere);
    console.log("update", update);

    setShifts((prevShifts) =>
      prevShifts.map((shift) =>
        shift._id === shiftHere._id
          ? {
              ...shift,
              startTime: shiftHere.startTime,
              endTime: shiftHere.endTime,
            }
          : shift
      )
    );
    setEditingShift(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center font-sans">
        QUẢN LÝ THỜI GIAN CA TRỰC
      </h1>
      <div className="overflow-hidden bg-white shadow-xl rounded-lg">
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-4 px-6">Tên Ca</th>
              <th className="py-4 px-6">Giờ Bắt Đầu</th>
              <th className="py-4 px-6">Giờ Kết Thúc</th>
              <th className="py-4 px-6 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {shifts.map((shift, index) => (
              <tr
                key={shift._id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                } hover:bg-blue-50`}
              >
                <td className="py-4 px-6 font-medium">{shift.shiftName}</td>
                <td className="py-4 px-6">
                  {editingShift === shift._id ? (
                    <input
                      type="time"
                      defaultValue={shift.startTime}
                      className="border border-gray-300 rounded-md px-2 py-1 w-full focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => (shift.startTime = e.target.value)}
                    />
                  ) : (
                    shift.startTime
                  )}
                </td>
                <td className="py-4 px-6">
                  {editingShift === shift._id ? (
                    <input
                      type="time"
                      defaultValue={shift.endTime}
                      className="border border-gray-300 rounded-md px-2 py-1 w-full focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => (shift.endTime = e.target.value)}
                    />
                  ) : (
                    shift.endTime
                  )}
                </td>
                <td className="py-4 px-6 text-center">
                  {editingShift === shift._id ? (
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleSave(shift)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-200"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition duration-200"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(shift._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200"
                    >
                      Chỉnh sửa
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Shift;
