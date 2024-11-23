import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import axios from "axios"; // Import axios
import {
  CREATE_PAYROLL_FORMULA,
  DELETE_PAYROLL_FORMULA,
  GET_ALL_PAYROLL_FORMULA,
  UPDATE_PAYROLL_FORMULA,
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

export const GetAllPayRollFomula = async () => {
  try {
    const response = await axiosInstance.patch(GET_ALL_PAYROLL_FORMULA, {
      pageNumber: 1,
      pageSize: 20,
    });

    return response.data.data.payRollFomulas; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy danh sách PayRollFomula:",
      error.response?.data?.error || error.message
    );
  }
};

export const UpdatePayRollFomula = async (fomula) => {
  try {
    const response = await axiosInstance.post(UPDATE_PAYROLL_FORMULA, {
      id: fomula._id,
      role: fomula.role,
      basicRatePerHour: fomula.basicRatePerHour,
      overtimeRate: fomula.overtimeRate,
      deductions: fomula.deductions,
      allowance: fomula.allowance,
      status: fomula.status,
    });

    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi cập nhật payRollFomula:",
      error.response?.data?.error || error.message
    );
  }
};

export const CreatePayRollFomula = async (fomula) => {
  console.log("fomula__", fomula);
  try {
    const response = await axiosInstance.put(CREATE_PAYROLL_FORMULA, {
      role: fomula.role,
      basicRatePerHour: fomula.basicRatePerHour,
      overtimeRate: fomula.overtimeRate,
      deductions: fomula.deductions,
      allowance: fomula.allowance,
    });

    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi tạo 1 PayrollFomula:",
      error.response?.data?.error || error.message
    );
  }
};

export const DeletePayRollFomula = async (id) => {
  const token = Cookies.get("accessToken");
  // Kiểm tra nếu token không tồn tại
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.delete(DELETE_PAYROLL_FORMULA, {
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
