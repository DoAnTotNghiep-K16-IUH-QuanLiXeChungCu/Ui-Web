import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import axios from "axios"; // Import axios
import {
  CREATE_TIMEKEEPING_LOG,
  DELETE_TIMEKEEPING_LOG,
  GET_ALL_TIMEKEEPING_LOG,
  GET_ALL_TIMEKEEPING_LOG_DELETE,
  GET_TIMEKEEPING_LOG_BY_ID,
  GET_TIMEKEEPING_LOG_FROM_DAY_TO_DAY,
  GET_TIMEKEEPING_LOG_PER_MONTH,
  GET_TIMEKEEPING_LOG_PER_YEAR,
  GET_TIMEKEEPING_LOG_TODAY,
  UPDATE_TIMEKEEPING_LOG,
} from "../config/API";

export const getAllTimeKeepingLog = async () => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const response = await axios.patch(
      GET_ALL_TIMEKEEPING_LOG,
      {
        pageNumber: 1,
        pageSize: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data.logs;
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy danh sách camera:",
      error.response?.data?.error || error.message
    );
  }
};

export const getAllTimeKeepingLogDelete = async () => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const response = await axios.patch(
      GET_ALL_TIMEKEEPING_LOG_DELETE,
      {
        pageNumber: 1,
        pageSize: 10000,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data.logs;
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy danh sách camera:",
      error.response?.data?.error || error.message
    );
  }
};
export const getTimeKeepingLogByID = async (id) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.patch(
      GET_TIMEKEEPING_LOG_BY_ID,

      {
        id: id,
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
      "Có lỗi xảy ra khi tìm camera:",
      error.response?.data?.error || error.message
    );
    return error.response?.data?.error;
  }
};
export const addTimeKeepingLog = async (log) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const response = await axios.put(
      CREATE_TIMEKEEPING_LOG,
      {
        rfidId: log.rfidId,
        userID: log.userID,
        scanTime: log.scanTime,
        status: log.status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi thêm 1 log:",
      error.response?.data?.error || error.message
    );
  }
};
export const updateTimeKeepingLog = async (log) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const response = await axios.post(
      UPDATE_TIMEKEEPING_LOG,
      {
        id: log.id,
        rfidId: log.rfidId,
        userID: log.userID,
        scanTime: log.scanTime,
        status: log.status,
        isDelete: log.isDelete,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      } // Truyền ID vào body dưới dạng JSON
    );

    return response.data.data;
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi cập nhật camera:",
      error.response?.data?.error || error.message
    );
  }
};

export const deleteTimeKeepingLog = async (id) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const response = await axios.delete(
      DELETE_TIMEKEEPING_LOG,
      {
        id: id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      } // Truyền ID vào body dưới dạng JSON
    );

    return response.data.data;
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi xóa lane:",
      error.response?.data?.error || error.message
    );
  }
};

export const getTimeKeepingLogFromDayToDay = async (startDate, endDate) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const response = await axios.patch(
      GET_TIMEKEEPING_LOG_FROM_DAY_TO_DAY,
      {
        startDate: startDate,
        endDate: endDate,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy danh sách camera:",
      error.response?.data?.error || error.message
    );
  }
};

export const getTimeKeepingLogToday = async () => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return null;
  }

  try {
    const response = await axios.get(GET_TIMEKEEPING_LOG_TODAY, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.data; // Trả về dữ liệu logs.
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy danh sách logs:",
      error.response?.data?.error || error.message
    );
    return null; // Trả về null nếu có lỗi.
  }
};

export const getTimeKeepingLogPerMonth = async (year, month) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const response = await axios.patch(
      GET_TIMEKEEPING_LOG_PER_MONTH,
      {
        year: year,
        month: month,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy danh sách camera:",
      error.response?.data?.error || error.message
    );
  }
};

export const getTimeKeepingLogPerYear = async (year) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const response = await axios.patch(
      GET_TIMEKEEPING_LOG_PER_YEAR,
      {
        year: year,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy danh sách camera:",
      error.response?.data?.error || error.message
    );
  }
};
