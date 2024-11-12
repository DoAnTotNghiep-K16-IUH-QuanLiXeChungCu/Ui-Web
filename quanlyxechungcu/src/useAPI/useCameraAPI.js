import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import axios from "axios"; // Import axios
import {
  CREATE_CAMERA,
  DELETE_CAMERA,
  GET_ALL_CAMERA,
  UPDATE_CAMERA,
} from "../config/API";
import { GET_CAMERA_BY_ID } from "./../config/API";

export const getAllCamera = async () => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const response = await axios.patch(
      GET_ALL_CAMERA,
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

    return response.data.data.cameras;
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy danh sách camera:",
      error.response?.data?.error || error.message
    );
  }
};
export const getCameraByID = async (id) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.patch(
      GET_CAMERA_BY_ID,

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
export const addCamera = async (camera) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const response = await axios.put(
      CREATE_CAMERA,

      {
        name: camera.name,
        deviceID: camera.deviceID,
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
      "Có lỗi xảy ra khi thêm 1 camera:",
      error.response?.data?.error || error.message
    );
  }
};
export const updateCamera = async (camera) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const response = await axios.post(
      UPDATE_CAMERA,
      {
        id: camera._id,
        name: camera.name,
        deviceID: camera.deviceID,
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

export const deleteCamera = async (id) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const response = await axios.delete(
      DELETE_CAMERA,

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
