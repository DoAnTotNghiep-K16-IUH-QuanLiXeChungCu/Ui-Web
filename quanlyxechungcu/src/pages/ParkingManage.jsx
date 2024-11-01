import React, { useEffect, useState } from "react";
import CheckCard from "../components/CheckCard";
import CheckCamera from "../components/CheckCamera";
import { getMoneyByDay } from "../useAPI/useRecordAPI";
import { formatCurrency } from "../utils/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faPlay, faPause } from "@fortawesome/free-solid-svg-icons"; // Nhập biểu tượng cụ thể
const ParkingManagement = () => {
  const [moneyPerDay, setMoneyPerDay] = useState([]);
  const [openSetting, setOpenSetting] = useState(false);
  const [entryLicensePlate, setEntryLicensePlate] = useState("");
  const [exitLicensePlate, setExitLicensePlate] = useState("");
  const [isStart, setIsStart] = useState(false);
  const fetchData = async () => {
    const money = await getMoneyByDay(new Date("2024-01-01"));
    // console.log("Money___", money.totalMoney);
    if (money) {
      setMoneyPerDay(money.totalMoney);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <header className="bg-gray-100 p-2 flex justify-between items-center">
        <div className="flex space-x-4 text-center">
          <CheckCard type="entry" color="text-green-500"></CheckCard>
          <CheckCard type="exit" color="text-yellow-500"></CheckCard>
          <CheckCard type="non-exit" color="text-red-500"></CheckCard>
        </div>
        <div className="flex gap-1">
          <div className="border border-gray-400 rounded-lg ml-auto flex p-2 justify-center items-center">
            <h2 className="text-lg font-semibold">Tổng Tiền</h2>
            <p className="text-red-500 font-bold ml-2">
              {formatCurrency(moneyPerDay)}
            </p>
          </div>
          <div className="">
            <button
              onClick={(e) => setIsStart((prev) => !prev)}
              className="bg-slate-300 text-white px-4 py-2 rounded my-2 mr-1"
            >
              <FontAwesomeIcon
                icon={isStart === true ? faPause : faPlay}
                color="black"
              />
            </button>
            <button
              onClick={(e) => setOpenSetting((prev) => !prev)}
              className="bg-orange-400 text-white px-4 py-2 rounded my-2"
            >
              <FontAwesomeIcon icon={faGear} />
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <CheckCamera
          type={"entry"}
          openSetting={openSetting}
          isStart={isStart}
          entryLicensePlate={entryLicensePlate}
          setEntryLicensePlate={setEntryLicensePlate}
        ></CheckCamera>
        <CheckCamera
          type={"exit"}
          openSetting={openSetting}
          isStart={isStart}
          exitLicensePlate={exitLicensePlate}
          setExitLicensePlate={setExitLicensePlate}
        ></CheckCamera>
      </div>
    </div>
  );
};

export default ParkingManagement;
