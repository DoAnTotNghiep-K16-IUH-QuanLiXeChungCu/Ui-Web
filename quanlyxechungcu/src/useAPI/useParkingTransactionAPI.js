import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import axios from "axios"; // Import axios
import { ESTIMATE_PARKING_TRANSACTION,GET_TOTAL_FEES_FOR_CURRENT_AND_PREVIOUS_MONTH } from "../config/API";

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

export const getTotalFeesForCurrentAndPreviousMonth = async (month, year) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  // Kiểm tra nếu tháng và năm được truyền vào hợp lệ
  if (!month || !year) {
    console.error("Vui lòng cung cấp đầy đủ tháng và năm.");
    return;
  }

  try {
    const response = await axios.patch(
      GET_TOTAL_FEES_FOR_CURRENT_AND_PREVIOUS_MONTH,
      {
        month: month,
        year: year,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Trả về dữ liệu nếu yêu cầu thành công
    return response.data.data; 
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy tổng phí cho tháng hiện tại và tháng trước:",
      error.response?.data?.error || error.message
    );
  }
};