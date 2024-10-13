import {
  faIdCard,
  faMotorcycle,
  faLocationDot,
  faUser,
  faGear,
  faChartColumn,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";
export const FindIconName = (label) => {
  switch (label) {
    case "BÃI ĐỖ":
      return faLocationDot; // Trả về biểu tượng cụ thể
    case "KHÁCH HÀNG":
      return faUser;
    case "VÉ THÁNG":
      return faIdCard;
    case "DANH SÁCH XE":
      return faMotorcycle;
    case "CÀI ĐẶT":
      return faGear;
    case "THỐNG KÊ":
      return faChartColumn;
    case "BÁO CÁO":
      return faFileLines;
    default:
      return null; // Trả về null nếu không tìm thấy
  }
};
