import { GET_SETTING, GET_SETTING_BY_ID, UPDATE_SETTING } from "../config/API";
import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import axios from "axios"; // Import axios

export const getAllSetting = async () => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const response = await axios.patch(
      GET_SETTING,
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

    return response.data.data.settings;
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy danh sách cài đặt:",
      error.response?.data?.error || error.message
    );
  }
};
export const updateSetting = async (setting) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const response = await axios.post(
      UPDATE_SETTING,
      {
        id: setting.id,
        entryLane: setting.entryLane,
        exitLane: setting.exitLane,
        secondaryEntryLane: setting.secondaryEntryLane,
        secondaryExitLane: setting.secondaryExitLane,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      } // Truyền ID vào body dưới dạng JSON}
    );

    return response.data.data;
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi cập nhật setting:",
      error.response?.data?.error || error.message
    );
  }
};

export const getSettingByID = async (id) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.patch(
      GET_SETTING_BY_ID,

      {
        id: id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi tìm bản cài đắt:",
      error.response?.data?.error || error.message
    );
    return error.response?.data?.error;
  }
};
