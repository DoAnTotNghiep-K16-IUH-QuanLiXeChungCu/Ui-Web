import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import {
  ADD_CARD,
  ALL_CARD,
  DELETE_CARD,
  SET_UP_SERIAL_PORT_ENTRY,
  SET_UP_SERIAL_PORT_EXIT,
  SET_UP_SERIALPORT,
} from "../config/API";
export const getAllCard = async () => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await fetch(ALL_CARD, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageNumber: 1,
        pageSize: 20,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      return data.data.rfidCards;
    } else {
      console.error("Có lỗi xảy ra khi lấy danh sách vé tháng:", data.error);
    }
  } catch (error) {
    console.error("Error during fetching monthly tickets:", error);
  }
};
export const addCard = async (uuid) => {
  const token = Cookies.get("accessToken");
  // Kiểm tra nếu token không tồn tại
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  // Kiểm tra giá trị của uuid
  console.log("Gửi dữ liệu:", { uuid }); // Ghi lại dữ liệu gửi đi

  try {
    const response = await fetch(ADD_CARD, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uuid }), // Truyền ID vào body dưới dạng JSON
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Lỗi API: ${errorData.message || response.status}`);
    }
    const data = await response.json();
    console.log("Thẻ đã được thêm thành công.", data);
    return data.data; // Trả về dữ liệu phản hồi nếu cần sử dụng
  } catch (error) {
    console.error("Lỗi khi thêm thẻ:", error);
  }
};

export const deleteCard = async (id) => {
  const token = Cookies.get("accessToken");

  // Kiểm tra nếu token không tồn tại
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await fetch(DELETE_CARD, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }), // Truyền ID vào body dưới dạng JSON
    });

    // Kiểm tra nếu API trả về thành công
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Lỗi API: ${errorData.message || response.status}`);
    }

    console.log("Thẻ đã được xóa thành công.");
    return response.json(); // Trả về dữ liệu phản hồi nếu cần sử dụng
  } catch (error) {
    console.error("Lỗi khi xóa thẻ:", error);
  }
};

export const setUpSerialPortEntry = (com, baudRate) => {
  try {
    const response = fetch(SET_UP_SERIAL_PORT_ENTRY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comPort: com, baudRate: baudRate }), // Truyền ID vào body dưới dạng JSON
    });

    // Kiểm tra nếu API trả về thành công
    if (!response.ok) {
      if (!response.ok) {
        throw new Error("Không thể khởi tạo cổng serial");
      }
      return response.text();
    }
    console.log("Kết nối thành công qua cổng: ", com);

    return response.json(); // Trả về dữ liệu phản hồi nếu cần sử dụng
  } catch (error) {
    console.error("Lỗi khi kết nối:", error);
  }
};

export const setUpSerialPortExit = (com, baudRate) => {
  try {
    const response = fetch(SET_UP_SERIAL_PORT_EXIT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comPort: com, baudRate: baudRate }), // Truyền ID vào body dưới dạng JSON
    });

    // Kiểm tra nếu API trả về thành công
    if (!response.ok) {
      if (!response.ok) {
        throw new Error("Không thể khởi tạo cổng serial");
      }
      return response.text();
    }
    console.log("Kết nối thành công qua cổng: ", com);

    return response.json(); // Trả về dữ liệu phản hồi nếu cần sử dụng
  } catch (error) {
    console.error("Lỗi khi kết nối:", error);
  }
};
