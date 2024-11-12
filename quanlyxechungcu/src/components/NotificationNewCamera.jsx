import React, { useState } from "react";
import CameraModal from "./CameraModal";

const NotificationNewCamera = ({
  showCameraOption,
  setShowCameraOption,
  newDeviceID,
}) => {
  const [openModal, setOpenModal] = useState(false);

  if (!showCameraOption) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col rounded-lg shadow-lg w-3/4 md:w-1/2 lg:w-1/3">
        {/* Title with background color */}
        <div className={`bg-green-600 p-4 rounded-t-lg`}>
          <h1 className="text-2xl font-bold text-white">THÔNG BÁO</h1>
        </div>
        {/* Content with white background */}
        <div className="bg-white p-6 rounded-b-lg justify-center">
          <p className="mt-2 text-lg">
            Hiện tại chưa có Camera có deviceID là {newDeviceID}
            <br />
            Bạn có muốn tạo 1 camera mới có deviceID là như vậy không
          </p>
          <div className="flex justify-between">
            <button
              type="button"
              className="mt-4 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition duration-300"
              onClick={() => {
                setOpenModal(true);
                // setShowCameraOption(false);
              }}
            >
              Có
            </button>
            <button
              type="button"
              className="mt-4 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition duration-300"
              onClick={() => setShowCameraOption(false)}
            >
              Không
            </button>
          </div>
        </div>
      </div>
      <CameraModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        newDeviceID={newDeviceID}
        setShowCameraOption={setShowCameraOption}
      />
    </div>
  );
};

export default NotificationNewCamera;
