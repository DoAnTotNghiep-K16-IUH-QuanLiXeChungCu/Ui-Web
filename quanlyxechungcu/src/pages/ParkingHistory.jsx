import React, { useEffect, useState } from "react";
import CheckEE from "../components/ParkingHistory/CheckEE";
import { FindExitRecordByEntryRecordID } from "../useAPI/useRecordAPI";
import { getALLEntryRecord } from "../useAPI/useRecordAPI";
import { FindCustomerByLicensePlate } from "../useAPI/useVehicleAPI";

const ParkingHistory = () => {
  const [record, setRecord] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  // const fetchData = async () => {
  //   try {
  //     const record = await getAllRecord();
  //     setRecord(record || []);
  //   } catch (error) {
  //     console.error("Có lỗi xảy ra:", error);
  //   }
  // };

  const fetchData = async () => {
    try {
      const entryRecord = await getALLEntryRecord(); // Sử dụng await để lấy dữ liệu

      // Gọi API lấy thông tin khách hàng cho từng vé dựa trên vehicleId
      const record = await Promise.all(
        entryRecord.map(async (entryRecord) => {
          const exitRecord = await FindExitRecordByEntryRecordID(
            entryRecord._id
          );
          const customer =
            (await FindCustomerByLicensePlate(entryRecord.licensePlate)) ||
            null;
          // Lấy thông tin khách hàng
          return {
            ...entryRecord,
            exitRecord,
            customer,
            // Gộp thông tin khách hàng vào đối tượng vé
          };
        })
      );
      console.log("______", record); // Kiểm tra dữ liệu đã gộp
      setRecord(record || []); // Đảm bảo rằng ticketsWithCustomer là mảng hoặc mảng rỗng
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const filteredRecord =
    record.length > 0
      ? record.filter(
          (record) =>
            record.licensePlate
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            record.rfidId.uuid
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            record.customer?.fullName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            record.users_shiftId?.userId.username
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      : [];

  const handleRowClick = (record) => {
    setSelectedRecord(record);
  };
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto bg-white shadow-md rounded p-4">
        <h1 className="text-lg font-semibold mb-4">
          Tra cứu thông tin xe vé, ra
        </h1>

        <div className="grid grid-cols-5 gap-4">
          {/* Table */}
          <div className="col-span-2 ">
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="border p-2 rounded"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Nơi đổ data vào */}
            <div className="overflow-x-auto rounded bg-gray-100 border p-4">
              <div className="h-[500px] overflow-y-scroll">
                <table className="min-w-full bg-white border rounded">
                  <thead>
                    <tr className="bg-slate-300">
                      <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                        Số thẻ
                      </th>
                      <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                        Biển số
                      </th>
                      <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                        Phân loại
                      </th>
                      <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                        Chủ xe
                      </th>
                      <th className="border p-2 sticky top-0 bg-slate-300 z-10">
                        Người trực
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecord.map((record, index) => (
                      <tr
                        key={record._id}
                        className={"text-center cursor-pointer"}
                        onClick={() => handleRowClick(record)}
                      >
                        <td className="border p-2">
                          {record.rfidId && record.rfidId.uuid
                            ? record.rfidId.uuid
                            : "Không có số thẻ"}
                        </td>

                        <td className="border p-2">{record.licensePlate}</td>
                        <td className="border p-2">
                          {record.isResident === true
                            ? "Trong khu dân cư"
                            : "Vãn lai"}
                        </td>
                        <td className="border p-2">
                          {record.customer && record.customer.fullName
                            ? record.customer.fullName // Trả về tên khách hàng nếu tồn tại
                            : "Không có"}
                        </td>
                        <td className="border p-2">
                          {record.users_shiftId.userId.username}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="col-span-3 bg-white border p-4 rounded">
            <div className="flex space-x-4 p-2 border border-gray-900">
              <p>
                Ô Tô: <span className={`font-bold text-red-500`}>18</span>
              </p>
              <p>
                Xe Máy: <span className={`font-bold text-red-500`}>18</span>
              </p>
              <p>
                Xe đạp điện:{" "}
                <span className={`font-bold text-red-500`}>18</span>
              </p>
              <p>
                Nhà hầm: <span className={`font-bold text-red-500`}>18</span>
              </p>
            </div>

            <CheckEE
              type="entry"
              time={selectedRecord?.entryTime || ""} // Kiểm tra nếu selectedRecord tồn tại
              front_pic={selectedRecord?.picture_front} // Sử dụng toán tử optional chaining
              back_pic={selectedRecord?.picture_back} // Sử dụng toán tử optional chaining
            />

            <CheckEE
              type="exit"
              time={selectedRecord?.exitRecord?.exitTime || ""} // Kiểm tra nếu selectedRecord tồn tại
              front_pic={selectedRecord?.exitRecord?.picture_front} // Sử dụng toán tử optional chaining
              back_pic={selectedRecord?.exitRecord?.picture_back} // Sử dụng toán tử optional chaining
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingHistory;
