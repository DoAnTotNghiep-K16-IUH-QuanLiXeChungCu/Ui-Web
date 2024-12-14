import Cookies from "js-cookie";
import {
  ALL_USER,
  CHECK_PASSWORD,
  DELETE_USER,
  GET_USER_BY_UUID,
  SEND_OTP,
  UPDATE_USER,
} from "../config/API";
import { format } from "date-fns";
import axios from "axios"; // Import axios

export const getAllUser = async () => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.patch(
      ALL_USER,
      {
        pageNumber: 1,
        pageSize: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true, // Để gửi cookie cùng với yêu cầu
      }
    );

    return response.data.data.users; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy dữ liệu User:",
      error.response?.data?.error || error.message
    );
    return null; // Hoặc có thể trả về giá trị nào khác nếu cần
  }
};
export const GetUserByRFIDCard = async (uuid) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.patch(
      GET_USER_BY_UUID,
      {
        uuid: uuid,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true, // Để gửi cookie cùng với yêu cầu
      }
    );

    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    // console.error(
    //   "Có lỗi xảy ra khi lấy dữ liệu User:",
    //   error.response?.data?.error || error.message
    // );
    return null; // Hoặc có thể trả về giá trị nào khác nếu cần
  }
};

export const updateUser = async (user) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.put(
      UPDATE_USER,
      {
        id: user._id,
        username: user.username,
        fullname: user.fullname,
        birthDay: user.birthDay,
        address: user.address,
        phoneNumber: user.phoneNumber,
        role: user.role,
        email: user.email,
        isDelete: user.isDelete,
        password: user.password, // Thêm email
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true, // Để gửi cookie cùng với yêu cầu
      }
    );

    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy dữ liệu User:",
      error.response?.data?.error || error.message
    );
    return null; // Hoặc có thể trả về giá trị nào khác nếu cần
  }
};
export const checkPassWord = async (userName, password) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.post(
      CHECK_PASSWORD,
      {
        userName: userName,
        password: password,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true, // Để gửi cookie cùng với yêu cầu
      }
    );
    console.log("response.data.status", response.data.status);

    if (response.data.status === 200) return response.data.data;
    else if (response.data.status === 401) {
      return null;
    }
  } catch (error) {
    // console.error(
    //   "Có lỗi xảy ra khi lấy dữ liệu User:",
    //   error.response?.data?.error || error.message
    // );
    return null; // Hoặc có thể trả về giá trị nào khác nếu cần
  }
};

export const sendOTP = async (email) => {
  try {
    const response = await axios.post(SEND_OTP, {
      email: email,
    });
    console.log("response.data.otp", response.data.otp);

    if (response.data) return response.data.otp;
  } catch (error) {
    // console.error(
    //   "Có lỗi xảy ra khi lấy dữ liệu User:",
    //   error.response?.data?.error || error.message
    // );
    return null; // Hoặc có thể trả về giá trị nào khác nếu cần
  }
};
export const deleteUser = async (id) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  // console.log("id", id);

  try {
    const response = await axios.delete(DELETE_USER, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: {
        id: id,
      },
      withCredentials: true, // Để gửi cookie cùng với yêu cầu
    });

    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi xóa dữ liệu User:",
      error.response?.data?.error || error.message
    );
    return null; // Hoặc có thể trả về giá trị nào khác nếu cần
  }
};
