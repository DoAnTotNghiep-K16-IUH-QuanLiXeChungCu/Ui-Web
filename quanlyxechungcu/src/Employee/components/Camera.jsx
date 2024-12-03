import React, { useEffect, useRef, useState } from "react";

const Camera = ({ selectedDeviceId, isStart, videoRef }) => {
  const [videoStream, setVideoStream] = useState(null); // Stream từ camera
  const [currentTime, setCurrentTime] = useState(""); // Thời gian hiện tại

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

  // Cập nhật thời gian theo thời gian thực
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // 24h format
        timeZone: "Asia/Ho_Chi_Minh", // Việt Nam
      });
      setCurrentTime(formattedTime);
    };

    updateTime(); // Cập nhật ngay khi component được render
    const timer = setInterval(updateTime, 1000); // Cập nhật mỗi giây
    return () => clearInterval(timer); // Clear interval khi unmount
  }, []);

  useEffect(() => {
    if (isStart && selectedDeviceId) {
      handleStartCamera(selectedDeviceId);
    } else if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
  }, [isStart, selectedDeviceId]);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  return (
    <div className="relative">
      {selectedDeviceId && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-96 h-72 border-black"
        />
      )}
      {/* Lớp phủ thời gian */}
      {isStart && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md text-sm">
          {currentTime}
        </div>
      )}
    </div>
  );
};

export default Camera;
