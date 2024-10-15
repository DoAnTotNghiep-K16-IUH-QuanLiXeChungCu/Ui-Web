import {
  faIdCard,
  faMotorcycle,
  faLocationDot,
  faUser,
  faGear,
  faChartColumn,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";
export const ChangeNavCase = (str) => {
  if (typeof str === "string") {
    if (str === "KẾT NỐI") return "connect";
    else if (str === "PHÍ XE") return "parking-fee";
    else if (str === "CÀI ĐẶT") return "setting";
    else if (str === "BÃI ĐỖ") return "parking-manage";
    else if (str === "KIỂM TRA") return "check";
    else if (str === "LỊCH SỬ") return "history";
    else if (str === "BÁO CÁO") return "report";
    else if (str === "THEO THÁNG") return "per-month";
    else if (str === "THEO NGÀY") return "per-day";
    else if (str === "DANH SÁCH BÃI ĐỖ") return "parking-slot";
  }
  return "";
};
export const formatCurrency = (amount) => {
  return amount.toLocaleString("vi-VN") + "đ";
};
export const formatDate = (isoDateString) => {
  const date = new Date(isoDateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`; // Định dạng "dd/mm/yyyy"
};
export const formatDateTime = (isoDateString) => {
  const date = new Date(isoDateString);

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`; // Định dạng "hh:mm:ss dd/mm/yyyy"
};
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
export const changeTypeVehicle = (type) => {
  if (typeof type === "string") {
    if (type === "car") return "Ô tô";
    else if (type === "motor") return "Xe máy";
  }
  return type;
};
