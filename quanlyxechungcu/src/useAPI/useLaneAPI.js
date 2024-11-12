import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import axios from "axios"; // Import axios
import {
  CREATE_LANE,
  DELETE_LANE,
  GET_ALL_LANE,
  GET_LANE_BY_ID,
  UPDATE_LANE,
} from "../config/API";

export const getAllLane = async () => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const response = await axios.patch(
      GET_ALL_LANE,
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

    return response.data.data.lanes;
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy danh sách cài đặt:",
      error.response?.data?.error || error.message
    );
  }
};

export const getLaneByID = async (id) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.patch(
      GET_LANE_BY_ID,

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
      "Có lỗi xảy ra khi tìm lane:",
      error.response?.data?.error || error.message
    );
    return error.response?.data?.error;
  }
};
export const addLane = async (lane) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const response = await axios.put(
      CREATE_LANE,

      {
        name: lane.name,
        camera1: lane.camera1,
        camera2: lane.camera2,
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
      "Có lỗi xảy ra khi thêm 1 lane:",
      error.response?.data?.error || error.message
    );
  }
};
export const updateLane = async (lane) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  console.log("lane in API", lane);

  try {
    const response = await axios.post(
      UPDATE_LANE,
      {
        id: lane.id,
        name: lane.name,
        camera1: lane.camera1,
        camera2: lane.camera2,
        port: lane.port,
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
      "Có lỗi xảy ra khi cập nhật lane:",
      error.response?.data?.error || error.message
    );
  }
};

export const deleteLane = async (id) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  try {
    const response = await axios.delete(
      DELETE_LANE,

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
