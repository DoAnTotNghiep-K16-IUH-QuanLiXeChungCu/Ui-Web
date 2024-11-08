import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import axios from "axios"; // Import axios
import {
  ALL_ENTRY_RECORD,
  ALL_EXIT_RECORD,
  COUNT_VEHICLE_ENTRY,
  COUNT_VEHICLE_EXIT,
  COUNT_VEHICLE_NON_EXIT,
  CREATE_ENTRY_RECORD,
  ENTRY_RECORD_TO_EXIT_RECORD,
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
    const response = await axios.patch(
      ALL_ENTRY_RECORD,
      {
        pageNumber: 1,
        pageSize: 20,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data.records; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy danh sách vé tháng:",
      error.response?.data?.error || error.message
    );
  }
};

export const getALLExitRecord = async () => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.patch(
      ALL_EXIT_RECORD,
      {
        pageNumber: 1,
        pageSize: 20,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data.records; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy danh sách vé tháng:",
      error.response?.data?.error || error.message
    );
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
    const response = await axios.patch(
      COUNT_VEHICLE_EXIT,
      {
        date: dateCount,
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

export const countVehicleEntry = async (date) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  const dateCount = date || new Date();

  try {
    const response = await axios.patch(
      COUNT_VEHICLE_ENTRY,
      {
        date: dateCount,
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

export const countVehicleNonExit = async (date) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  const dateCount = date || new Date().toISOString().split("T")[0];

  try {
    const response = await axios.get(
      `${COUNT_VEHICLE_NON_EXIT}?date=${dateCount}`,
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

export const getMoneyByDay = async (date) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  const dateCount = date || new Date();

  try {
    const response = await axios.patch(
      MONEY_BY_DAY,
      {
        day: dateCount,
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

  const bodyData = {};
  if (isOut !== undefined && isOut !== null && isOut.trim() !== "") {
    bodyData.isOut = isOut.trim() === "true";
  }
  if (
    isResident !== undefined &&
    isResident !== null &&
    isResident.trim() !== ""
  ) {
    bodyData.isResident = isResident.trim() === "true";
  }
  if (fromDay && fromDay.trim() !== "") {
    bodyData.fromDay = fromDay;
  }
  if (toDay && toDay.trim() !== "") {
    bodyData.toDay = toDay;
  }
  bodyData.pageNumber = pageNumber;
  bodyData.pageSize = pageSize;

  if (Object.keys(bodyData).length === 0) {
    console.error("Không có trường dữ liệu hợp lệ nào để gửi.");
    return;
  }

  try {
    const response = await axios.patch(FILTER_RECORD, bodyData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.data.records; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy dữ liệu:",
      error.response?.data?.error || error.message
    );
  }
};

export const createEntryRecord = async (entryRecord) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.post(
      CREATE_ENTRY_RECORD,
      {
        picture_front: entryRecord.picture_front,
        picture_back: entryRecord.picture_back,
        licensePlate: entryRecord.licensePlate,
        isResident: entryRecord.isResident,
        vehicleType: entryRecord.vehicleType,
        users_shiftId: entryRecord.users_shiftId,
        rfidId: entryRecord.rfidId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data; // Trả về dữ liệu phản hồi nếu cần sử dụng
  } catch (error) {
    console.error(
      "Lỗi khi thêm EntryRecord:",
      error.response?.data?.error || error.message
    );
  }
};

export const createExitRecord = async (exitRecord) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.post(
      CREATE_ENTRY_RECORD,
      {
        exitRecord, // Truyền ID vào body dưới dạng JSON
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data; // Trả về dữ liệu phản hồi nếu cần sử dụng
  } catch (error) {
    console.error(
      "Lỗi khi thêm ExitRecord:",
      error.response?.data?.error || error.message
    );
  }
};
export const getEntryRecordByisOutAndUuidAndLicensePlate = async (
  isOut,
  uuid,
  licensePlate
) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.patch(
      ENTRY_RECORD_TO_EXIT_RECORD,
      {
        isOut,
        uuid,
        licensePlate, // Truyền ID vào body dưới dạng JSON
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data; // Trả về dữ liệu phản hồi nếu cần sử dụng
  } catch (error) {
    console.error(
      "Lỗi khi tìm entryRecords:",
      error.response?.data?.error || error.message
    );
    return null;
  }
};
