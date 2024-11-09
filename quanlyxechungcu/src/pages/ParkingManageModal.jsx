import React, { useState, useEffect } from "react";
const ParkingManageModal = ({
  showModal,
  setShowModal,
  recordType,
  setRecordType,
}) => {
  if (!showModal) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[400px]">
        <h2 className="text-lg font-semibold mb-4">Chọn loại cổng quét</h2>
        <div className="space-y-4">
          <div className="mb-4">
            <label className="block mb-2">Loại cổng quét:</label>
            <select
              name="isResident"
              className="border p-2 rounded w-full"
              value={recordType}
              onChange={(e) => {
                setRecordType(e.target.value);
                setShowModal(false);
              }}
            >
              <option value="">Chọn loại cổng quét</option>
              <option value="EnEn">2 cổng vào</option>
              <option value="EnEx">1 cổng vào 1 cổng ra</option>
              <option value="ExEx">2 cổng ra</option>
            </select>
          </div>
          <div className="flex justify-end">
            {/* <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={setShowModal(false)}
            >
              Chọn
            </button> */}
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              onClick={() => setShowModal(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingManageModal;
