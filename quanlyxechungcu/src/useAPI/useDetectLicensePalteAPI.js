import axios from "axios";
import { DETECT_LICENSEPLATE } from "../config/API";

export const detectLicensePlate = async (imageUrl) => {
  try {
    // Gửi yêu cầu POST đến backend để nhận diện biển số
    const response = await axios.post(
      DETECT_LICENSEPLATE,
      { image_url: imageUrl }, // Gửi dữ liệu dạng JSON
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Trả về kết quả nhận diện biển số nếu có
    return response.data.result || [];
  } catch (error) {
    // Trả về giá trị mặc định hoặc có thể xử lý thêm tùy nhu cầu
    return [];
  }
};
