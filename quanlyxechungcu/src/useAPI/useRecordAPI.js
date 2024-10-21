import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import {
  ALL_ENTRY_RECORD,
  ALL_EXIT_RECORD,
  COUNT_VEHICLE_ENTRY,
  COUNT_VEHICLE_EXIT,
  COUNT_VEHICLE_NON_EXIT,
  EXIT_RECORD_BY_ENTRY_RECORD_ID,
  FILTER_RECORD,
  MONEY_BY_DAY,
} from "../config/API";
export const getALLEntryRecord = async () => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await fetch(ALL_ENTRY_RECORD, {
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
      return data.data.records; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      console.error("Có lỗi xảy ra khi lấy danh sách vé tháng:", data.error);
    }
  } catch (error) {
    console.error("Error during fetching monthly tickets:", error);
  }
};
export const FindExitRecordByEntryRecordID = async (id) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await fetch(EXIT_RECORD_BY_ENTRY_RECORD_ID, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entry_recordId: id,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      return data.data; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      //   console.error("Có lỗi xảy ra khi lấy danh sách vé tháng:", data.error);
    }
  } catch (error) {
    // console.error("Error during fetching monthly tickets:", error);
    return null;
  }
};
export const getALLExitRecord = async () => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await fetch(ALL_EXIT_RECORD, {
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
      return data.data.records; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      console.error("Có lỗi xảy ra khi lấy danh sách vé tháng:", data.error);
    }
  } catch (error) {
    console.error("Error during fetching monthly tickets:", error);
  }
};

export const countVehicleExit = async (date) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  const dateCount = date || new Date();

  try {
    const response = await fetch(COUNT_VEHICLE_EXIT, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: dateCount,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      return data.data; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      console.error("Có lỗi xảy ra khi lấy danh sách vé tháng:", data.error);
    }
  } catch (error) {
    console.error("Error during fetching monthly tickets:", error);
  }
};

export const countVehicleEntry = async (date) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  const dateCount = date || new Date();

  try {
    const response = await fetch(COUNT_VEHICLE_ENTRY, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: dateCount,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      return data.data; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      console.error("Có lỗi xảy ra khi lấy danh sách vé tháng:", data.error);
    }
  } catch (error) {
    console.error("Error during fetching monthly tickets:", error);
  }
};

export const countVehicleNonExit = async (date) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  const dateCount = date || new Date().toISOString().split("T")[0]; // Định dạng ngày nếu cần thiết

  try {
    const response = await fetch(
      `${COUNT_VEHICLE_NON_EXIT}?date=${dateCount}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (response.status === 200) {
      return data.data; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      console.error("Có lỗi xảy ra khi lấy danh sách vé tháng:", data.error);
    }
  } catch (error) {
    console.error("Error during fetching vehicle data:", error);
  }
};

export const getMoneyByDay = async (date) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  const dateCount = date || new Date();
  console.log("DATE__-", date);

  try {
    const response = await fetch(MONEY_BY_DAY, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        day: dateCount,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return data.data; // Trả về dữ liệu nếu yêu cầu thành công
      console.log("DATA___", data.data);
    } else {
      console.error("Có lỗi xảy ra khi lấy danh sách vé tháng:", data.error);
    }
  } catch (error) {
    console.error("Error during fetching monthly tickets:", error);
  }
};

export const filterRecord = async (
  isOut,
  fromDay,
  toDay,
  isResident,
  pageNumber,
  pageSize
) => {
  const token = Cookies.get("accessToken");

  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const bodyData = {};
    if (isOut !== undefined && isOut !== null && isOut.trim() !== "") {
      bodyData.isOut = isOut.trim() === "true"; // Chuyển đổi chuỗi "true"/"false" thành boolean
    }
    if (
      isResident !== undefined &&
      isResident !== null &&
      isResident.trim() !== ""
    ) {
      bodyData.isResident = isResident.trim() === "true"; // Chuyển đổi chuỗi "true"/"false" thành boolean
    }
    if (fromDay && fromDay.trim() !== "") {
      bodyData.fromDay = fromDay;
    }
    if (toDay && toDay.trim() !== "") {
      bodyData.toDay = toDay;
    }
    bodyData.pageNumber = pageNumber;
    bodyData.pageSize = pageSize;
    console.log("BODYDATA______", bodyData);

    // Kiểm tra xem bodyData có trường nào để gửi hay không
    if (Object.keys(bodyData).length === 0) {
      console.error("Không có trường dữ liệu hợp lệ nào để gửi.");
      return;
    }

    const response = await fetch(FILTER_RECORD, {
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
    if (response.ok) {
      return data.data.records; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      console.error("Có lỗi xảy ra khi tạo vé tháng: ", data.error);
      return data.error;
    }
  } catch (error) {
    console.error("Error during creating monthly tickets:", error);
  }
};
