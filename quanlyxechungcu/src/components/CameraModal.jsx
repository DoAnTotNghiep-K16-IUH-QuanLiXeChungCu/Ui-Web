import React, { useState } from "react";
import { addCamera } from "../useAPI/useCameraAPI";
import Notification from "./Notification";

const CameraModal = ({
  openModal,
  setOpenModal,
  newDeviceID,
  setShowCameraOption,
}) => {
  const [name, setName] = useState("");
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  const handleCreateCamera = async () => {
    if (name === "") {
      setShowNotification({
        content: `Bạn chưa nhập tên cho Camera`,
        type: "Error",
        show: true,
      });
    } else {
      const camera = {
        name: name,
        deviceID: newDeviceID,
      };
      const newCamera = await addCamera(camera);
      if (newCamera) {
        setShowNotification({
          content: `Đã tạo 1 camera có tên là ${camera.name} với deviceID là ${camera.deviceID}`,
          type: "Notification",
          show: true,
        });
        setOpenModal(false);
        setShowCameraOption(false);
      }
    }
  };
  if (openModal === false) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col rounded-lg shadow-lg w-3/4 md:w-1/2 lg:w-1/3">
        <div className="bg-white p-6 rounded-b-lg justify-center">
          <label className="block mb-2">Tên thiết bị:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="border p-2 rounded"
          />
          <div className="flex justify-between">
            <button
              type="button"
              className="mt-4 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition duration-300"
              onClick={handleCreateCamera}
            >
              Chấp nhận
            </button>
            <button
              type="button"
              className="mt-4 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition duration-300"
              onClick={() => setOpenModal(false)}
            >
              Đóng
            </button>
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

export default CameraModal;
