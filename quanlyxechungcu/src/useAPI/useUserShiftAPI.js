import Cookies from "js-cookie";
import {
  ADD_USER_SHIFT,
  FILTER_USER_SHIFT,
  UPDATE_USER_SHIFT,
} from "../config/API";
import { format } from "date-fns";
import { DELETE_USER_SHIFT } from "./../config/API";
export const filterUserShift = async (date, shiftId) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const bodyData = {};
    bodyData.date = format(date, "MM-dd-yyyy");
    if (shiftId && shiftId.trim() !== "") {
      bodyData.shiftId = shiftId;
    }
    bodyData.pageNumber = 1;
    bodyData.pageSize = 10;
    if (Object.keys(bodyData).length === 0) {
      console.error("Không có trường dữ liệu hợp lệ nào để gửi.");
      return;
    }
    const response = await fetch(FILTER_USER_SHIFT, {
      method: "PATCH",
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
      // console.log("DATA______", data.data);
      return data.data; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      // console.error("Có lỗi xảy ra khi tạo vé tháng: ", data.error);
      return {};
    }
  } catch (error) {
    console.log("ERROR________-", error);
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
    const response = await fetch(ADD_USER_SHIFT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userShift.userId,
        shiftId: userShift.shiftId,
        dateTime: userShift.dateTime,
      }),
      credentials: "include", // Chỉ định việc gửi cookie
    });

    const data = await response.json();
    // console.log("DATA______", data.data);
    if (response.ok) {
      // console.log("DATA______", data.data);
      return data.data; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      // console.error("Có lỗi xảy ra khi tạo vé tháng: ", data.error);
      return {};
    }
  } catch (error) {
    console.log("ERROR________-", error);
  }
};

export const updateUserShift = async (userShift) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const bodyData = {};
    bodyData.datetime = userShift.datetime;
    if (userShift.shiftId && userShift.shiftId.trim() !== "") {
      bodyData.shiftId = userShift.shiftId;
    }
    if (userShift.id && userShift.id.trim() !== "") {
      bodyData.id = userShift.id;
    }
    if (userShift.userId && userShift.userId.trim() !== "") {
      bodyData.userId = userShift.userId;
    }
    if (Object.keys(bodyData).length === 0) {
      console.error("Không có trường dữ liệu hợp lệ nào để gửi.");
      return;
    }
    const response = await fetch(UPDATE_USER_SHIFT, {
      method: "PUT",
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
      // console.log("DATA______", data.data);
      return data.data; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      // console.error("Có lỗi xảy ra khi tạo vé tháng: ", data.error);
      return {};
    }
  } catch (error) {
    console.log("ERROR________-", error);
  }
};

export const deleteUserShift = async (id) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const response = await fetch(DELETE_USER_SHIFT, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
      credentials: "include", // Chỉ định việc gửi cookie
    });

    const data = await response.json();
    // console.log("DATA______", data.data);
    if (response.ok) {
      // console.log("DATA______", data.data);
      return data.data; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      // console.error("Có lỗi xảy ra khi tạo vé tháng: ", data.error);
      return {};
    }
  } catch (error) {
    console.log("ERROR________-", error);
  }
};
