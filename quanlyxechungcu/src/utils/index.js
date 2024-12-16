import {
  faIdCard,
  faLocationDot,
  faClipboard,
  faGear,
  faChartColumn,
  faFileLines,
  faBarsProgress,
} from "@fortawesome/free-solid-svg-icons";
export const ChangeNavCase = (str) => {
  if (typeof str === "string") {
    if (str === "KẾT NỐI") return "connect";
    else if (str === "PHÍ XE") return "parking-fee";
    else if (str === "CÀI ĐẶT") return "setting";
    else if (str === "BÃI ĐỖ") return "parking-manage";
    else if (str === "LỊCH SỬ") return "history";
    else if (str === "THỐNG KÊ") return "report";
    else if (str === "THEO THÁNG") return "per-month";
    else if (str === "THEO NGÀY") return "per-day";
    else if (str === "DANH SÁCH BÃI ĐỖ") return "parking-slot";
    else if (str === "QUẢN LÝ") return "manage";
    else if (str === "KHÁCH HÀNG") return "customer";
    else if (str === "XE") return "vehicle";
    else if (str === "PHÒNG") return "apartment";
    else if (str === "THẺ QUẸT") return "RFIDCard";
    else if (str === "CA TRỰC") return "userShift";
    else if (str === "LỊCH LÀM VIỆC") return "schedular";
    else if (str === "CHẤM CÔNG") return "checking-job";
    else if (str === "TÀI KHOẢN") return "accounts";
    else if (str === "GIỜ LÀM VIỆC") return "shifts";
    else if (str === "LƯƠNG NHÂN VIÊN") return "payrolls";
    else if (str === "LỊCH SỬ QUÉT THẺ") return "logs";
    else if (str === "TÍNH LƯƠNG") return "fomula";
  }
  return "";
};
export const changeLabel = (str) => {
  if (typeof str === "string") {
    if (str === "entryLane") return "Cổng vào 1";
    else if (str === "exitLane") return "Cổng ra 1";
    else if (str === "secondaryEntryLane") return "Cổng vào 2";
    else if (str === "secondaryExitLane") return "Cổng ra 2";
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

  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}` || ""; // Định dạng "hh:mm:ss dd/mm/yyyy"
};
export const FindIconName = (label) => {
  switch (label) {
    case "BÃI ĐỖ":
      return faLocationDot; // Trả về biểu tượng cụ thể
    case "VÉ THÁNG":
      return faIdCard;
    case "CÀI ĐẶT":
      return faGear;
    case "THỐNG KÊ":
      return faChartColumn;
    case "BÁO CÁO":
      return faFileLines;
    case "QUẢN LÝ":
      return faBarsProgress;
    case "CA TRỰC":
      return faClipboard;
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

export const formatToVietnameseCurrency = (amount) => {
  if (typeof amount !== "number") {
    return 0;
  }
  return amount.toLocaleString("vi-VN");
};

export const calculateAge = (birthDay) => {
  const birthDate = new Date(birthDay); // Chuyển chuỗi ngày tháng thành đối tượng Date
  const today = new Date(); // Lấy ngày hiện tại

  let age = today.getFullYear() - birthDate.getFullYear(); // Tính năm chênh lệch

  // Kiểm tra xem sinh nhật năm nay đã qua chưa
  const isBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  // Nếu sinh nhật chưa qua thì giảm tuổi đi 1
  if (!isBirthdayPassed) {
    age--;
  }

  return age;
};
