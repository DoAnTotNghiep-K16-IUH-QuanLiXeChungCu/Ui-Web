import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import axios from "axios"; // Import axios
import {
  CREATE_TIMEKEEPING,
  DELETE_TIMEKEEPING,
  GET_ALL_TIMEKEEPING,
  UPDATE_TIMEKEEPING,
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

export const getAllTimeKeeping = async () => {
  try {
    const response = await axiosInstance.patch(GET_ALL_TIMEKEEPING, {
      pageNumber: 1,
      pageSize: 20,
    });

    return response.data.data.timeKeeping; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy danh sách TimeKeeping:",
      error.response?.data?.error || error.message
    );
  }
};
export const createTimeKeeping = async (timeKeeping) => {
  try {
    const response = await axiosInstance.post(CREATE_TIMEKEEPING, {
      userId: timeKeeping.userId,
      workDate: timeKeeping.workDate,
      checkIn: timeKeeping.checkIn,
    });
    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi tạo 1 TimeKeeping:",
      error.response?.data?.error || error.message
    );
  }
};
export const updateTimeKeeping = async (timeKeeping) => {
  try {
    const response = await axiosInstance.put(UPDATE_TIMEKEEPING, {
      userId: timeKeeping.userId,
      workDate: timeKeeping.workDate,
      checkOut: timeKeeping.checkOut,
    });
    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi cập nhật TimeKeeping:",
      error.response?.data?.error || error.message
    );
  }
};

export const deleteTimeKeeping = async (id) => {
  const token = Cookies.get("accessToken");
  // Kiểm tra nếu token không tồn tại
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.delete(DELETE_TIMEKEEPING, {
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
