import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import { ALL_PARKING_RATE, UPDATE_PARKING_RATE } from "../config/API";
export const getAllParkingRate = async () => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await fetch(ALL_PARKING_RATE, {
      method: "PATCH",
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

    if (response.status === 200) {
      return data.data.parkingRates; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      console.error(
        "Có lỗi xảy ra khi lấy danh sách parkingRates:",
        data.error
      );
    }
  } catch (error) {
    console.error("Error during fetching parkingRates:", error);
  }
};
export const updateParkingRate = async (Fee) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await fetch(UPDATE_PARKING_RATE, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: Fee.id,
        price: Fee.price,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      return data.data.parkingRates; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      console.error(
        "Có lỗi xảy ra khi lấy danh sách parkingRates:",
        data.error
      );
    }
  } catch (error) {
    console.error("Error during fetching parkingRates:", error);
  }
};
