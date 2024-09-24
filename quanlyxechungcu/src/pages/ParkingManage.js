import React from "react";
import CheckCard from "./../components/CheckCard";
import CheckCamera from "../components/CheckCamera";

const ParkingManagement = () => {
  return (
    <div className="p-4">
      <header className="bg-gray-100 p-4 flex justify-between items-center">
        <div className="flex space-x-4 text-center">
          <CheckCard type="entry" color="text-green-500"></CheckCard>
          <CheckCard type="exit" color="text-yellow-500"></CheckCard>
          <CheckCard type="non-exit" color="text-red-500"></CheckCard>
        </div>
        <div className="border border-gray-400 rounded-lg ml-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold">Tổng Tiền</h2>
            <p className="text-red-500 font-bold">163,000 đ</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <CheckCamera type={"entry"}></CheckCamera>
        <CheckCamera type={"exit"}></CheckCamera>
      </div>
    </div>
  );
};

export default ParkingManagement;
