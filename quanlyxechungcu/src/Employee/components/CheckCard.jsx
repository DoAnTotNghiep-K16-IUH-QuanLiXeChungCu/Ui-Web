import React, { useEffect, useState } from "react";
import {
  countVehicleEntry,
  countVehicleExit,
  countVehicleNonExit,
} from "../../useAPI/useRecordAPI";
import { format } from "date-fns";

const CheckCard = ({ type, color, dataCheckCard }) => {
  const [dataVehicle, setDataVehicle] = useState([]);
  const fetchData = async () => {
    switch (type) {
      case "entry":
        const countV = await countVehicleEntry(
          format(new Date(), "yyyy-MM-dd")
        );
        if (countV) {
          setDataVehicle(countV);
        }
        break;
      case "exit":
        const countVE = await countVehicleExit(
          format(new Date(), "yyyy-MM-dd")
        );
        if (countVE) {
          setDataVehicle(countVE);
        }
        break;
      case "non-exit":
        const countVNE = await countVehicleNonExit(
          format(new Date(), "yyyy-MM-dd")
        );
        if (countVNE) {
          setDataVehicle(countVNE);
        }
        break;
      default:
        console.warn(`Unknown type: ${type}`);
    }
  };
  useEffect(() => {
    fetchData();
  }, [dataCheckCard]);

  // Hàm sắp xếp dữ liệu luôn cố định thứ tự: Ô tô trước, Xe máy sau
  const getSortedVehicleData = (vehicleData) => {
    const sortedData = {
      car: 0, // Số lượng ô tô
      motor: 0, // Số lượng xe máy
    };
    if (vehicleData.length > 0) {
      vehicleData.forEach((vehicle) => {
        if (vehicle.vehicleType === "car") {
          sortedData.car = vehicle.amount;
        } else if (vehicle.vehicleType === "motor") {
          sortedData.motor = vehicle.amount;
        }
      });
    } else {
      if (vehicleData.vehicleType === "car") {
        sortedData.car = vehicleData.amount;
      } else if (vehicleData.vehicleType === "motor") {
        sortedData.motor = vehicleData.amount;
      }
    }

    return sortedData;
  };

  const data = getSortedVehicleData(dataVehicle);
  // console.log("nonExitData", nonExitData);

  return (
    <div className="p-2">
      <h2 className="font-semibold text-left text-blue-700">
        {type === "entry" ? "Xe vào" : type === "exit" ? "Xe ra" : "Xe chưa ra"}
      </h2>
      <div className="flex space-x-4 justify-center">
        <p>
          Ô tô: <span className={`font-bold ${color}`}>{data.car}</span>
        </p>
        <p>
          Xe máy: <span className={`font-bold ${color}`}>{data.motor}</span>
        </p>
      </div>
    </div>
  );
};

export default CheckCard;
