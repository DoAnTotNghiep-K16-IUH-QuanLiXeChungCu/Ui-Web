import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import {
  ALL_MONTHLY_TICKET,
  CREATE_MONTHLY_TICKET,
  FILTER_MONTHLY_TICKET,
  MONTHLY_TICKET_BY_LICENSEPLATE,
  UPDATE_MONTHLY_TICKET,
} from "../config/API";

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
        rFIDCardID: ticket.rFIDCardID,
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
export const updateMonthlyTicket = async (ticket) => {
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

    const response = await fetch(UPDATE_MONTHLY_TICKET, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: ticket.id,
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

export const filterMonthlyTicket = async (
  isExpired,
  type,
  slotCode,
  month,
  year,
  pageNumber,
  pageSize
) => {
  const token = Cookies.get("accessToken");

  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    // Khởi tạo đối tượng bodyData rỗng
    const bodyData = {};

    // Chỉ thêm isExpired nếu nó không phải là undefined, null, hoặc rỗng
    if (
      isExpired !== undefined &&
      isExpired !== null &&
      isExpired.trim() !== ""
    ) {
      bodyData.isExpired = isExpired.trim() === "true"; // Chuyển đổi chuỗi "true"/"false" thành boolean
    }

    // Kiểm tra và chỉ thêm các trường khác nếu có giá trị hợp lệ (không rỗng, không null, không undefined)
    if (type && type.trim() !== "") {
      bodyData.type = type;
    }
    if (slotCode && slotCode.trim() !== "") {
      bodyData.slotCode = slotCode;
    }
    if (month && month.trim() !== "") {
      bodyData.month = parseInt(month);
    }
    if (year && year.trim() !== "") {
      bodyData.year = year;
    }
    if (pageNumber !== undefined && pageNumber !== null) {
      bodyData.pageNumber = pageNumber;
    }

    bodyData.pageSize = pageSize;

    // console.log("BODYDATA______", bodyData);

    // Kiểm tra xem bodyData có trường nào để gửi hay không
    if (Object.keys(bodyData).length === 0) {
      console.error("Không có trường dữ liệu hợp lệ nào để gửi.");
      return;
    }

    const response = await fetch(FILTER_MONTHLY_TICKET, {
      method: "PATCH",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
      credentials: "include", // Chỉ định việc gửi cookie
    });

    const data = await response.json();
    // console.log("DATA______", data.data);

    if (response.ok) {
      return data.data.residentHistoryMoneys; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      console.error("Có lỗi xảy ra khi tạo vé tháng: ", data.error);
      return data.error;
    }
  } catch (error) {
    console.error("Error during creating monthly tickets:", error);
  }
};

export const GetResidentHistoryMoneysLicensePlate = async (licensePlate) => {
  const token = Cookies.get("accessToken");

  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await fetch(MONTHLY_TICKET_BY_LICENSEPLATE, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        licensePlate: licensePlate,
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
