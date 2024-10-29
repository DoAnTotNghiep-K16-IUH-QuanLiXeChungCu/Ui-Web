import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import {
  ALL_CUSTOMER,
  CREATE_CUSTOMER,
  CUSTOMER_BY_ID,
  DELETE_CUSTOMER,
  FILTER_CUSTOMER,
  UPDATE_CUSTOMER,
} from "../config/API";
export const getAllCustomer = async (pageNumber, pageSize) => {
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
        pageNumber: pageNumber,
        pageSize: pageSize,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      return data.data; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      console.error("Có lỗi xảy ra khi lấy danh sách khách hàng:", data.error);
      return data.error;
    }
  } catch (error) {
    console.error(error);
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
      return data.error;
    }
  } catch (error) {}
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
      method: "POST",
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
      console.error("Có lỗi xảy ra khi thêm khách hàng:", data.error);
      return data.error;
    }
  } catch (error) {
    console.error(error);
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
    const response = await fetch(DELETE_CUSTOMER, {
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
    console.log("data_____", data);

    if (response.ok) {
      return data.data; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      console.error("Có lỗi xảy ra khi xóa khách hàng:", data.error);
      return data.error;
    }
  } catch (error) {
    console.error(error);
  }
};

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
    // Khởi tạo đối tượng bodyData rỗng
    const bodyData = {};

    // Chỉ thêm isExpired nếu nó không phải là undefined, null, hoặc rỗng
    if (
      isResident !== undefined &&
      isResident !== null &&
      isResident.trim() !== ""
    ) {
      bodyData.isResident = isResident.trim() === "true"; // Chuyển đổi chuỗi "true"/"false" thành boolean
    }

    // Kiểm tra và chỉ thêm các trường khác nếu có giá trị hợp lệ (không rỗng, không null, không undefined)
    if (apartmentName && apartmentName.trim() !== "") {
      bodyData.apartmentName = apartmentName;
    }
    if (pageNumber !== undefined && pageNumber !== null) {
      bodyData.pageNumber = pageNumber;
    }

    bodyData.pageSize = pageSize;

    // Kiểm tra xem bodyData có trường nào để gửi hay không
    if (Object.keys(bodyData).length === 0) {
      console.error("Không có trường dữ liệu hợp lệ nào để gửi.");
      return;
    }

    const response = await fetch(FILTER_CUSTOMER, {
      method: "PATCH",
      credentials: "include",
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
      return data.data.customers; // Trả về dữ liệu nếu yêu cầu thành công
    } else {
      console.error("Có lỗi xảy ra khi tạo vé tháng: ", data.error);
      return data.error;
    }
  } catch (error) {
    console.error("Error during creating monthly tickets:", error);
  }
};
