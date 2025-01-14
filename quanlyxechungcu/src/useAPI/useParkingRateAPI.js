import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import axios from "axios"; // Import axios
import {
  ALL_PARKING_RATE,
  CREATE_PARKING_RATE,
  DELETE_PARKING_RATE,
  UPDATE_PARKING_RATE,
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
    const response = await axiosInstance.post(UPDATE_PARKING_RATE, {
      id: Fee._id,
      vehicleType: Fee.vehicleType,
      hourly_rate: Fee.hourly_rate,
      overnight_rate: Fee.overnight_rate,
      daily_rate: Fee.daily_rate,
      weekly_rate: Fee.weekly_rate,
      monthly_rate: Fee.monthly_rate,
      yearly_rate: Fee.yearly_rate,
      status: Fee.status,
    });

    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi cập nhật parkingRates:",
      error.response?.data?.error || error.message
    );
  }
};

export const createParkingRate = async (Fee) => {
  try {
    const response = await axiosInstance.put(CREATE_PARKING_RATE, {
      vehicleType: Fee.vehicleType,
      hourly_rate: Fee.hourly_rate,
      overnight_rate: Fee.overnight_rate,
      daily_rate: Fee.daily_rate,
      weekly_rate: Fee.weekly_rate,
      monthly_rate: Fee.monthly_rate,
      yearly_rate: Fee.yearly_rate,
      status: Fee.status,
    });

    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi cập nhật parkingRates:",
      error.response?.data?.error || error.message
    );
  }
};

export const deleteParkingRate = async (id) => {
  const token = Cookies.get("accessToken");
  // Kiểm tra nếu token không tồn tại
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.delete(DELETE_PARKING_RATE, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: {
        id: id,
      },
    });

    // console.log("Vehicle đã được xóa thành công.");
    return response.data.data; // Trả về dữ liệu phản hồi nếu cần sử dụng
  } catch (error) {
    console.error("Lỗi khi xóa:", error.response?.data || error);
  }
};
