import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import axios from "axios"; // Import axios
import {
  ADD_CARD,
  ALL_CARD,
  CARD_BY_UUID,
  DELETE_CARD,
  SET_UP_ANOTHER_SERIAL_PORT_ENTRY,
  SET_UP_ANOTHER_SERIAL_PORT_EXIT,
  SET_UP_SERIAL_PORT_ENTRY,
  SET_UP_SERIAL_PORT_EXIT,
} from "../config/API";

export const getAllCard = async () => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.patch(
      ALL_CARD,
      {
        pageNumber: 1,
        pageSize: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data.rfidCards; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy danh sách thẻ:",
      error.response?.data?.error || error.message
    );
  }
};

export const addCard = async (uuid) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const response = await axios.post(
      ADD_CARD,
      {
        uuid,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Thẻ đã được thêm thành công.", response.data);
    return response.data.data; // Trả về dữ liệu phản hồi nếu cần sử dụng
  } catch (error) {
    console.error(
      "Lỗi khi thêm thẻ:",
      error.response?.data?.error || error.message
    );
  }
};

export const findCardByUUID = async (uuid) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const response = await axios.patch(
      CARD_BY_UUID,
      {
        uuid,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // console.log("Dữ liệu trả về", response.data);
    return response.data.data; // Trả về dữ liệu phản hồi nếu cần sử dụng
  } catch (error) {
    console.error(
      "Lỗi khi tìm thẻ:",
      error.response?.data?.error || error.message
    );
  }
};

export const deleteCard = async (id) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.delete(DELETE_CARD, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: {
        id, // Truyền ID vào body dưới dạng JSON
      },
    });

    console.log("Thẻ đã được xóa thành công.");
    return response.data; // Trả về dữ liệu phản hồi nếu cần sử dụng
  } catch (error) {
    console.error(
      "Lỗi khi xóa thẻ:",
      error.response?.data?.error || error.message
    );
  }
};

export const setUpSerialPortEntry = async (com, baudRate) => {
  try {
    const response = await axios.post(
      SET_UP_SERIAL_PORT_ENTRY,
      {
        comPort: com,
        baudRate: baudRate,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Kết nối thành công qua cổng: ", com);
    return response.data; // Trả về dữ liệu phản hồi nếu cần sử dụng
  } catch (error) {
    console.error(
      "Lỗi khi kết nối:",
      error.response?.data?.error || error.message
    );
  }
};

export const setUpSerialPortExit = async (com, baudRate) => {
  try {
    const response = await axios.post(
      SET_UP_SERIAL_PORT_EXIT,
      {
        comPort: com,
        baudRate: baudRate,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Kết nối thành công qua cổng: ", com);
    return response.data; // Trả về dữ liệu phản hồi nếu cần sử dụng
  } catch (error) {
    console.error(
      "Lỗi khi kết nối:",
      error.response?.data?.error || error.message
    );
  }
};

export const setUpAnotherSerialPortEntry = async (com, baudRate) => {
  try {
    const response = await axios.post(
      SET_UP_ANOTHER_SERIAL_PORT_ENTRY,
      {
        comPort: com,
        baudRate: baudRate,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Kết nối thành công qua cổng: ", com);
    return response.data; // Trả về dữ liệu phản hồi nếu cần sử dụng
  } catch (error) {
    console.error(
      "Lỗi khi kết nối:",
      error.response?.data?.error || error.message
    );
  }
};

export const setUpAnotherSerialPortExit = async (com, baudRate) => {
  try {
    const response = await axios.post(
      SET_UP_ANOTHER_SERIAL_PORT_EXIT,
      {
        comPort: com,
        baudRate: baudRate,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Kết nối thành công qua cổng: ", com);
    return response.data; // Trả về dữ liệu phản hồi nếu cần sử dụng
  } catch (error) {
    console.error(
      "Lỗi khi kết nối:",
      error.response?.data?.error || error.message
    );
  }
};
