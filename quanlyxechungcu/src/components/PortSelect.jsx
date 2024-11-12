import React from "react";

const PortSelect = ({ ports, selectedPort, onChange }) => {
  //   console.log("selectedPort", selectedPort);

  return (
    <div>
      <div>
        <label className="mr-2 p-2">PORT</label>
        <select
          value={selectedPort || ""}
          onChange={(e) => {
            const newPort = e.target.value;
            console.log("newPort", newPort);

            onChange(newPort); // Gọi hàm callback onChange từ parent component
          }}
          className="border p-2 rounded"
        >
          <option value="">Tất cả</option>
          {ports.length > 0 ? (
            ports.map((port) => (
              <option key={port.path} value={port.path}>
                {port.path}
              </option>
            ))
          ) : (
            <option disabled>No ports found</option>
          )}
        </select>
      </div>
    </div>
  );
};

export default PortSelect;
