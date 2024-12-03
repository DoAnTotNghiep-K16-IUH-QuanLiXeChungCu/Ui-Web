import React, { useEffect, useState } from "react";
import CheckCard from "../components/CheckCard";
import { getMoneyByDay } from "../../useAPI/useRecordAPI";
import { formatCurrency } from "../../utils/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faPlus } from "@fortawesome/free-solid-svg-icons";
import CheckCameraEntry from "../components/CheckCameraEntry";
import CheckCameraExit from "../components/CheckCameraExit";
import ParkingManageModal from "./ParkingManageModal";
import { getAllSetting } from "../../useAPI/useSettingAPI";
import {
  setUpAnotherSerialPortEntry,
  setUpAnotherSerialPortExit,
  setUpSerialPortEntry,
  setUpSerialPortExit,
} from "../../useAPI/useCardAPI";
import Notification from "../components/Notification";

const ParkingManagement = () => {
  const [moneyPerDay, setMoneyPerDay] = useState(0);
  const [isStart, setIsStart] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [recordType, setRecordType] = useState("EnEx");
  const [dataCheckCard, setDataCheckCard] = useState(0);
  const [settings, setSettings] = useState([]);
  const [selectedSettings, setSelectedSettings] = useState("");
  const [selectedPorts, setSelectedPorts] = useState({
    entry: "",
    exit: "",
    anotherEntry: "",
    anotherExit: "",
  });
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  const fetchData = async () => {
    const money = await getMoneyByDay(new Date("2024-01-01"));
    if (money) setMoneyPerDay(money.totalMoney);
    const settings = await getAllSetting();
    setSettings(settings || []);
    setSelectedSettings(settings[0]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleStart = () => setIsStart((prev) => !prev);
  const toggleModal = () => {
    setShowModal((prev) => !prev);
    console.log("showModal", showModal);
  };
  const handleChangeSetting = (e) => {
    const selectedSettingId = e.target.value;
    const selectedSetting = settings.find(
      (setting) => setting._id === selectedSettingId
    );
    setSelectedSettings(selectedSetting || null);
  };
  useEffect(() => {
    if (recordType === "EnEx") {
      setUpSerialPortEntry(selectedSettings.entryLane?.port, 9600);
      setUpSerialPortExit(selectedSettings.exitLane?.port, 9600);
    } else if (recordType === "EnEn") {
      setUpSerialPortEntry(selectedSettings.entryLane?.port, 9600);
      setUpAnotherSerialPortEntry(selectedSettings.exitLane?.port, 9600);
    } else if (recordType === "ExEx") {
      setUpSerialPortExit(selectedSettings.entryLane?.port, 9600);
      setUpAnotherSerialPortExit(selectedSettings.exitLane?.port, 9600);
    } else return;
  }, [recordType, selectedSettings]);
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
            Đổi <FontAwesomeIcon icon={faPlus} color="black" />
          </button>
          <select
            value={selectedSettings?._id}
            onChange={handleChangeSetting}
            className="border p-2 rounded col-span-3"
          >
            {settings.map((setting) => (
              <option key={setting._id} value={setting._id}>
                {setting.version}
              </option>
            ))}
          </select>
        </div>
      </header>

      {recordType === "EnEx" && (
        <div className="grid grid-cols-2 gap-2 mt-1">
          <CheckCameraEntry
            isStart={isStart}
            setDataCheckCard={setDataCheckCard}
            selectedPorts={selectedPorts}
            setSelectedPorts={setSelectedPorts}
            type="main"
            selectedSettings={selectedSettings.entryLane}
          />
          <CheckCameraExit
            isStart={isStart}
            setDataCheckCard={setDataCheckCard}
            selectedPorts={selectedPorts}
            setSelectedPorts={setSelectedPorts}
            type="main"
            selectedSettings={selectedSettings.exitLane}
          />
        </div>
      )}
      {recordType === "EnEn" && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <CheckCameraEntry
            isStart={isStart}
            setDataCheckCard={setDataCheckCard}
            selectedPorts={selectedPorts}
            setSelectedPorts={setSelectedPorts}
            type="main"
            selectedSettings={selectedSettings.entryLane}
          />
          <CheckCameraEntry
            isStart={isStart}
            setDataCheckCard={setDataCheckCard}
            selectedPorts={selectedPorts}
            setSelectedPorts={setSelectedPorts}
            type="another"
            selectedSettings={selectedSettings.secondaryEntryLane}
          />
        </div>
      )}
      {recordType === "ExEx" && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <CheckCameraExit
            isStart={isStart}
            setDataCheckCard={setDataCheckCard}
            selectedPorts={selectedPorts}
            setSelectedPorts={setSelectedPorts}
            type="main"
            selectedSettings={selectedSettings.exitLane}
          />
          <CheckCameraExit
            isStart={isStart}
            setDataCheckCard={setDataCheckCard}
            selectedPorts={selectedPorts}
            setSelectedPorts={setSelectedPorts}
            type="another"
            selectedSettings={selectedSettings.secondaryExitLane}
          />
        </div>
      )}
      <ParkingManageModal
        showModal={showModal}
        setShowModal={setShowModal}
        recordType={recordType}
        setRecordType={setRecordType}
      />
      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
    </div>
  );
};

export default ParkingManagement;
