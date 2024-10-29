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
export const checkRFIDUUID = (listUUID, uuid) => {
  return (
    listUUID.find(
      (card) => card.uuid && card.uuid.toLowerCase() === uuid.toLowerCase()
    ) || null
  );
};

// Hàm tìm ca trực hiện tại
export const findCurrentShift = (shifts) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Hàm chuyển đổi thời gian từ chuỗi "HH:MM" thành giờ và phút hiện tại
  const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return { hours, minutes };
  };

  return (
    shifts.find((shift) => {
      const { hours: startHour, minutes: startMinute } = parseTime(
        shift.startTime
      );
      const { hours: endHour, minutes: endMinute } = parseTime(shift.endTime);

      // Xử lý trường hợp ca đêm kéo dài qua ngày hôm sau
      if (
        startHour > endHour ||
        (startHour === endHour && startMinute > endMinute)
      ) {
        return (
          currentHour > startHour ||
          (currentHour === startHour && currentMinute >= startMinute) ||
          currentHour < endHour ||
          (currentHour === endHour && currentMinute <= endMinute)
        );
      } else {
        return (
          (currentHour > startHour ||
            (currentHour === startHour && currentMinute >= startMinute)) &&
          (currentHour < endHour ||
            (currentHour === endHour && currentMinute <= endMinute))
        );
      }
    }) || null
  );
};

// Hàm tìm ca trực của user dựa trên userID và danh sách ca trực
export const findUserShift = (listUserShift, userID, shifts) => {
  // Tìm ca trực hiện tại
  const currentShift = findCurrentShift(shifts);

  if (!currentShift) {
    return null; // Không có ca trực hiện tại
  }

  // Tìm user shift phù hợp với userID và ca trực hiện tại
  return (
    listUserShift.find(
      (us) =>
        us.userId &&
        us.userId._id.toLowerCase() === userID.toLowerCase() &&
        us.shiftId &&
        us.shiftId._id === currentShift._id
    ) || null
  );
};

export const findEntryRecord = (
  listEntryRecord,
  listlicensePlate,
  rfidUUID
) => {
  // Tìm user shift phù hợp với userID và ca trực hiện tại
  return (
    listEntryRecord.find(
      (entry) =>
        entry.rfidId._id &&
        entry.rfidId._id.toLowerCase() === rfidUUID.toLowerCase() &&
        entry.licensePlate &&
        entry.licensePlate.toLowerCase() === listlicensePlate.toLowerCase() &&
        entry.isOut === false
    ) || null
  );
};
