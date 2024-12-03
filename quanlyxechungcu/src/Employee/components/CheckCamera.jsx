import React, { useContext, useState } from "react";
import CameraCapture from "./CameraCapture";
const CheckCamera = ({
  type,
  openSetting,
  isStart,
  entryLicensePlate,
  setEntryLicensePlate,
  exitLicensePlate,
  setExitLicensePlate,
}) => {
  // Hàm xử lý sự thay đổi cho input biển số xe
  const handleLicensePlateChange = (e) => {
    if (type === "entry") {
      setEntryLicensePlate(e.target.value);
    } else {
      setExitLicensePlate(e.target.value);
    }
  };
  const [vehicleType, setVehicleType] = useState("");
  return (
    <div className="bg-white shadow-lg px-4 rounded-lg">
      <CameraCapture
        type={type}
        openSetting={openSetting}
        isStart={isStart}
        entryLicensePlate={entryLicensePlate}
        setEntryLicensePlate={setEntryLicensePlate}
        exitLicensePlate={exitLicensePlate}
        setExitLicensePlate={setExitLicensePlate}
        vehicleType={vehicleType}
        setVehicleType={setVehicleType}
      />
      {/* Car Info */}
      <div className="grid grid-cols-4 gap-1 mt-1">
        <div className="col-span-3">
          <div className="grid grid-cols-2">
            <h3 className="p-2 rounded w-full text-lg font-bold">
              {" "}
              Biển số xe
            </h3>
            <input
              type="text"
              value={type === "entry" ? entryLicensePlate : exitLicensePlate}
              className="border rounded mb-1 border-gray-300 text-center"
              onChange={handleLicensePlateChange}
              required
            />
            <h3 className="p-2 rounded w-full font-semibold">Loại xe:</h3>
            <select
              name="type"
              className="border p-2 rounded w-full"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="">Chọn loại phương tiện</option>
              <option value="car">Ô tô</option>
              <option value="motor">Xe máy</option>
            </select>
            {/* <p>
              <span className="font-semibold">
                {type === "entry" ? "Thời gian vào" : "Thời gian ra"}
              </span>
              :123
            </p> */}
          </div>
        </div>

        <div className="col-span-1 flex justify-center items-center"></div>
      </div>
      <div className="flex justify-between items-center mt-1">
        <div className="block bg-[#ec7a00] border border-gray-100 w-[100px] rounded-md mb-1">
          <p className="p-1 text-center">
            {type === "entry" ? "Làn vào" : "Làn ra"}
          </p>
        </div>
        <span className="font-semibold text-red-700 text-center">
          {/* BIỂN SỐ KHÔNG GIỐNG NHAU */}
        </span>
      </div>
    </div>
  );
};

export default CheckCamera;
