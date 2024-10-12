import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import {
  ALL_ENTRY_RECORD,
  ALL_EXIT_RECORD,
  EXIT_RECORD_BY_ENTRY_RECORD_ID,
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
