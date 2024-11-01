import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import axios from "axios"; // Import axios
import { ALL_PARKING_RATE, UPDATE_PARKING_RATE } from "../config/API";

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

export const getAllParkingRate = async () => {
  try {
    const response = await axiosInstance.patch(ALL_PARKING_RATE, {
      pageNumber: 1,
      pageSize: 20,
    });

    return response.data.data.parkingRates; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy danh sách parkingRates:",
      error.response?.data?.error || error.message
    );
  }
};

export const updateParkingRate = async (Fee) => {
  try {
    const response = await axiosInstance.put(UPDATE_PARKING_RATE, {
      id: Fee.id,
      price: Fee.price,
    });

    return response.data.data.parkingRates; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi cập nhật parkingRates:",
      error.response?.data?.error || error.message
    );
  }
};
