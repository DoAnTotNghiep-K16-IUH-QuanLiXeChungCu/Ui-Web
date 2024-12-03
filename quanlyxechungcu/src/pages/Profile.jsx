import React, { useContext, useState } from "react";
import { UPDATE_USER } from "../config/API";
import Notification from "../components/Notification";
import UserContext from "../context/UserContext";
import { getData, saveData } from "../context/indexedDB";
import { calculateAge } from "../utils";

const Profile = () => {
  const { profile, setProfile } = useContext(UserContext);
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: profile._id,
    username: profile.username,
    birthDay: profile.birthDay,
    address: profile.address,
    phoneNumber: profile.phoneNumber,
    role: profile.role,
    fullname: profile.fullname,
    password: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // Xóa trường password khỏi formData nếu không có mật khẩu mới được nhập
    const updatedFormData = { ...formData };
    if (!formData.password) {
      delete updatedFormData.password;
    }

    try {
      const response = await fetch(UPDATE_USER, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });
      if (response.ok) {
        setShowNotification({
          content: "Dữ liệu đã được cập nhật",
          type: "Notification",
          show: true,
        });
        // Cập nhật lại fullname của formData trước khi lưu cookie
        const updatedDataUser = {
          ...profile,
          age: formData.age,
          fullname: formData.fullname,
          address: formData.dataUser,
          phoneNumber: formData.phoneNumber,
        };
        setProfile(updatedDataUser);
        const data = await getData("userData");
        if (data) {
          await saveData({
            id: "userData",
            ...data,
            profile: [...(data.profile || []), updatedDataUser], // Cập nhật danh sách thẻ mới, khởi tạo là mảng rỗng nếu không có thẻ
          });
        }
        setIsEditing(false);
      } else {
        setShowNotification({
          content: "Lỗi khi cập nhật lại dữ liệu",
          type: "Error",
          show: true,
        });
      }
    } catch (err) {
      setShowNotification({
        content: err.toString(),
        type: "Error",
        show: true,
      });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = () => {
    const { currentPassword, newPassword } = passwordData;
    // Kiểm tra mật khẩu mới
    const passwordValidation =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordValidation.test(newPassword)) {
      setShowNotification({
        content:
          "Mật khẩu mới phải có ít nhất 1 ký tự thường, 1 ký tự hoa, 1 số, 1 ký tự đặc biệt và chiều dài > 8",
        type: "Error",
        show: true,
      });
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      password: newPassword,
    }));
    handleSave();
    // Gọi API đổi mật khẩu ở đây (thêm mã API nếu cần)
    console.log("Đổi mật khẩu:", passwordData);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-screen-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Thông tin cá nhân</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center mb-4 mx-2">
            <label className="block font-semibold w-1/5">Họ và tên:</label>
            <input
              type="text"
              name="username"
              className={`p-2 rounded w-2/3 ${isEditing ? "border" : ""}`}
              value={formData.fullname}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </div>
          <div className="flex items-center mb-4 mx-2">
            <label className="block font-semibold w-1/5">Tuổi:</label>
            <input
              type="number"
              name="age"
              className={`p-2 rounded w-2/3 ${isEditing ? "border" : ""}`}
              value={calculateAge(formData.birthDay)}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </div>
          <div className="flex items-center mb-4 mx-2">
            <label className="block font-semibold w-1/5">Địa chỉ:</label>
            <input
              type="text"
              name="address"
              className={`p-2 rounded w-2/3 ${isEditing ? "border" : ""}`}
              value={formData.address}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </div>
          <div className="flex items-center mb-4 mx-2">
            <label className="block font-semibold w-1/5">Số điện thoại:</label>
            <input
              type="text"
              name="phoneNumber"
              className={`p-2 rounded w-2/3 ${isEditing ? "border" : ""}`}
              value={formData.phoneNumber}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </div>
        </div>

        <div className="flex justify-between">
          {isEditing ? (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={handleSave}
            >
              Lưu
            </button>
          ) : (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleEditClick}
            >
              Sửa
            </button>
          )}
          {/* Nút Đổi mật khẩu */}
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => setIsModalOpen(true)}
          >
            Đổi mật khẩu
          </button>
        </div>
      </div>

      {/* Modal Đổi mật khẩu */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
            <h3 className="text-2xl font-bold mb-4 text-center">
              Đổi mật khẩu
            </h3>
            {/* <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Mật khẩu hiện tại:
              </label>
              <input
                type="text"
                name="currentPassword"
                className="border border-gray-300 p-2 rounded w-full"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
            </div> */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Mật khẩu mới:
              </label>
              <input
                type="text"
                name="newPassword"
                className="border border-gray-300 p-2 rounded w-full"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                Hủy
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handlePasswordSubmit}
              >
                Lưu mật khẩu
              </button>
            </div>
          </div>
        </div>
      )}
      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
    </div>
  );
};

export default Profile;
