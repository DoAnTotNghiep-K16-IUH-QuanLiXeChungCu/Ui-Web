import React, { useEffect, useState } from "react";
import { LIST_PORT } from "../config/API";

const CameraConfiguration = () => {
  const [ports, setPorts] = useState([]);
  const [selectedPort, setSelectedPort] = useState("");

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

  return (
    <div className="p-4">
      <label htmlFor="serial-ports" className="block text-lg font-medium mb-2">
        Select a Serial Port:
      </label>
      <select
        id="serial-ports"
        value={selectedPort}
        onChange={(e) => setSelectedPort(e.target.value)}
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
      {selectedPort && (
        <p className="mt-4 text-gray-700">
          You selected: <strong>{selectedPort}</strong>
        </p>
      )}
    </div>
  );
};

export default CameraConfiguration;
