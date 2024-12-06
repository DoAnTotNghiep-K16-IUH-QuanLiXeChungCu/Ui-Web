import React, { useCallback, useEffect, useRef, useState } from "react";
import Notification from "./Notification";
import Camera from "./Camera";
import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import {
  READ_ANOTHER_RFID_CARD_ENTRY,
  READ_RFID_CARD_ENTRY,
  UPLOAD_MEDIA,
} from "../../config/API";
import { findCardByUUID } from "../../useAPI/useCardAPI";
import axios from "axios";
import { createEntryRecord } from "../../useAPI/useRecordAPI";
import { detectLicensePlate } from "../../useAPI/useDetectLicensePalteAPI";
import { GetUserByRFIDCard } from "../../useAPI/useUserAPI";
import { GetResidentHistoryMoneysLicensePlate } from "../../useAPI/useMonthlyTicketAPI";

const CheckCameraEntry = ({
  isStart,
  type,
  setDataCheckCard,
  selectedSettings,
}) => {
  const [entryLicensePlate, setEntryLicensePlate] = useState("");
  const videoRefs = {
    camera1: useRef(null),
    camera2: useRef(null),
  };
  const canvasRefs = {
    camera1: useRef(null),
    camera2: useRef(null),
  };
  const [photos, setPhotos] = useState({
    camera1: null,
    camera2: null,
  });
  const [imageUrl, setImageUrl] = useState({
    front: null,
    back: null,
  });
  const [entryRfidData, setEntryRfidData] = useState("");
  const [prevRfidData, setPrevRfidData] = useState("");
  const previousRfidDataRef = useRef("");
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [vehicleType, setVehicleType] = useState("");
  const myUserID = Cookies.get("profileID");
  const [customerMonthlyTicket, setCustomerMonthlyTicket] = useState();
  const [current, setCurrent] = useState({
    date: "",
    time: "",
  });

  const handleLicensePlateChange = async (e) => {
    setEntryLicensePlate(e.target.value);
    const dataMontlyTicket = await GetResidentHistoryMoneysLicensePlate(
      e.target.value
    );
    if (dataMontlyTicket) {
      setCustomerMonthlyTicket(dataMontlyTicket);
      setVehicleType(dataMontlyTicket.vehicleId.type);
    }
  };
  const handleDetectLicensePlate = async (photo1, photo2) => {
    if (!photo1 && !photo2) {
      console.error("No image selected!");
      return;
    }

    try {
      // Tải lên ảnh lên MinIO
      const formData = new FormData();
      const blobFront = await (await fetch(photo1)).blob();
      const blobBack = await (await fetch(photo2)).blob();
      const frontFileName = "Entry_camera1_photo.png";
      const backFileName = "Entry_camera2_photo.png";
      formData.append("files", blobFront, frontFileName);
      formData.append("files", blobBack, backFileName);

      const uploadResponse = await axios.post(UPLOAD_MEDIA, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const imageUrls = uploadResponse.data.data.urls;
      const imageUrlFront = imageUrls[0];
      const imageUrlBack = imageUrls[1];
      const licensePlates1 = await detectLicensePlate(imageUrlFront);
      console.log("licensePlates1", licensePlates1);

      let data = licensePlates1.join(",");
      if (licensePlates1.length === 0 && photo2) {
        const licensePlates2 = await detectLicensePlate(imageUrlBack);
        console.log("licensePlates2", licensePlates2);

        data = licensePlates2.join(",");
      }
      setEntryLicensePlate(data);
      const dataMontlyTicket = await GetResidentHistoryMoneysLicensePlate(data);
      if (dataMontlyTicket) {
        setCustomerMonthlyTicket(dataMontlyTicket);
        setVehicleType(dataMontlyTicket.vehicleId.type);
      }
      setImageUrl({
        front: imageUrlFront,
        back: imageUrlBack,
      });
    } catch (error) {
      console.error("Error handling license plate detection:", error);
    }
  };

  const useTakePhotos = (videoRefs, canvasRefs) => {
    const takePhotos = useCallback(() => {
      const width = 640;
      const height = 480;
      const updatedPhotos = {};
      // Lấy thời gian hiện tại theo múi giờ 'Asia/Ho_Chi_Minh'
      const currentDateTime = new Date().toLocaleString("vi-VN", {
        hour12: false,
        timeZone: "Asia/Ho_Chi_Minh",
      });

      // console.log("currentDateTime:", currentDateTime);

      if (currentDateTime) {
        const [time, date] = currentDateTime.split(" ");

        if (time && date) {
          const formattedDate = date
            .split("/")
            .reverse()
            .map((part) => part.padStart(2, "0")) // Đảm bảo mỗi phần có ít nhất 2 chữ số
            .join("-");

          const formattedTime = time.split(":").slice(0, 2).join(":");
          console.log("Formatted Date:", formattedDate);
          console.log("Formatted Time:", formattedTime);

          setCurrent({
            date: formattedDate,
            time: formattedTime,
          });
        } else {
          console.error("Không thể tách ngày và giờ từ chuỗi.");
        }
      } else {
        console.error(
          "Không thể lấy thời gian hiện tại hoặc định dạng không hợp lệ."
        );
      }

      Object.keys(videoRefs).forEach((cameraKey) => {
        const video = videoRefs[cameraKey].current;
        const canvas = canvasRefs[cameraKey].current;
        if (canvas && video) {
          const context = canvas.getContext("2d");
          canvas.width = width;
          canvas.height = height;

          // Vẽ video lên canvas
          context.drawImage(video, 0, 0, width, height);

          // Thêm ngày giờ lên ảnh
          context.font = "20px Arial";
          context.fillStyle = "red";
          context.fillText(currentDateTime, 10, 30); // Góc trên bên trái

          // Chuyển canvas thành dữ liệu ảnh
          updatedPhotos[cameraKey] = canvas.toDataURL("image/png");
        }
      });

      return updatedPhotos;
    }, [videoRefs, canvasRefs]);

    return { takePhotos };
  };

  // Trong component `CheckCameraEntry`
  const { takePhotos } = useTakePhotos(videoRefs, canvasRefs);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        (type === "main" && event.key.toLowerCase() === "p") ||
        event.key === "P" ||
        (type === "another" && event.key.toLowerCase() === "o") ||
        event.key === "O"
      ) {
        event.preventDefault();
        const photos = takePhotos();
        setPhotos((prevPhotos) => {
          const newPhotos = { ...prevPhotos, ...photos };
          return newPhotos;
        });
        handleDetectLicensePlate(photos.camera1, photos.camera2);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [type, takePhotos]);

  useEffect(() => {
    if (isStart === false) {
      previousRfidDataRef.current = "";
      return;
    }
    const eventSource = new EventSource(
      type === "main" ? READ_RFID_CARD_ENTRY : READ_ANOTHER_RFID_CARD_ENTRY
    );

    eventSource.onmessage = (event) => {
      const newRfidData = event.data;
      // console.log("prevRfidData", prevRfidData);
      if (previousRfidDataRef.current === "") {
        previousRfidDataRef.current = newRfidData;
        setEntryRfidData("");
        return;
      }
      if (newRfidData !== prevRfidData) {
        setEntryRfidData(newRfidData);
        setPrevRfidData(newRfidData);
        previousRfidDataRef.current = newRfidData;
      }
      console.log("Mã số thẻ: ", newRfidData);
    };
    return () => {
      eventSource.close();
    };
  }, [isStart, type]);

  useEffect(() => {
    const handleRFIDCheck = async () => {
      if (isStart === false) {
        return;
      }
      if (entryRfidData === "" || isInitialLoad) {
        setIsInitialLoad(false); // Sau lần đầu tiên, không xử lý nữa
        return;
      }
      try {
        console.log("entryRfidData", entryRfidData);
        const check = await findCardByUUID(entryRfidData);
        const userFinded = await GetUserByRFIDCard(entryRfidData);
        if (check === null || check === undefined) {
          setShowNotification({
            content: `Không có thẻ ${entryRfidData} nào trong danh sách.`,
            type: "Error",
            show: true,
          });
          setPrevRfidData("");
          setEntryRfidData("");
          return;
        } else if (userFinded) {
          setShowNotification({
            content: `Thẻ ${entryRfidData} dành cho nhân viên, không thẻ quẹt xe`,
            type: "Error",
            show: true,
          });
          setPrevRfidData("");
          setEntryRfidData("");
          return;
        } else {
          await uploadImages(check._id);
        }
      } catch (error) {
        console.error("Lỗi khi xử lý RFID:", error);
      }
    };
    handleRFIDCheck(); // Gọi hàm xử lý RFID
  }, [entryRfidData, isStart, prevRfidData]);

  const uploadImages = async (rfidID) => {
    if (!photos.camera1 || !photos.camera2) {
      setShowNotification({
        content: "Vui lòng chụp ảnh trước khi tiếp tục.",
        type: "Error",
        show: true,
      });
      setPrevRfidData("");
      setEntryRfidData("");
      return;
    }
    if (vehicleType === "") {
      setShowNotification({
        content: "Vui lòng chọn loại phương tiện trước khi tiếp tục.",
        type: "Error",
        show: true,
      });
      setPrevRfidData("");
      setEntryRfidData("");
      return;
    }
    try {
      const newEnTry = {
        picture_front: imageUrl.front,
        picture_back: imageUrl.back,
        licensePlate: entryLicensePlate,
        isResident: true,
        vehicleType: vehicleType,
        usersID: myUserID,
        rfidId: rfidID,
      };
      console.log("newEntryRecord", newEnTry);

      const addNewEntry = await createEntryRecord(newEnTry);
      console.log("addNewEntry", addNewEntry);
      if (addNewEntry) {
        setDataCheckCard((prev) => prev + 1);
        const audio = new Audio("/sounds/moi_ban_vao.mp3");
        audio.play();
        setPhotos({
          camera1: null,
          camera2: null,
        });
        setImageUrl({
          front: null,
          back: null,
        });
        setCurrent({
          date: null,
          time: null,
        });
        setCustomerMonthlyTicket(null);
        setEntryLicensePlate("");
        setVehicleType("");
      } else {
        setPrevRfidData("");
        setEntryRfidData("");
      }
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
    }
  };

  return (
    <div className="bg-white shadow-lg px-4 rounded-lg">
      <p className="p-1 text-center font-bold text-orange-600">LÀN VÀO</p>
      <div>
        <canvas ref={canvasRefs.camera1} style={{ display: "none" }}></canvas>
        <canvas ref={canvasRefs.camera2} style={{ display: "none" }}></canvas>

        <div className="grid grid-cols-2 gap-2 mt-4">
          {/* Camera 1 Photo */}
          <div className="flex items-center justify-center w-full h-72 border border-gray-300 bg-gray-100">
            {photos.camera1 ? (
              <img
                src={photos.camera1}
                alt="Captured from Camera 1"
                className="object-contain w-full h-full"
              />
            ) : (
              <span className="text-gray-500">No photo captured</span>
            )}
          </div>

          {/* Camera 2 Photo */}
          <div className="flex items-center justify-center w-full h-72 border border-gray-300 bg-gray-100">
            {photos.camera2 ? (
              <img
                src={photos.camera2}
                alt="Captured from Camera 2"
                className="object-contain w-full h-full"
              />
            ) : (
              <span className="text-gray-500">No photo captured</span>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {/* Camera 1 */}
        <div className="flex flex-col items-center">
          <Camera
            selectedDeviceId={selectedSettings?.camera1?.deviceID}
            isStart={isStart}
            videoRef={videoRefs.camera1}
            className="w-full h-72 border border-gray-300"
          />
        </div>

        {/* Camera 2 */}
        <div className="flex flex-col items-center">
          <Camera
            selectedDeviceId={selectedSettings?.camera2?.deviceID}
            isStart={isStart}
            videoRef={videoRefs.camera2}
            className="w-full h-72 border border-gray-300"
          />
        </div>
      </div>
      {/* Car Info */}
      <div className="p-4 bg-gray-50 rounded shadow-md max-w-full">
        <div className="grid grid-cols-4 gap-4 text-sm">
          {/* Biển số xe */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Biển số xe:</label>
            <input
              type="text"
              value={entryLicensePlate}
              className="border rounded p-2 text-center bg-white"
              onChange={handleLicensePlateChange}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1">Loại xe:</label>
            <select
              name="type"
              className="border rounded p-2 bg-white"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="">---------</option>
              <option value="car">Ô tô</option>
              <option value="motor">Xe máy</option>
            </select>
          </div>

          {/* Tên khách hàng */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Tên khách hàng:</label>
            <input
              type="text"
              className="border rounded p-2 text-center bg-white"
              value={customerMonthlyTicket?.vehicleId?.customerId?.fullName}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1">Khách:</label>
            <select
              name="customerType"
              className="border rounded p-2 bg-white"
              value={customerMonthlyTicket?.vehicleId?.customerId?.isResident}
            >
              <option value="">---------</option>
              <option value="false">Vãng lai</option>
              <option value="true">Trong khu dân cư</option>
            </select>
          </div>

          {/* Ngày vào */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Ngày vào:</label>
            <input
              type="date" // Sử dụng input type date
              className="border rounded p-2 text-center bg-white"
              value={current.date} // Hiển thị giá trị ngày đã được format
              onChange={(e) => setCurrent({ ...current, date: e.target.value })} // Cập nhật ngày khi thay đổi
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1">Giờ vào:</label>
            <input
              type="time" // Sử dụng input type time để chỉ cho phép giờ và phút
              className="border rounded p-2 text-center bg-white"
              value={current.time} // Hiển thị giá trị giờ đã được format
              onChange={(e) => setCurrent({ ...current, time: e.target.value })} // Cập nhật giờ khi thay đổi
              placeholder="HH:mm" // Hiển thị placeholder với định dạng HH:mm
            />
          </div>

          {/* Vé tháng còn */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Vé tháng:</label>
            {customerMonthlyTicket?.endDate ? (
              new Date(customerMonthlyTicket.endDate) < new Date() ? (
                "Hết hạn"
              ) : (
                <span>
                  Còn{" "}
                  {Math.ceil(
                    (new Date(customerMonthlyTicket.endDate) - new Date()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  ngày
                </span>
              )
            ) : (
              "---"
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-1">
        <span className="font-semibold text-red-700 text-center">
          {/* BIỂN SỐ KHÔNG GIỐNG NHAU */}
        </span>
      </div>
      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
    </div>
  );
};

export default CheckCameraEntry;
