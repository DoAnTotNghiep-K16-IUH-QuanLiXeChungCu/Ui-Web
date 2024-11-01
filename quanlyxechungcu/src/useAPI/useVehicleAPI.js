import axios from "axios"; // Import axios
import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import {
  ALL_VEHICLE,
  CREATE_VEHICLE,
  DELETE_VEHICLE,
  UPDATE_VEHICLE,
  VEHICLE_BY_ID,
  VEHICLE_BY_LICENSEPLATE,
  VEHICLE_BY_TYPE,
} from "../config/API";

export const FindCustomerByVehicleID = async (vehicleID) => {
  const token = Cookies.get("accessToken"); // Lấy token từ cookie
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  if (!vehicleID) {
    console.error("vehicleID không hợp lệ.");
    return;
  }

  try {
    const response = await axios.patch(
      VEHICLE_BY_ID,
      {
        id: vehicleID,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data && response.data.data.customerId
      ? response.data.data.customerId
      : null;
  } catch (error) {
    console.error("Có lỗi xảy ra:", error);
  }
};

export const FindCustomerByLicensePlate = async (licensePlate) => {
  const token = Cookies.get("accessToken"); // Lấy token từ cookie
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  if (!licensePlate) {
    console.error("licensePlate không hợp lệ.");
    return;
  }

  try {
    const response = await axios.patch(
      VEHICLE_BY_LICENSEPLATE,
      {
        licensePlate: licensePlate,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data && response.data.data.customerId
      ? response.data.data.customerId
      : null;
  } catch (error) {
    console.error("Có lỗi xảy ra:", error);
    return null;
  }
};

export const getAllVehicle = async (pageNumber, pageSize) => {
  const token = Cookies.get("accessToken");

  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.patch(
      ALL_VEHICLE,
      {
        pageNumber: pageNumber,
        pageSize: pageSize,
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
      "Có lỗi xảy ra khi lấy danh sách xe:",
      error.response?.data?.error || error
    );
  }
};

export const getAllVehicleByType = async (type) => {
  const token = Cookies.get("accessToken");

  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.patch(
      VEHICLE_BY_TYPE,
      {
        type: type,
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
      "Có lỗi xảy ra khi lấy xe:",
      error.response?.data?.error || error
    );
  }
};

export const addVehicle = async (vehicle) => {
  const token = Cookies.get("accessToken");
  // Kiểm tra nếu token không tồn tại
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.post(
      CREATE_VEHICLE,
      {
        customerId: vehicle.customerId._id,
        licensePlate: vehicle.licensePlate,
        type: vehicle.type,
        color: vehicle.color,
        brand: vehicle.brand,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Vehicle đã được thêm thành công.");
    return response.data.data; // Trả về dữ liệu phản hồi nếu cần sử dụng
  } catch (error) {
    console.error("Lỗi khi thêm thẻ:", error.response?.data || error);
  }
};

export const deleteVehicle = async (id) => {
  const token = Cookies.get("accessToken");
  // Kiểm tra nếu token không tồn tại
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.delete(DELETE_VEHICLE, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: {
        id: id,
      },
    });

    console.log("Vehicle đã được xóa thành công.");
    return response.data.data; // Trả về dữ liệu phản hồi nếu cần sử dụng
  } catch (error) {
    console.error("Lỗi khi xóa:", error.response?.data || error);
  }
};

export const updateVehicle = async (vehicle) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  console.log("Gửi dữ liệu ở phần UPDATE:", { vehicle });

  try {
    const response = await axios.put(
      UPDATE_VEHICLE,
      {
        id: vehicle._id,
        customerId: vehicle.customerId,
        licensePlate: vehicle.licensePlate,
        type: vehicle.type,
        color: vehicle.color,
        brand: vehicle.brand,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Vehicle đã được sửa thành công.");
    return response.data.data; // Trả về dữ liệu phản hồi nếu cần sử dụng
  } catch (error) {
    console.error("Lỗi khi cập nhật vehicle:", error.response?.data || error);
  }
};
