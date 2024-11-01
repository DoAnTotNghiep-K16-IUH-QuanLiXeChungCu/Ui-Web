import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import axios from "axios"; // Import Axios
import {
  ALL_CUSTOMER,
  CREATE_CUSTOMER,
  CUSTOMER_BY_ID,
  DELETE_CUSTOMER,
  FILTER_CUSTOMER,
  UPDATE_CUSTOMER,
} from "../config/API";

const axiosConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

// Lấy tất cả khách hàng
export const getAllCustomer = async (pageNumber, pageSize) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.patch(
      ALL_CUSTOMER,
      {
        pageNumber: pageNumber,
        pageSize: pageSize,
      },
      axiosConfig(token)
    );

    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy danh sách khách hàng:",
      error.response?.data?.error || error.message
    );
    return error.response?.data?.error;
  }
};

// Tìm khách hàng theo ID
export const findCustomerByID = async (id) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.patch(
      CUSTOMER_BY_ID,
      {
        id: id,
      },
      axiosConfig(token)
    );

    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi tìm khách hàng:",
      error.response?.data?.error || error.message
    );
    return error.response?.data?.error;
  }
};

// Thêm khách hàng
export const addCustomer = async (customer) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  console.log("customer ", customer);

  try {
    const response = await axios.post(
      CREATE_CUSTOMER,
      {
        apartmentsId: customer.apartmentsId,
        fullName: customer.fullName,
        phoneNumber: customer.phoneNumber,
        address: customer.address,
        isResident: customer.isResident,
      },
      axiosConfig(token)
    );

    console.log("dữ liệu trả về: ", response.data.data);
    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi thêm khách hàng:",
      error.response?.data?.error || error.message
    );
    return error.response?.data?.error;
  }
};

// Cập nhật khách hàng
export const updateCustomer = async (customer) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  console.log("dữ liệu trong update Customer API: ", customer);

  try {
    const response = await axios.put(
      UPDATE_CUSTOMER,
      {
        id: customer._id,
        apartmentsId: customer.apartmentsId,
        fullName: customer.fullName,
        phoneNumber: customer.phoneNumber,
        address: customer.address,
        isResident: customer.isResident,
      },
      axiosConfig(token)
    );

    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi cập nhật khách hàng:",
      error.response?.data?.error || error.message
    );
  }
};

// Xóa khách hàng
export const deleteCustomer = async (id) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await axios.delete(DELETE_CUSTOMER, {
      data: { id: id }, // Dữ liệu gửi đi
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.data; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi xóa khách hàng:",
      error.response?.data?.error || error.message
    );
    return error.response?.data?.error;
  }
};

// Lọc khách hàng
export const filterCustomer = async (
  isResident,
  apartmentName,
  pageNumber,
  pageSize
) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const bodyData = {
      isResident:
        isResident !== undefined && isResident.trim() !== ""
          ? isResident.trim() === "true"
          : undefined,
      apartmentName:
        apartmentName && apartmentName.trim() !== ""
          ? apartmentName
          : undefined,
      pageNumber: pageNumber !== undefined ? pageNumber : undefined,
      pageSize: pageSize,
    };

    // Lọc bỏ các thuộc tính undefined
    const filteredBodyData = Object.fromEntries(
      Object.entries(bodyData).filter(([_, v]) => v !== undefined)
    );

    if (Object.keys(filteredBodyData).length === 0) {
      console.error("Không có trường dữ liệu hợp lệ nào để gửi.");
      return;
    }

    const response = await axios.patch(
      FILTER_CUSTOMER,
      filteredBodyData,
      axiosConfig(token)
    );

    return response.data.data.customers; // Trả về dữ liệu nếu yêu cầu thành công
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lọc khách hàng:",
      error.response?.data?.error || error.message
    );
    return error.response?.data?.error;
  }
};
