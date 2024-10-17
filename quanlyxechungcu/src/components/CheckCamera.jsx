import React from "react";

const CheckCamera = ({ type }) => {
  return (
    <div className="bg-white shadow-lg p-4 rounded-lg">
      {/* Images */}
      <div className="grid grid-cols-2 gap-2">
        <img
          src="https://i1-vnexpress.vnecdn.net/2024/09/19/HyundaiSantaFevnexpressnet1JPG-1726701224.jpg?w=500&h=300&q=100&dpr=1&fit=crop&s=va_O9Cz7G1No2bKli1ClGA&t=image"
          alt="1"
        ></img>
        <img
          src="https://i1-vnexpress.vnecdn.net/2024/09/19/HyundaiSantaFevnexpressnet1JPG-1726701224.jpg?w=500&h=300&q=100&dpr=1&fit=crop&s=va_O9Cz7G1No2bKli1ClGA&t=image"
          alt="1"
        ></img>
      </div>

      {/* Car Info */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div>
          <h3 className="text-lg font-bold"> Biển số xe: 123123123</h3>
          <p>
            <span className="font-semibold">Loại xe:</span> 123123
          </p>
          <p>
            <span className="font-semibold">Giá vào:</span> 123213
          </p>
          <p>
            <span className="font-semibold">Thời gian vào: 123</span>{" "}
          </p>
          <p>
            <span className="font-semibold">Thời gian ra: 123</span>{" "}
          </p>
        </div>
        <div className="flex justify-center items-center">
          <img
            className="max-h-[120px] max-w-[120px]"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4D10s164IMG_GEyk14TKBIV6PrWpfje-5UA&s"
            alt=""
          ></img>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="block bg-[#ec7a00] border border-gray-100 w-[100px] rounded-md">
            <p className="p-1 text-center">
              {type === "entry" ? "Làn vào" : "Làn ra"}
            </p>
          </div>
          <span className="font-semibold text-red-700 text-center">
            BIỂN SỐ KHÔNG GIỐNG NHAU
          </span>
        </div>
      </div>
    </div>
  );
};

export default CheckCamera;
