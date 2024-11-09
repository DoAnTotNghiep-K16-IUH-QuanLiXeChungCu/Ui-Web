import { formatDateTime } from "../../utils/index";

const CheckEE = ({ type, time, front_pic, back_pic }) => {
  console.log("front_pic", front_pic);
  console.log("back_pic", back_pic);

  // Ảnh mặc định nếu không có ảnh
  const defaultImage =
    "https://sanketoan.vn/public/library_employer/thutran25122n3%40gmail.com-31694/images/%E1%BA%A3nh%20tr%E1%BA%AFng.jpg";
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 col-span-1 p-2">
        <div>
          <img
            src={front_pic || defaultImage} // Kiểm tra và sử dụng ảnh mặc định
            alt="Hình ảnh vào"
            className="w-full h-48 object-cover rounded"
          />
        </div>
        <div>
          <img
            src={back_pic || defaultImage} // Kiểm tra và sử dụng ảnh mặc định
            alt="Hình ảnh ra"
            className="w-full h-48 object-cover rounded"
          />
        </div>
      </div>
      <div
        className={`mt-2 w-full p-2 ${
          type === "entry"
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-red-500 hover:bg-red-600"
        } text-white rounded`}
      >
        {type === "entry" ? "HÌNH ẢNH VÀO" : "HÌNH ẢNH RA"}
        <br />
        Thời gian: {formatDateTime(time)}
      </div>
    </div>
  );
};

export default CheckEE;
