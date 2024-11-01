import Cookies from "js-cookie";
import { ALL_SHIFT, ALL_USER } from "../config/API";
import { format } from "date-fns";
import axios from "axios"; // Import axios

export const getAllUser = async () => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.patch(
      ALL_USER,
      {
        pageNumber: 1,
        pageSize: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true, // Để gửi cookie cùng với yêu cầu
      }
    );

    return response.data.data.users; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy dữ liệu User:",
      error.response?.data?.error || error.message
    );
    return null; // Hoặc có thể trả về giá trị nào khác nếu cần
  }
};
