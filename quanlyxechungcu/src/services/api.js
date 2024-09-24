import axios from "axios";

// URL cơ bản của API (được gọi là Base URL)
const API_BASE_URL = process.env.REACT_APP_API_URL || "https://api.example.com";

// Tạo một instance của Axios với base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Thời gian chờ request là 10 giây
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm Interceptor để xử lý lỗi và token (nếu có authentication)
api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage và thêm vào header nếu cần
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xử lý lỗi trả về từ API
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Trả về thông báo lỗi từ server
      console.error("API Error:", error.response.data.message);
    } else if (error.request) {
      // Không nhận được phản hồi từ server
      console.error("No response from API");
    } else {
      // Lỗi khác trong quá trình setup request
      console.error("API Setup Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Các hàm API cụ thể (ví dụ CRUD cho người dùng)

// 1. Lấy danh sách người dùng
export const getUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// 2. Lấy thông tin chi tiết của một người dùng
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with id ${userId}:`, error);
    throw error;
  }
};

// 3. Thêm một người dùng mới
export const createUser = async (userData) => {
  try {
    const response = await api.post("/users", userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// 4. Cập nhật thông tin người dùng
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with id ${userId}:`, error);
    throw error;
  }
};

// 5. Xóa một người dùng
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user with id ${userId}:`, error);
    throw error;
  }
};
