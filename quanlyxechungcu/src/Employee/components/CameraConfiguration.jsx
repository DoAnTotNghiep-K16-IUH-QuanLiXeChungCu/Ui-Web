import React, { useEffect, useState } from "react";
import { LIST_PORT } from "../../config/API";
import {
  setUpAnotherSerialPortEntry,
  setUpAnotherSerialPortExit,
  setUpSerialPortEntry,
  setUpSerialPortExit,
} from "../../useAPI/useCardAPI";
import Notification from "./Notification";

const CameraConfiguration = ({
  openSetting,
  type,
  selectedPorts,
  setSelectedPorts,
}) => {
  const [ports, setPorts] = useState([]);
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  async function fetchPorts() {
    try {
      const response = await fetch(LIST_PORT);
      const portsData = await response.json();
      setPorts(portsData);
      // console.log("Available serial ports:", portsData);
    } catch (error) {
      console.error("Error fetching ports:", error);
    }
  }

  useEffect(() => {
    fetchPorts();
  }, []);
  const handleSelectedPort = (e) => {
    let setUp;
    let content;
    let typeNote;

    console.log("e.target.value", e.target.value);

    switch (type) {
      case "entry":
        setUp = setUpSerialPortEntry(e.target.value, 9600);
        if (selectedPorts.exit === e.target.value) {
          content = `Đã chiếm cổng ${e.target.value} để quét cho cổng vào từ cổng ra`;
          typeNote = "Warning";
          setSelectedPorts((prevPorts) => {
            return {
              ...prevPorts,
              entry: e.target.value,
              exit: "",
            };
          });
          break;
        } else if (selectedPorts.anotherEntry === e.target.value) {
          content = `Đã chiếm cổng ${e.target.value} để quét cho cổng vào từ 1 cổng vào khác `;
          typeNote = "Warning";
          setSelectedPorts((prevPorts) => ({
            ...prevPorts,
            entry: e.target.value,
            anotherEntry: "",
          }));
          break;
        } else if (selectedPorts.anotherExit === e.target.value) {
          content = `Đã chiếm cổng ${e.target.value} để quét cho cổng vào từ 1 cổng ra khác `;
          typeNote = "Warning";
          setSelectedPorts((prevPorts) => ({
            ...prevPorts,
            entry: e.target.value,
            anotherExit: "",
          }));
          break;
        } else {
          typeNote = "Notification";
          content = `Đã chọn cổng ${e.target.value} để quét cho cổng vào`;
          setSelectedPorts((prevPorts) => {
            console.log("prevPorts", prevPorts);
            return {
              ...prevPorts,
              entry: e.target.value,
            };
          });
          break;
        }

      case "exit":
        setUp = setUpSerialPortExit(e.target.value, 9600);
        if (selectedPorts.entry === e.target.value) {
          typeNote = "Warning";
          content = `Đã chiếm cổng ${e.target.value} để quét cho cổng ra từ cổng vào`;
          setSelectedPorts((prevPorts) => ({
            ...prevPorts,
            exit: e.target.value,
            entry: "",
          }));
          break;
        } else if (selectedPorts.anotherEntry === e.target.value) {
          content = `Đã chiếm cổng ${e.target.value} để quét cho cổng ra từ 1 cổng vào khác `;
          typeNote = "Warning";
          setSelectedPorts((prevPorts) => ({
            ...prevPorts,
            exit: e.target.value,
            anotherEntry: "",
          }));
          break;
        } else if (selectedPorts.anotherExit === e.target.value) {
          content = `Đã chiếm cổng ${e.target.value} để quét cho cổng ra từ 1 cổng ra khác `;
          typeNote = "Warning";
          setSelectedPorts((prevPorts) => ({
            ...prevPorts,
            exit: e.target.value,
            anotherExit: "",
          }));
          break;
        } else {
          typeNote = "Notification";
          content = `Đã chọn cổng ${e.target.value} để quét cho cổng ra`;
          setSelectedPorts((prevPorts) => ({
            ...prevPorts,
            exit: e.target.value,
          }));
          break;
        }

      case "anotherEntry":
        setUp = setUpAnotherSerialPortEntry(e.target.value, 9600);
        if (selectedPorts.entry === e.target.value) {
          content = `Đã chiếm cổng ${e.target.value} để quét cho cổng vào từ 1 cổng vào khác`;
          typeNote = "Warning";
          setSelectedPorts((prevPorts) => ({
            ...prevPorts,
            anotherEntry: e.target.value,
            entry: "",
          }));
          break;
        } else if (selectedPorts.exit === e.target.value) {
          content = `Đã chiếm cổng ${e.target.value} để quét cho cổng vào từ cổng ra `;
          typeNote = "Warning";
          setSelectedPorts((prevPorts) => ({
            ...prevPorts,
            anotherEntry: e.target.value,
            exit: "",
          }));
          break;
        } else if (selectedPorts.anotherExit === e.target.value) {
          content = `Đã chiếm cổng ${e.target.value} để quét cho cổng vào từ 1 cổng ra khác `;
          typeNote = "Warning";
          setSelectedPorts((prevPorts) => ({
            ...prevPorts,
            anotherEntry: e.target.value,
            anotherExit: "",
          }));
          break;
        } else {
          typeNote = "Notification";
          content = `Đã chọn cổng ${e.target.value} để quét cho cổng vào khác`;
          setSelectedPorts((prevPorts) => ({
            ...prevPorts,
            anotherEntry: e.target.value,
          }));
          break;
        }
      case "anotherExit":
        setUp = setUpAnotherSerialPortExit(e.target.value, 9600);
        if (selectedPorts.entry === e.target.value) {
          content = `Đã chiếm cổng ${e.target.value} để quét cho cổng ra từ cổng vào`;
          typeNote = "Warning";
          setSelectedPorts((prevPorts) => ({
            ...prevPorts,
            anotherExit: e.target.value,
            entry: "",
          }));
          break;
        } else if (selectedPorts.exit === e.target.value) {
          content = `Đã chiếm cổng ${e.target.value} để quét cho cổng ra từ 1 cổng ra khác `;
          typeNote = "Warning";
          setSelectedPorts((prevPorts) => ({
            ...prevPorts,
            anotherExit: e.target.value,
            exit: "",
          }));
          break;
        } else if (selectedPorts.anotherEntry === e.target.value) {
          content = `Đã chiếm cổng ${e.target.value} để quét cho cổng ra từ 1 cổng vào khác `;
          typeNote = "Warning";
          setSelectedPorts((prevPorts) => ({
            ...prevPorts,
            anotherExit: e.target.value,
            anotherEntry: "",
          }));
          break;
        } else {
          content = `Đã chọn cổng ${e.target.value} để quét cho cổng ra khác`;
          typeNote = "Notification";

          setSelectedPorts((prevPorts) => ({
            ...prevPorts,
            anotherExit: e.target.value,
          }));
          break;
        }
      default:
        console.warn(`Unknown type: ${type}`);
    }
    if (setUp) {
      setShowNotification({
        content: content,
        type: typeNote,
        show: true,
      });
    }
    // if (setUp.status === 400) {
    //   setShowNotification({
    //     content: `Cổng serial ${e.target.value} không được cung cấp hoặc đã bị sử dụng`,
    //     type: "Error",
    //     show: true,
    //   });
    // }
  };
  return (
    <div>
      {openSetting === false && (
        <div className="p-4">
          <label
            htmlFor="serial-ports"
            className="block text-lg font-medium mb-2"
          >
            Select a Serial Port:
          </label>
          <select
            id="serial-ports"
            value={
              type === "entry"
                ? selectedPorts?.entry
                : type === "exit"
                ? selectedPorts?.exit
                : type === "anotherEntry"
                ? selectedPorts?.anotherEntry
                : selectedPorts?.anotherExit
            }
            onChange={handleSelectedPort}
            className="border border-gray-300 rounded-lg p-2 w-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              -- Select a Port --
            </option>
            {ports.map((port) => (
              <option key={port.path} value={port.path}>
                {port.path}
              </option>
            ))}
          </select>
        </div>
      )}
      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
    </div>
  );
};

export default CameraConfiguration;
