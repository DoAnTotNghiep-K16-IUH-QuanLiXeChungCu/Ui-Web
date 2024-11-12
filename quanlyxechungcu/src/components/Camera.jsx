import React, { useEffect, useRef, useState } from "react";

const Camera = ({ selectedDeviceId, isStart, videoRef }) => {
  const [videoStream, setVideoStream] = useState(null); // Đổi "" thành null cho rõ ràng hơn

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
    <div>
      {selectedDeviceId && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-96 h-72 border-black"
        />
      )}
    </div>
  );
};

export default Camera;
