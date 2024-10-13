const ChangeNavCase = (str) => {
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

export default ChangeNavCase;
