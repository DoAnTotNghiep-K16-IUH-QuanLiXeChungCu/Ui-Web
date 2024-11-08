import Cookies from "js-cookie";
import {
  ADD_USER_SHIFT,
  ALL_USER_SHIFT,
  FILTER_USER_SHIFT,
  UPDATE_USER_SHIFT,
  DELETE_USER_SHIFT,
  USER_SHIFT_BY_USER_SHIFT_DATE,
} from "../config/API";
import { format } from "date-fns";
import axios from "axios"; // Import axios

export const filterUserShift = async (startDate, endDate) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const bodyData = {
      startDate: format(startDate, "MM-dd-yyyy"),
      endDate: format(endDate, "MM-dd-yyyy"),
      shiftId: "",
      pageNumber: 1,
      pageSize: 40,
    };

    // Xóa các trường undefined
    Object.keys(bodyData).forEach(
      (key) => bodyData[key] === undefined && delete bodyData[key]
    );

    if (Object.keys(bodyData).length === 0) {
      console.error("Không có trường dữ liệu hợp lệ nào để gửi.");
      return;
    }

    const response = await axios.patch(FILTER_USER_SHIFT, bodyData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true, // Gửi cookie cùng với yêu cầu
    });

    return response.data.data.userShifts; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    // Kiểm tra xem mã trạng thái có phải là 404 không
    if (error.response && error.response.status !== 404) {
      return [];
    }
    return []; // Hoặc bạn có thể trả về null hoặc giá trị khác tùy thuộc vào nhu cầu
  }
};

export const addUserShift = async (userShift) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  console.log("userShift____", userShift);

  try {
    const response = await axios.post(
      ADD_USER_SHIFT,
      {
        userId: userShift.userId,
        shiftId: userShift.shiftId,
        dateTime: userShift.dateTime,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true, // Gửi cookie cùng với yêu cầu
      }
    );

    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi tạo ca trực: ",
      error.response?.data?.error || error.message
    );
    return null;
  }
};

export const getAllUserShift = async () => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const response = await axios.patch(
      ALL_USER_SHIFT,
      {
        pageNumber: 1,
        pageSize: 10000,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true, // Gửi cookie cùng với yêu cầu
      }
    );

    return response.data.data.userShifts; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy dữ liệu ca trực: ",
      error.response?.data?.error || error.message
    );
    return null;
  }
};

export const updateUserShift = async (userShift) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  console.log("userShift", userShift);

  try {
    const bodyData = {
      dateTime: userShift.dateTime,
      shiftId:
        userShift.shiftId && userShift.shiftId.trim() !== ""
          ? userShift.shiftId
          : undefined,
      id: userShift.id && userShift.id.trim() !== "" ? userShift.id : undefined,
      userId:
        userShift.userId && userShift.userId.trim() !== ""
          ? userShift.userId
          : undefined,
    };

    // Xóa các trường undefined
    Object.keys(bodyData).forEach(
      (key) => bodyData[key] === undefined && delete bodyData[key]
    );

    if (Object.keys(bodyData).length === 0) {
      console.error("Không có trường dữ liệu hợp lệ nào để gửi.");
      return;
    }

    const response = await axios.put(UPDATE_USER_SHIFT, bodyData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true, // Gửi cookie cùng với yêu cầu
    });

    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi cập nhật ca trực: ",
      error.response?.data?.error || error.message
    );
    return null;
  }
};

export const deleteUserShift = async (id) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const response = await axios.delete(DELETE_USER_SHIFT, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true, // Gửi cookie cùng với yêu cầu
      data: { id: id }, // Dữ liệu cho phương thức DELETE
    });

    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi xóa ca trực: ",
      error.response?.data?.error || error.message
    );
    return null;
  }
};

export const getUserShiftsByUserIdAndShiftIdAndDateTime = async (
  userId,
  shiftId,
  dateTime
) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.patch(
      USER_SHIFT_BY_USER_SHIFT_DATE,
      {
        userId,
        shiftId,
        dateTime, // Truyền ID vào body dưới dạng JSON
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
      "Lỗi khi tìm userShift:",
      error.response?.data?.error || error.message
    );
    return null;
  }
};
