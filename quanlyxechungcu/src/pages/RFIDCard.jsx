import React, { useEffect, useState } from "react";
import {
  addCard,
  deleteCard,
  findCardByUUID,
  getAllCard,
  setUpSerialPortEntry,
} from "../useAPI/useCardAPI";
import { getData, saveData } from "../context/indexedDB";
import Loading from "../components/Loading";
import { READ_RFID_CARD_ENTRY } from "../config/API";
import { GetUserByRFIDCard } from "../useAPI/useUserAPI";
import Notification from "../components/Notification";
const RFIDCard = () => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCardUUID, setNewCardUUID] = useState("");
  const [loading, setLoading] = useState(true);
  setUpSerialPortEntry("COM5", 9600);
  const [cardData, setCardData] = useState("");
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  useEffect(() => {
    const eventSource = new EventSource(READ_RFID_CARD_ENTRY);
    eventSource.onmessage = async (event) => {
      try {
        const newRfidData = event.data;
        // Cập nhật cardData mà không làm ảnh hưởng đến render
        setCardData(newRfidData);
        const check = await findCardByUUID(newRfidData);
        const userFinded = await GetUserByRFIDCard(newRfidData);
        console.log("check", check);
        if (check) {
          setShowNotification({
            content: `Thẻ ${newRfidData} đã có trong danh sách.`,
            type: "Error",
            show: true,
          });
        }
      } catch (error) {
        console.error("Lỗi khi xử lý dữ liệu từ EventSource:", error);
      }
    };
    return () => {
      eventSource.close(); // Đóng kết nối khi component unmount
    };
  }, []);
  useEffect(() => {
    const fetchCardData = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        const cards = await getAllCard();
        setCards(cards || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Dừng loading khi dữ liệu đã được fetch
      }
    };
    fetchCardData();
  }, []);

  const filteredCard =
    cards.length > 0
      ? cards.filter(
          (card) =>
            card.uuid &&
            card.uuid.toLowerCase().includes(searchTerm.toLowerCase()) // Kiểm tra card.uuid tồn tại trước khi gọi toLowerCase
        )
      : [];

  const handleCardClick = (card) => {
    if (selectedCard && selectedCard._id === card._id) {
      setSelectedCard(null); // Nếu thẻ đã được chọn, bỏ chọn
      setNewCardUUID(""); // Xóa giá trị input
    } else {
      setSelectedCard(card); // Chọn thẻ mới
      setNewCardUUID(card.uuid); // Cập nhật giá trị input thành UUID của thẻ đã chọn
    }
  };

  const isCardUUIDExists = cards.some((card) => card.uuid === newCardUUID);

  const handleAddCard = async (newCardUUID) => {
    if (newCardUUID) {
      // console.log("UUID", newCardUUID);
      const addedCard = await addCard(newCardUUID); // Kiểm tra xem addedCard có đúng không
      console.log("Thẻ mới được thêm:", addedCard); // Thêm log để kiểm tra
      setCards((prev) => [...prev, addedCard]); // Thêm thẻ mới vào danh sách
      setNewCardUUID("");
      const data = await getData("userData");
      if (data) {
        await saveData({
          id: "userData",
          ...data,
          cards: [...data.cards, addedCard], // Cập nhật danh sách thẻ mới
        });
      }
    }
  };

  const handleDeleteCard = async (id) => {
    if (!id) {
      console.error("ID của xe không hợp lệ");
      return;
    }

    try {
      await deleteCard(id);
      const data = await getData("userData");
      if (data && data.cards) {
        const updatedCards = data.cards.filter((card) => card._id !== id);
        await saveData({
          id: "userData",
          ...data,
          cards: updatedCards, // Cập nhật danh sách thẻ sau khi xóa
        });
      }

      setCards((prev) => prev.filter((card) => card._id !== id));

      setSelectedCard(null);
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
        <h1 className="text-xl font-semibold">Danh sách thẻ</h1>
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
                  {filteredCard.map((card) => (
                    <tr
                      key={card._id}
                      className={`text-center cursor-pointer ${
                        selectedCard && selectedCard._id === card._id
                          ? "bg-gray-200" // Đổi màu nền khi thẻ được chọn
                          : ""
                      }`}
                      onClick={() => handleCardClick(card)} // Thêm hàm nhấn vào thẻ
                    >
                      <td className="border p-2">{card.uuid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-span-9 bg-white border rounded p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Mã số:</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Nhập mã số thẻ mới"
                  value={newCardUUID} // Giá trị của input là mã số thẻ mới
                  onChange={(e) => setNewCardUUID(e.target.value)} // Cập nhật giá trị khi người dùng gõ vào input
                />
                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    className={`bg-blue-500 text-white px-4 py-2 rounded ${
                      isCardUUIDExists ? "opacity-50 cursor-not-allowed" : ""
                    }`} // Thêm class để vô hiệu hóa nút nếu UUID đã tồn tại
                    disabled={isCardUUIDExists} // Vô hiệu hóa nút nếu UUID đã tồn tại
                    onClick={() => handleAddCard(newCardUUID)} // Hàm thêm thẻ mới khi nhấn nút
                  >
                    THÊM
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => handleDeleteCard(selectedCard._id)}
                  >
                    XÓA
                  </button>
                  {/* <button className="bg-yellow-500 text-white px-4 py-2 rounded">
                  Sửa
                </button> */}
                </div>
              </div>

              <div className="flex items-center justify-center ">
                <div className="w-full max-w-3xl p-8 bg-white shadow-xl rounded-lg">
                  {/* Tiêu đề */}
                  {/* Ảnh động */}
                  <div className="flex justify-center mb-6">
                    <img
                      src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWFyeDVpcDZ4eG5kZWc2amhhZ2M1M2N6anFweTYzc21tdXB1M3NxOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xGulxHj3c2rT1yGs34/giphy.gif" // URL ảnh động quẹt thẻ
                      alt="Quẹt Thẻ"
                      className="w-40 h-40 object-contain"
                    />
                  </div>
                  {/* Hiển thị thông tin */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    Mã số thẻ:
                    <h2 className="text-lg font-semibold text-blue-600">
                      {cardData}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
    </div>
  );
};

export default RFIDCard;
