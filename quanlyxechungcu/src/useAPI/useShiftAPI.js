import Cookies from "js-cookie";
import { ALL_SHIFT, FILTER_USER_SHIFT } from "../config/API";
import { format } from "date-fns";
export const getAllShift = async () => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const response = await fetch(ALL_SHIFT, {
      method: "PATCH",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageNumber: 1,
        pageSize: 5,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return data.data.shifts; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      console.error("Có lỗi xảy ra khi tạo vé tháng: ", data.error);
      return data.error;
    }
  } catch (error) {
    console.log("ERROR________-", error);
  }
};
