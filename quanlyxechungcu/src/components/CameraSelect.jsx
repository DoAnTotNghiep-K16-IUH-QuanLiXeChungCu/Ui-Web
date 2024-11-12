import React, { useEffect, useRef, useState } from "react";

const CameraSelect = ({ devices, selectedCamera, onChange, openCamera }) => {
  const [videoStream, setVideoStream] = useState(null);
  const videoRef = useRef(null);
  // console.log("devices:", devices);

  useEffect(() => {
    if (openCamera && selectedCamera) {
      handleStartCamera(selectedCamera);
    } else if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
  }, [openCamera, selectedCamera]); // Gọi lại khi openCamera hoặc selectedCamera thay đổi

  // Hàm mở camera
  const handleStartCamera = async (cameraDeviceId) => {
    if (cameraDeviceId) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: cameraDeviceId } },
        });

        setVideoStream(stream);
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
  };

  // Đảm bảo video sẽ được hiển thị khi videoStream thay đổi
  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  return (
    <div>
      <div>
        <label className="mr-2 p-2">Camera</label>
        <select
          value={selectedCamera || ""}
          onChange={(e) => {
            const newCameraId = e.target.value;
            onChange(newCameraId); // Gọi hàm callback onChange từ parent component
          }}
          className="border p-2 rounded"
        >
          <option value="">Tất cả</option>
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
        {selectedCamera && (
          <div>
            <video
              ref={videoRef}
              autoPlay
              width="100%"
              height="auto"
              style={{ marginTop: "10px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraSelect;
