import React from "react";
const UserShiftModal = ({
  showAddForm,
  newUserShift,
  setNewUserShift,
  handleSubmit,
  handleCloseModal,
  shifts,
  users,
}) => {
  if (!showAddForm) return null; // Nếu showAddForm là false, không hiển thị modal

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[400px]">
        <h2 className="text-lg font-semibold mb-4">Phân ca mới</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Nhân viên:</label>
            <select
              name="user"
              className="border p-2 rounded w-full"
              value={newUserShift.userId}
              onChange={(e) =>
                setNewUserShift({
                  ...newUserShift,
                  userId: e.target.value,
                })
              }
            >
              <option value="">Chọn nhân viên</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.fullname}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Ca trực:</label>
            <select
              name="shift"
              className="border p-2 rounded w-full"
              value={newUserShift.shiftId}
              onChange={(e) =>
                setNewUserShift({
                  ...newUserShift,
                  shiftId: e.target.value,
                })
              }
            >
              <option value="">Chọn ca trực</option>
              {shifts.map((shift) => (
                <option key={shift._id} value={shift._id}>
                  {shift.shiftName}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Ngày trực:</label>
            <input
              type="date"
              value={newUserShift.dateTime}
              onChange={(e) =>
                setNewUserShift({
                  ...newUserShift,
                  dateTime: e.target.value,
                })
              }
              className="border p-2 rounded"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Thêm
            </button>

            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleCloseModal}
            >
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserShiftModal;
