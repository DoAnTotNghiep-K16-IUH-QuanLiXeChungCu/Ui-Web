import React, { useEffect, useState } from "react";
import { LIST_PORT } from "../config/API";
import {
  setUpAnotherSerialPortEntry,
  setUpAnotherSerialPortExit,
  setUpSerialPortEntry,
  setUpSerialPortExit,
} from "../useAPI/useCardAPI";
import Notification from "./Notification";

const CameraConfiguration = ({ openSetting, type }) => {
  const [ports, setPorts] = useState([]);
  const [selectedPort, setSelectedPort] = useState("");
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
    setSelectedPort(e.target.value);
    let setUp;
    let content;
    switch (type) {
      case "entry":
        setUp = setUpSerialPortEntry(e.target.value, 9600);
        content = `Đã chọn cổng ${e.target.value} để quét cho cổng vào`;
        break;
      case "exit":
        setUp = setUpSerialPortExit(e.target.value, 9600);
        content = `Đã chọn cổng ${e.target.value} để quét cho cổng ra`;
        break;
      case "anotherEntry":
        setUp = setUpAnotherSerialPortEntry(e.target.value, 9600);
        content = `Đã chọn cổng ${e.target.value} để quét cho 1 cổng vào khác`;
        break;
      case "anotherExit":
        setUp = setUpAnotherSerialPortExit(e.target.value, 9600);
        content = `Đã chọn cổng ${e.target.value} để quét cho 1 cổng ra khác`;
        break;
      default:
        console.warn(`Unknown type: ${type}`);
    }
    if (setUp) {
      setShowNotification({
        content: content,
        type: "Notification",
        show: true,
      });
    }
    if (setUp.status === 400) {
      setShowNotification({
        content: `Cổng serial ${e.target.value} không được cung cấp hoặc đã bị sử dụng`,
        type: "Error",
        show: true,
      });
    }
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
            value={selectedPort}
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
