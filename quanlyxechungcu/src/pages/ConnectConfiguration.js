import React from "react";

const ConnectConfiguration = () => {
  return (
    <div className="container max-w-7xl mx-auto p-4 bg-gray-100">
      <div className="grid grid-cols-4 gap-4 mb-4">
        <button className="p-2 bg-blue-500 text-white rounded">
          Lưu cấu hình
        </button>
        <button className="p-2 bg-blue-500 text-white rounded">
          Cấu hình người dùng
        </button>
        <button className="p-2 bg-blue-500 text-white rounded">
          Quản lý dữ liệu
        </button>
        <button className="p-2 bg-blue-500 text-white rounded">
          Gửi báo cáo qua Email
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-4">Cấu hình chung</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">Hình ảnh</label>
            <input
              type="text"
              className="border rounded p-2 w-full"
              value="D:\\Vinparking\\HìnhẢnh"
            />
            <button className="mt-2 bg-gray-300 p-2 rounded">Chọn...</button>
          </div>
          <div>
            <label className="block font-medium">Thiết bị</label>
            <select className="border rounded p-2 w-full">
              <option>Hikvision</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Dự phòng</label>
            <input type="text" className="border rounded p-2 w-full" />
            <button className="mt-2 bg-gray-300 p-2 rounded">Chọn...</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* Lane 1 */}
        <div>
          <LaneConfiguration title="Làn xe trái" />
          <RemoteReaderConfiguration title="Đầu đọc tầm xa" />
          <CameraConfiguration title="Cấu hình Camera" />
        </div>

        {/* Lane 2 */}
        <div>
          <LaneConfiguration title="Làn xe phải" />
          <RemoteReaderConfiguration title="Đầu đọc tầm xa" />
          <CameraConfiguration title="Cấu hình Camera" />
        </div>
      </div>
    </div>
  );
};

// Component cấu hình làn xe
const LaneConfiguration = ({ title }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block font-medium">Loại xe</label>
          <input
            type="text"
            className="border rounded p-2 w-full"
            value="Vào"
          />
        </div>
        <div>
          <label className="block font-medium">Số làn</label>
          <input type="text" className="border rounded p-2 w-full" value="2" />
        </div>
        <div>
          <label className="block font-medium">Lưu vào</label>
          <input type="text" className="border rounded p-2 w-full" value="30" />
        </div>
        <div>
          <label className="block font-medium">Lưu ra</label>
          <input type="text" className="border rounded p-2 w-full" value="30" />
        </div>
        <div>
          <label className="block font-medium">Barrier</label>
          <input type="text" className="border rounded p-2 w-full" value="1" />
        </div>
        <div>
          <label className="block font-medium">Đếm xe</label>
          <input type="text" className="border rounded p-2 w-full" value="2" />
        </div>
      </div>
    </div>
  );
};

// Component cấu hình Đầu đọc tầm xa
const RemoteReaderConfiguration = ({ title }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block font-medium">Đầu đọc</label>
          <select className="border rounded p-2 w-full">
            <option>Không</option>
            <option>Answer</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">IP</label>
          <input
            type="text"
            className="border rounded p-2 w-full"
            value="192.168.1.190"
          />
        </div>
        <div>
          <label className="block font-medium">Port</label>
          <input
            type="text"
            className="border rounded p-2 w-full"
            value="6000"
          />
        </div>
      </div>
    </div>
  );
};

// Component cấu hình Camera
const CameraConfiguration = ({ title }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 gap-4">
        <CameraInput
          title="Camera chụp biển số Xe Máy"
          ip="14.161.12.244:81"
          port="8000"
          channel="1"
          username="admin"
        />
        <CameraInput
          title="Camera chụp người điều khiển Xe Máy"
          ip="192.168.1.64"
          port="8000"
          channel="1"
          username="admin"
        />
        <CameraInput
          title="Camera 3"
          ip="192.168.1.64"
          port="8000"
          channel="1"
          username="admin"
        />
        <CameraInput
          title="Camera 4"
          ip="118.69.78.228"
          port="8200"
          channel="4"
          username="demo"
        />
      </div>
    </div>
  );
};

// Component cho từng camera input
const CameraInput = ({ title, ip, port, channel, username }) => {
  return (
    <div className="grid grid-cols-5 gap-2 items-center">
      <div className="col-span-2">
        <label className="block font-medium">{title}</label>
        <p>cấu hình</p>
      </div>
      <div>
        <input type="text" className="border rounded p-2 w-full" value={ip} />
      </div>
      <div>
        <input type="text" className="border rounded p-2 w-full" value={port} />
      </div>
      <div>
        <input
          type="text"
          className="border rounded p-2 w-full"
          value={channel}
        />
      </div>
      <div>
        <input
          type="text"
          className="border rounded p-2 w-full"
          value={username}
        />
      </div>
      <div>
        <input
          type="password"
          className="border rounded p-2 w-full"
          value="••••••••"
        />
      </div>
    </div>
  );
};

export default ConnectConfiguration;
