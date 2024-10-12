const ChangeNavCase = (str) => {
  if (typeof str === "string") {
    if (str === "Kết nối") return "connect";
    else if (str === "Phí xe") return "parking-fee";
    else if (str === "Cài đặt") return "setting";
    else if (str === "Bãi đỗ") return "parking-manage";
    else if (str === "Kiểm tra") return "check";
    else if (str === "Lịch sử") return "history";
    else if (str === "Thống kê") return "statistic";
    else if (str === "Theo tháng") return "permonth";
    // else if (str === "Danh sách bãi đỗ") return "parking-slot";
  }
  return "";
};

export default ChangeNavCase;
