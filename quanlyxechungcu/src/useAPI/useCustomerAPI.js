import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import {
  ALL_CUSTOMER,
  CREATE_CUSTOMER,
  CUSTOMER_BY_ID,
  UPDATE_CUSTOMER,
} from "../config/API";
export const getAllCustomer = async () => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await fetch(ALL_CUSTOMER, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageNumber: 1,
        pageSize: 20,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      return data.data.customers; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      console.error("Có lỗi xảy ra khi lấy danh sách khách hàng:", data.error);
    }
  } catch (error) {
    console.error("Error during fetching monthly tickets:", error);
  }
};

export const findCustomerByID = async (id) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await fetch(CUSTOMER_BY_ID, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      return data.data; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      console.error("Có lỗi xảy ra khi tìm khách hàng:", data.error);
    }
  } catch (error) {
    console.error("Error during fetching monthly tickets:", error);
  }
};
export const addCustomer = async (customer) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  console.log("customer ", customer);
  console.log("Type IsResident ", typeof customer.isResident);
  console.log("IsResident ", customer.isResident);

  try {
    const response = await fetch(CREATE_CUSTOMER, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apartmentsId: customer.apartmentsId,
        fullName: customer.fullName,
        phoneNumber: customer.phoneNumber,
        address: customer.address,
        isResident: customer.isResident,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("dữ liệu trả vê: ", data.data);
      return data.data;
      // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      console.error("Có lỗi xảy ra khi tìm khách hàng:", data.error);
    }
  } catch (error) {
    console.error("Error during fetching monthly tickets:", error);
  }
};

export const updateCustomer = async (customer) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }
  console.log("dữ liệu trong update Customer API: ", customer);

  try {
    const response = await fetch(UPDATE_CUSTOMER, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: customer._id,
        apartmentsId: customer.apartmentsId,
        fullName: customer.fullName,
        phoneNumber: customer.phoneNumber,
        address: customer.address,
        isResident: customer.isResident,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      return data.data; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      console.error("Có lỗi xảy ra khi tìm khách hàng:", data.error);
    }
  } catch (error) {
    console.error("Error during fetching monthly tickets:", error);
  }
};
export const deleteCustomer = async (id) => {
  const token = Cookies.get("accessToken");
  if (!token) {
    console.error("Token không tồn tại. Vui lòng đăng nhập.");
    return;
  }

  try {
    const response = await fetch(CUSTOMER_BY_ID, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    });
    const data = await response.json();
    if (response.status === 200) {
      return data.data; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      console.error("Có lỗi xảy ra khi tìm khách hàng:", data.error);
    }
  } catch (error) {
    console.error("Error during fetching monthly tickets:", error);
  }
};
