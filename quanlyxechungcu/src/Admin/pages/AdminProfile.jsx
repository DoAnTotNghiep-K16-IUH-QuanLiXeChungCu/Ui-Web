import React, { useContext, useEffect, useState } from "react";
import Notification from "../../Employee/components/Notification";
import UserContext from "../../context/UserContext";
import { checkPassWord, updateUser } from "../../useAPI/useUserAPI";

const AdminProfile = () => {
  const { profile, setProfile } = useContext(UserContext);
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    _id: profile._id,
    username: profile.username,
    fullname: profile.fullname,
    birthDay: profile.birthDay,
    address: profile.address,
    phoneNumber: profile.phoneNumber,
    email: profile.email,
    password: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      birthDay: profile.birthDay ? profile.birthDay.split("T")[0] : "",
    }));
  }, [profile.birthDay]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "birthDay" ? value : value,
    }));
  };

  const handleSave = async () => {
    const updatedFormData = {
      ...formData,
      birthDay: new Date(formData.birthDay).toISOString(),
      password: passwordData.newPassword,
    };
    const update = await updateUser(updatedFormData);
    setProfile(update);
    setShowNotification({
      content: "Đã cập nhật lại thông tin",
      type: "Notification",
      show: true,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async () => {
    const { currentPassword, newPassword } = passwordData;

    const isPasswordCorrect = await checkPassWord(
      formData.username,
      passwordData.currentPassword
    );

    if (isPasswordCorrect === null) {
      setShowNotification({
        content: "Mật khẩu cũ không trùng với mật khẩu hiện tại",
        type: "Error",
        show: true,
      });
      return;
    }

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
    setShowNotification({
      content: "Đã cập nhật mật khẩu mới",
      type: "Notification",
      show: true,
    });
    handleSave();
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-screen-lg mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-600">
          Thông tin cá nhân
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: "Họ và tên", name: "fullname", type: "text" },
            { label: "Ngày sinh", name: "birthDay", type: "date" },
            { label: "Địa chỉ", name: "address", type: "text" },
            { label: "Số điện thoại", name: "phoneNumber", type: "text" },
            { label: "Email", name: "email", type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name} className="flex items-center mb-4">
              <label className="block font-medium text-gray-700 w-1/3">
                {label}:
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={`p-3 rounded-lg w-2/3 text-gray-800 border ${
                  isEditing ? "border-blue-300" : ""
                }`}
              />
            </div>
          ))}

          <div className="flex items-center mb-4">
            <label className="block font-medium text-gray-700 w-1/3">
              Mã thẻ RFID:
            </label>
            <input
              type="text"
              name="RFID"
              value={profile?.rfidCard?.uuid}
              readOnly
              className="p-3 rounded-lg w-2/3 bg-gray-300 text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          {isEditing ? (
            <button
              className="bg-green-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-700 transition duration-300"
              onClick={handleSave}
            >
              Lưu
            </button>
          ) : (
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
              onClick={() => setIsEditing(true)}
            >
              Sửa
            </button>
          )}

          <button
            className="bg-red-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-red-700 transition duration-300"
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
            <h3 className="text-2xl font-semibold text-center text-blue-600 mb-6">
              Đổi mật khẩu
            </h3>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Mật khẩu hiện tại:
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="border border-gray-300 p-3 rounded-lg w-full"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Mật khẩu mới:
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="border border-gray-300 p-3 rounded-lg w-full"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-400 text-white px-6 py-2 rounded-md"
                onClick={() => setIsModalOpen(false)}
              >
                Hủy
              </button>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-md"
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

export default AdminProfile;
