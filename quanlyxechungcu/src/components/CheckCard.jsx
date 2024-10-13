import React, { useEffect, useState } from "react";
import { countVehicleEntry, countVehicleExit } from "../useAPI/useRecordAPI";

const CheckCard = ({ type, color }) => {
  const [vehicleEntryCount, setVehicleEntryCount] = useState([]);
  const [vehicleExitCount, setVehicleExitCount] = useState([]);
  const [vehicleNonExitCount, setVehicleNonExitCount] = useState([]);

  const fetchData = async () => {
    const countV = await countVehicleEntry(new Date("2024-01-01"));
    // console.log("countV", countV);

    if (countV) {
      setVehicleEntryCount(countV);
    }
    const countVE = await countVehicleExit(new Date("2024-01-01"));
    if (countVE) {
      setVehicleExitCount(countVE);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Hàm sắp xếp dữ liệu luôn cố định thứ tự: Ô tô trước, Xe máy sau
  const getSortedVehicleData = (vehicleData) => {
    const sortedData = {
      car: 0, // Số lượng ô tô
      motor: 0, // Số lượng xe máy
    };

    vehicleData.forEach((vehicle) => {
      if (vehicle.vehicleType === "car") {
        sortedData.car = vehicle.amount;
      } else if (vehicle.vehicleType === "motor") {
        sortedData.motor = vehicle.amount;
      }
    });

    return sortedData;
  };

  const entryData = getSortedVehicleData(vehicleEntryCount);
  const exitData = getSortedVehicleData(vehicleExitCount);

  return (
    <div className="border border-gray-400 rounded-lg">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-left text-blue-700">
          {type === "entry"
            ? "Xe vào"
            : type === "exit"
            ? "Xe ra"
            : "Xe chưa ra"}
        </h2>
        <div className="flex space-x-4 justify-center">
          {type === "entry" && (
            <>
              <p>
                Ô tô:{" "}
                <span className={`font-bold ${color}`}>{entryData.car}</span>
              </p>
              <p>
                Xe máy:{" "}
                <span className={`font-bold ${color}`}>{entryData.motor}</span>
              </p>
            </>
          )}
          {type === "exit" && (
            <>
              <p>
                Ô tô:{" "}
                <span className={`font-bold ${color}`}>{exitData.car}</span>
              </p>
              <p>
                Xe máy:{" "}
                <span className={`font-bold ${color}`}>{exitData.motor}</span>
              </p>
            </>
          )}
          {type !== "exit" && type !== "entry" && (
            <>
              <p>
                Ô tô:{" "}
                <span className={`font-bold ${color}`}>{exitData.car}</span>
              </p>
              <p>
                Xe máy:{" "}
                <span className={`font-bold ${color}`}>{exitData.motor}</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckCard;
