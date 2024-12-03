import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import axios from "axios"; // Import axios
import { ESTIMATE_PARKING_TRANSACTION } from "../config/API";

export const EstimateParkingTransaction = async (
  licensePlate,
  vehicleType,
  entryTime,
  exitTime
) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  console.log("licensePlate", licensePlate);
  console.log("vehicleType", vehicleType);
  console.log("entryTime", entryTime);
  console.log("exitTime", exitTime);

  try {
    const response = await axios.patch(
      ESTIMATE_PARKING_TRANSACTION,
      {
        licensePlate: licensePlate,
        vehicleType: vehicleType,
        entryTime: entryTime,
        exitTime: exitTime,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy danh sách vé tháng:",
      error.response?.data?.error || error.message
    );
  }
};
