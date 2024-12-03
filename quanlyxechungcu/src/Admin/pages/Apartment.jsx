import React, { useEffect, useState } from "react";
import { getAllApartment } from "../../useAPI/useApartmentAPI";
import Loading from "../components/Loading";
const Apartment = () => {
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newApartment, setNewApartment] = useState(""); // Khởi tạo state cho mã số thẻ mới
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const apartments = await getAllApartment();
        setApartments(apartments || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const filteredApartment =
    apartments?.length > 0
      ? apartments.filter(
          (apartment) =>
            apartment.name &&
            apartment.name.toLowerCase().includes(searchTerm.toLowerCase()) // Kiểm tra apartment.uuid tồn tại trước khi gọi toLowerCase
        )
      : [];

  const handleApartmentClick = (apartment) => {
    if (selectedApartment && selectedApartment._id === apartment._id) {
      setSelectedApartment(null); // Nếu thẻ đã được chọn, bỏ chọn
      setNewApartment(""); // Xóa giá trị input
    } else {
      setSelectedApartment(apartment); // Chọn thẻ mới
      setNewApartment(apartment.name); // Cập nhật giá trị input thành UUID của thẻ đã chọn
    }
  };

  const isapartmentApartmnetExists = apartments?.some(
    (apartment) => apartment.name === newApartment
  );

  const handleAddApartment = async (newApartment) => {
    if (newApartment) {
      console.log("Apartment ", newApartment);
      // console.log("Thẻ mới được thêm:", addedapartment); // Thêm log để kiểm tra
      // setApartments((prev) => [...prev, addedapartment]); // Thêm thẻ mới vào danh sách
      setNewApartment(""); // Reset giá trị input sau khi thêm
    }
  };

  const handleDeleteApartment = async (id) => {
    if (!id) {
      console.error("ID của xe không hợp lệ");
      return;
    }

    try {
      setApartments((prev) => prev.filter((apartment) => apartment._id !== id));
      setSelectedApartment(null);
      console.log(`thẻ ID ${id} đã được xóa thành công.`);
    } catch (error) {
      console.error("Có lỗi khi xóa xe:", error);
    }
  };
  if (loading) {
    return <Loading />; // Hiển thị Loading nếu đang tải dữ liệu
  }
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-xl font-semibold">Danh sách các phòng</h1>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="border p-2 rounded w-[500px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3 bg-gray-50 border rounded p-4">
            <div className="h-[400px] overflow-y-scroll">
              <table className="min-w-full bg-white border rounded">
                <tbody>
                  {filteredApartment.map((apartment) => (
                    <tr
                      key={apartment._id}
                      className={`text-center cursor-pointer ${
                        selectedApartment &&
                        selectedApartment._id === apartment._id
                          ? "bg-gray-200" // Đổi màu nền khi thẻ được chọn
                          : ""
                      }`}
                      onClick={() => handleApartmentClick(apartment)} // Thêm hàm nhấn vào thẻ
                    >
                      <td className="border p-2">{apartment.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-span-9 bg-white border rounded p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Tên phòng:</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Nhập tên phòng mới"
                  value={newApartment} // Giá trị của input là mã số thẻ mới
                  onChange={(e) => setNewApartment(e.target.value)} // Cập nhật giá trị khi người dùng gõ vào input
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-4">
              <button
                className={`bg-blue-500 text-white px-4 py-2 rounded ${
                  isapartmentApartmnetExists
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`} // Thêm class để vô hiệu hóa nút nếu UUID đã tồn tại
                disabled={isapartmentApartmnetExists} // Vô hiệu hóa nút nếu UUID đã tồn tại
                onClick={() => handleAddApartment(newApartment)} // Hàm thêm thẻ mới khi nhấn nút
              >
                THÊM
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleDeleteApartment(selectedApartment._id)}
              >
                XÓA
              </button>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded">
                Sửa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Apartment;
