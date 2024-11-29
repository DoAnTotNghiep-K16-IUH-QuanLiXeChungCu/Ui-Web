import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import axios from "axios"; // Import axios
import {
  CREATE_PAYROLL,
  DELETE_PAYROLL,
  GET_ALL_PAYROLL,
  GET_PAYROLL_BY_PERIOD,
  GET_PAYROLL_BY_YEAR_AND_USER,
  UPDATE_PAYROLL,
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

export const GetAllPayRoll = async () => {
  try {
    const response = await axiosInstance.patch(GET_ALL_PAYROLL, {
      pageNumber: 1,
      pageSize: 20,
    });

    return response.data.data.payRolls; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy danh sách PayRollFomula:",
      error.response?.data?.error || error.message
    );
  }
};

export const UpdatePayRoll = async (payRoll) => {
  try {
    const response = await axiosInstance.put(UPDATE_PAYROLL, {
      id: payRoll.id,
      userID: payRoll.userID,
      payPeriod: payRoll.payPeriod,
      totalRegularHours: payRoll.totalRegularHours,
      totalOvertimeHours: payRoll.totalOvertimeHours,
      basicSalary: payRoll.basicSalary,
      overtimeSalary: payRoll.overtimeSalary,
      deductions: payRoll.deductions,
      allowance: payRoll.allowance,
      totalSalary: payRoll.totalSalary,
      note: payRoll.note,
    });
    console.log("response.data", response.data);

    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi cập nhật payRollFomula:",
      error.response?.data?.error || error.message
    );
  }
};

export const CreatePayRoll = async (payRoll) => {
  try {
    const response = await axiosInstance.put(CREATE_PAYROLL, {
      userID: payRoll.userID,
      payPeriod: payRoll.payPeriod,
      totalRegularHours: payRoll.totalRegularHours,
      totalOvertimeHours: payRoll.totalOvertimeHours,
      basicSalary: payRoll.basicSalary,
      overtimeSalary: payRoll.overtimeSalary,
      deductions: payRoll.deductions,
      allowance: payRoll.allowance,
      totalSalary: payRoll.totalSalary,
      note: payRoll.note,
    });

    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi tạo 1 PayrollFomula:",
      error.response?.data?.error || error.message
    );
  }
};

export const DeletePayRoll = async (id) => {
  const token = Cookies.get("accessToken");
  // Kiểm tra nếu token không tồn tại
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.delete(DELETE_PAYROLL, {
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

export const GetPayRollByPeriod = async (month, year) => {
  try {
    const response = await axiosInstance.patch(GET_PAYROLL_BY_PERIOD, {
      month: month,
      year: year,
    });

    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      `Có lỗi xảy ra khi tìm PayRoll cho tháng ${month} năm ${year}:`,
      error.response?.data?.error || error.message
    );
    return [];
  }
};

export const GetPayRollByYearAndUserID = async (year, userId) => {
  try {
    const response = await axiosInstance.patch(GET_PAYROLL_BY_YEAR_AND_USER, {
      year: year,
      userId: userId,
    });

    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      `Có lỗi xảy ra khi tìm PayRoll cho nhân viene có id ${userId} năm ${year}:`,
      error.response?.data?.error || error.message
    );
    return [];
  }
};
