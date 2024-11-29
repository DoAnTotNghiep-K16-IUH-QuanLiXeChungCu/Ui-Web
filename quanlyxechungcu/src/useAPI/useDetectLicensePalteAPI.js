import axios from "axios";
import { DETECT_LICENSEPLATE } from "../config/API";

export const detectLicensePlate = async (imageUrl) => {
  const response = await axios.post(
    DETECT_LICENSEPLATE,
    { imagePath: imageUrl }, // Gửi dữ liệu dạng JSON
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.plates || [];
};
