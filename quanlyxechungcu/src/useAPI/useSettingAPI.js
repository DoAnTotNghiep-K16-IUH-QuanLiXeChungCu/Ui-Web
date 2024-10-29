import { GET_SETTING, UPDATE_SETTING } from "../config/API";

export const getAllSetting = async () => {
  try {
    const response = await fetch(GET_SETTING, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageNumber: 1,
        pageSize: 20,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      return data.data.settings;
    } else {
      console.error("Có lỗi xảy ra khi lấy danh sách setting:", data.error);
    }
  } catch (error) {
    console.error("Error during fetching setting:", error);
  }
};
export const updateSetting = async (setting) => {
  try {
    const response = await fetch(UPDATE_SETTING, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: setting.id,
        entryPort: setting.entryPort,
        entryBau: setting.entryBau,
        exitPort: setting.exitPort,
        exitBau: setting.exitBau,
        camera1: setting.camera1,
        camera2: setting.camera2,
        camera3: setting.camera3,
        camera4: setting.camera4,
      }), // Truyền ID vào body dưới dạng JSON
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Lỗi API: ${errorData.message || response.status}`);
    }
    const data = await response.json();
    console.log("Setting đã được update thành công", data);
    return data.data; // Trả về dữ liệu phản hồi nếu cần sử dụng
  } catch (error) {
    console.error("Lỗi khi thêm thẻ:", error);
  }
};
