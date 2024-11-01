import Cookies from "js-cookie";
import { ALL_SHIFT, FILTER_USER_SHIFT } from "../config/API";
import { format } from "date-fns";
import axios from "axios"; // Import axios

export const getAllShift = async () => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.patch(
      ALL_SHIFT,
      {
        pageNumber: 1,
        pageSize: 5,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true, // Để gửi cookie cùng với yêu cầu
      }
    );

    return response.data.data.shifts; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy ca làm việc:",
      error.response?.data?.error || error.message
    );
    return null; // Hoặc có thể trả về giá trị nào khác nếu cần
  }
};
