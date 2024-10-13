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
    const response = await fetch(VEHICLE_BY_ID, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: vehicleID,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Lỗi từ server:", errorData);
      return;
    }
    const data = await response.json();
    return data.data && data.data.customerId ? data.data.customerId : null;
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
    const response = await fetch(VEHICLE_BY_LICENSEPLATE, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        licensePlate: licensePlate,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Lỗi từ server:", errorData);
      return null;
    }
    const data = await response.json();
    return data.data && data.data.customerId ? data.data.customerId : null;
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
    const response = await fetch(ALL_VEHICLE, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageNumber: pageNumber,
        pageSize: pageSize,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return data.data; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      console.error("Có lỗi xảy ra khi lấy danh sách xe:", data.error);
    }
  } catch (error) {
    console.error("Error during fetching vehicle", error);
  }
};
export const getAllVehicleByType = async (type) => {
  const token = Cookies.get("accessToken");

  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await fetch(VEHICLE_BY_TYPE, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: type,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return data.data; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      console.error("Có lỗi xảy ra khi lấy xe:", data.error);
    }
  } catch (error) {
    console.error("Error during fetching monthly tickets:", error);
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
    const response = await fetch(CREATE_VEHICLE, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId: vehicle.customerId._id,
        licensePlate: vehicle.licensePlate,
        type: vehicle.type,
        color: vehicle.color,
        brand: vehicle.brand,
      }), // Truyền ID vào body dưới dạng JSON
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Lỗi API: ${errorData.message || response.status}`);
      return errorData.error;
    }

    console.log("Vehicle đã được thêm thành công.");
    const data = await response.json();
    // console.log("Data trả về: ", data.data);
    return data.data; // Trả về dữ liệu phản hồi nếu cần sử dụng
  } catch (error) {
    console.error("Lỗi khi thêm thẻ:", error);
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
    const response = await fetch(DELETE_VEHICLE, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }), // Truyền ID vào body dưới dạng JSON
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Lỗi API: ${errorData.message || response.status}`);
      return errorData.data;
    }

    console.log("Vehicle đã được xóa thành công.");
    const data = await response.json();
    return data.data; // Trả về dữ liệu phản hồi nếu cần sử dụng // Trả về dữ liệu phản hồi nếu cần sử dụng
  } catch (error) {
    console.error("Lỗi khi xóa:", error);
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
    const response = await fetch(UPDATE_VEHICLE, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: vehicle._id,
        customerId: vehicle.customerId,
        licensePlate: vehicle.licensePlate,
        type: vehicle.type,
        color: vehicle.color,
        brand: vehicle.brand,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Lỗi API: ", errorData);
      return errorData.error;
    }

    console.log("Vehicle đã được sửa thành công.");
    const data = await response.json();
    return data.data; // Trả về dữ liệu phản hồi nếu cần sử dụng // Trả về dữ liệu phản hồi nếu cần sử dụng
  } catch (error) {
    console.error("Lỗi khi thêm vehilce:", error);
  }
};
