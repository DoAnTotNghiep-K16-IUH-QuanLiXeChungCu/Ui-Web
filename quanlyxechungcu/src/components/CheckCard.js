import React from "react";

const CheckCard = ({ type, color }) => {
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
          <p>
            Ô Tô: <span className={`font-bold ${color}`}>18</span>
          </p>
          <p>
            Xe Máy: <span className={`font-bold ${color}`}>18</span>
          </p>
          <p>
            Xe đạp điện: <span className={`font-bold ${color}`}>18</span>
          </p>
          <p>
            Nhà hầm: <span className={`font-bold ${color}`}>18</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckCard;
