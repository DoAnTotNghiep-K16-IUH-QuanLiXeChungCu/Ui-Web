import React from "react";
import CameraConfiguration from "../components/CameraConfiguration";

// Component chính
const ConnectConfiguration = () => {
  return (
    <div className="container max-w-7xl mx-auto p-4 bg-gray-100">
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <h2 className="text-lg font-bold mb-4">Chọn cổng quẹt thẻ vào</h2>
          <CameraConfiguration cameraKey="camera1" />
        </div>
        <div>
          <h2 className="text-lg font-bold mb-4">Chọn cổng quẹt thẻ ra</h2>
          <CameraConfiguration cameraKey="camera3" />
        </div>
      </div>
    </div>
  );
};
export default ConnectConfiguration;
