import Cookies from "js-cookie";
import { ALL_SHIFT, ALL_USER } from "../config/API";
import { format } from "date-fns";
export const getAllUser = async () => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const response = await fetch(ALL_USER, {
      method: "PATCH",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageNumber: 1,
        pageSize: 20,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return data.data.users; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      console.error("Có lỗi xảy ra khi lấy dữ liệu User: ", data.error);
      return data.error;
    }
  } catch (error) {
    console.log("ERROR________-", error);
  }
};
