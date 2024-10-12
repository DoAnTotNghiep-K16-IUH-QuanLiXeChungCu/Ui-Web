import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import { ALL_MONTHLY_TICKET, CREATE_MONTHLY_TICKET } from "../config/API";

export const getAllMonthlyTicket = async (pageNumber) => {
  const token = Cookies.get("accessToken");

  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await fetch(ALL_MONTHLY_TICKET, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageNumber: pageNumber,
        pageSize: 10000,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      return data.data.residentHistoryMoneys; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      console.error("Có lỗi xảy ra khi lấy danh sách vé tháng:", data.error);
    }
  } catch (error) {
    console.error("Error during fetching monthly tickets:", error);
  }
};
export const addMonthlyTicket = async (ticket) => {
  const token = Cookies.get("accessToken");

  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    // Chuyển monthlyFee sang số
    const monthlyFee = parseFloat(ticket.monthlyFee);
    if (isNaN(monthlyFee) || monthlyFee <= 0) {
      console.error("monthlyFee phải là một số lớn hơn 0.___________");
      return; // Không tiếp tục nếu monthlyFee không hợp lệ
    }
    console.log("DATA in API: ", ticket);

    const response = await fetch(CREATE_MONTHLY_TICKET, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vehicleId: ticket.vehicleId,
        parking_slotId: ticket.parking_slotId,
        monthlyFee: monthlyFee, // Gửi monthlyFee đã chuyển đổi
        startDate: ticket.startDate,
        endDate: ticket.endDate,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return data.data; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      console.error("Có lỗi xảy ra khi tạo vé tháng: ", data.error);
      return data.error;
    }
  } catch (error) {
    console.error("Error during creating monthly tickets:", error);
  }
};
