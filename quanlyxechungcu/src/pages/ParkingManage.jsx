import React, { useEffect, useState } from "react";
import CheckCard from "../components/CheckCard";
import { getMoneyByDay } from "../useAPI/useRecordAPI";
import { formatCurrency } from "../utils/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faEye,
  faEyeSlash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import CheckCameraEntry from "../components/CheckCameraEntry";
import CheckCameraExit from "../components/CheckCameraExit";
import ParkingManageModal from "./ParkingManageModal";

const ParkingManagement = () => {
  const [moneyPerDay, setMoneyPerDay] = useState(0);
  const [openSetting, setOpenSetting] = useState(true);
  const [isStart, setIsStart] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [recordType, setRecordType] = useState("");
  const [dataCheckCard, setDataCheckCard] = useState(0);
  const fetchData = async () => {
    const money = await getMoneyByDay(new Date("2024-01-01"));
    if (money) setMoneyPerDay(money.totalMoney);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleStart = () => setIsStart((prev) => !prev);
  const toggleModal = () => {
    setShowModal((prev) => !prev);
    console.log("showModal", showModal);
  };
  const toggleSetting = () => setOpenSetting((prev) => !prev);

  return (
    <div className="p-4">
      <header className="bg-gray-100 p-2 flex justify-between items-center">
        <div className="flex space-x-4 text-center">
          <CheckCard
            type="entry"
            color="text-green-500"
            dataCheckCard={dataCheckCard}
          />
          <CheckCard
            type="exit"
            color="text-yellow-500"
            dataCheckCard={dataCheckCard}
          />
          <CheckCard
            type="non-exit"
            color="text-red-500"
            dataCheckCard={dataCheckCard}
          />
        </div>
        <div className="flex gap-1">
          <div className="border border-gray-400 rounded-lg ml-auto flex p-2 justify-center items-center">
            <h2 className="text-lg font-semibold">Tổng Tiền</h2>
            <p className="text-red-500 font-bold ml-2">
              {formatCurrency(moneyPerDay)}
            </p>
          </div>
          <button
            onClick={toggleStart}
            className="bg-slate-300 text-white px-4 py-2 rounded my-2 mr-1"
          >
            <FontAwesomeIcon icon={isStart ? faPause : faPlay} color="black" />
          </button>
          <button
            onClick={toggleModal}
            className="bg-blue-600 text-white px-4 py-2 rounded my-2 mr-1"
          >
            New <FontAwesomeIcon icon={faPlus} color="black" />
          </button>
          <button
            onClick={toggleSetting}
            className="bg-orange-400 text-white px-4 py-2 rounded my-2"
          >
            <FontAwesomeIcon icon={openSetting ? faEyeSlash : faEye} />
          </button>
        </div>
      </header>

      {recordType === "EnEx" && (
        <div className="grid grid-cols-2 gap-2 mt-1">
          <CheckCameraEntry
            openSetting={openSetting}
            isStart={isStart}
            setDataCheckCard={setDataCheckCard}
            type="main"
          />
          <CheckCameraExit
            openSetting={openSetting}
            isStart={isStart}
            setDataCheckCard={setDataCheckCard}
            type="main"
          />
        </div>
      )}
      {recordType === "EnEn" && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <CheckCameraEntry
            openSetting={openSetting}
            isStart={isStart}
            setDataCheckCard={setDataCheckCard}
            type="main"
          />
          <CheckCameraEntry
            openSetting={openSetting}
            isStart={isStart}
            setDataCheckCard={setDataCheckCard}
            type="another"
          />
        </div>
      )}
      {recordType === "ExEx" && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <CheckCameraExit
            openSetting={openSetting}
            isStart={isStart}
            setDataCheckCard={setDataCheckCard}
            type="main"
          />
          <CheckCameraExit
            openSetting={openSetting}
            isStart={isStart}
            setDataCheckCard={setDataCheckCard}
            type="another"
          />
        </div>
      )}
      <ParkingManageModal
        showModal={showModal}
        setShowModal={setShowModal}
        recordType={recordType}
        setRecordType={setRecordType}
      />
    </div>
  );
};

export default ParkingManagement;
