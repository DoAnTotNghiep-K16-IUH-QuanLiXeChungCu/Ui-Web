import React from "react";
const Camera = ({
  openSetting,
  cameraKey,
  selectedDeviceId,
  devices,
  startCamera,
  videoRef,
  setSelectedDeviceIds,
}) => {
  return (
    <div>
      {openSetting === false && (
        <div>
          <select
            value={selectedDeviceId}
            className="border-2 rounded"
            onChange={(e) =>
              setSelectedDeviceIds((prev) => ({
                ...prev,
                [cameraKey]: e.target.value,
              }))
            }
          >
            {devices.length > 0 ? (
              devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${device.deviceId}`}
                </option>
              ))
            ) : (
              <option disabled>No camera devices found</option>
            )}
          </select>
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded my-1"
            onClick={() => startCamera(cameraKey)}
          >
            Start camera
          </button>
        </div>
      )}
      <p className=" font-bold p-1 text-center">
        {cameraKey === "camera1" ? "Camera trước" : "Camera sau"}
      </p>
      <video ref={videoRef} className="w-96 h-72 border-gray-300"></video>
    </div>
  );
};

export default Camera;
