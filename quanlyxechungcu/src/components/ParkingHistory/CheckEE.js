import React from "react";

const CheckEE = ({ type }) => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 col-span-1 p-2">
        <div>
          <img
            src="https://i1-vnexpress.vnecdn.net/2024/09/19/HyundaiSantaFevnexpressnet1JPG-1726701224.jpg?w=500&h=300&q=100&dpr=1&fit=crop&s=va_O9Cz7G1No2bKli1ClGA&t=image"
            alt="Hình ảnh ra"
            className="w-full h-48 object-cover rounded"
          />
        </div>
        <div>
          <img
            src="https://i1-vnexpress.vnecdn.net/2024/09/19/HyundaiSantaFevnexpressnet1JPG-1726701224.jpg?w=500&h=300&q=100&dpr=1&fit=crop&s=va_O9Cz7G1No2bKli1ClGA&t=image"
            alt="Hình ảnh vào"
            className="w-full h-48 object-cover rounded"
          />
        </div>
      </div>
      <div
        className={`mt-2 w-full p-2 ${
          type === "entry"
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-red-500 hover:bg-red-600"
        } text-white rounded`}
      >
        {type === "entry" ? "HÌNH ẢNH VÀO" : "HÌNH ẢNH RA"}
      </div>
    </div>
  );
};

export default CheckEE;
