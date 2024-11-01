import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import axios from "axios"; // Import axios
import {
  ALL_PARKING_SLOT,
  AVAILABE_PARKING_SLOT_BY_TYPE,
  PARKING_SLOT_BY_ID,
} from "../config/API";

// Tạo một instance axios với cấu hình mặc định
const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để tự động thêm token vào header cho mỗi yêu cầu
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAllParkingSlot = async () => {
  try {
    const response = await axiosInstance.patch(ALL_PARKING_SLOT, {
      pageNumber: 1,
      pageSize: 1000,
    });

    return response.data.data.parkingSlots; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy danh sách parking slots:",
      error.response?.data?.error || error.message
    );
  }
};

export const getAllAvailabeParkingSlotByType = async (type) => {
  try {
    const response = await axiosInstance.patch(AVAILABE_PARKING_SLOT_BY_TYPE, {
      slotType: type,
    });

    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy danh sách parking slots theo loại:",
      error.response?.data?.error || error.message
    );
  }
};

export const findParkingSlotByID = async (id) => {
  try {
    const response = await axiosInstance.patch(PARKING_SLOT_BY_ID, {
      id: id,
    });

    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi tìm parking slot:",
      error.response?.data?.error || error.message
    );
  }
};
