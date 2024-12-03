import React, { useCallback, useEffect, useRef, useState } from "react";
import Notification from "./Notification";
import Camera from "./Camera";
import {
  DETECT_LICENSEPLATE,
  READ_ANOTHER_RFID_CARD_EXIT,
  READ_RFID_CARD_EXIT,
  UPLOAD_MEDIA,
} from "../config/API";
import { findCardByUUID } from "../useAPI/useCardAPI";
import axios from "axios";
import {
  createExitRecord,
  getEntryRecordByisOutAndUuidAndLicensePlate,
} from "../useAPI/useRecordAPI";
import { GetResidentHistoryMoneysLicensePlate } from "../useAPI/useMonthlyTicketAPI";
import { detectLicensePlate } from "../useAPI/useDetectLicensePalteAPI";
import { EstimateParkingTransaction } from "../useAPI/useParkingTransactionAPI";
const CheckCameraExit = ({
  isStart,
  type,
  setDataCheckCard,
  selectedSettings,
}) => {
  const [exitLicensePlate, setExitLicensePlate] = useState("");
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
  const [exitRfidData, setExitRfidData] = useState("");
  const [entryRecordData, setEntryRecordData] = useState({});
  const [estimateMoney, setEstimateMoney] = useState(0);

  const [prevRfidData, setPrevRfidData] = useState("");
  const previousRfidDataRef = useRef("");
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [vehicleType, setVehicleType] = useState("");
  const [current, setCurrent] = useState({
    date: "",
    time: "",
  });
  const handleLicensePlateChange = async (e) => {
    const data = e.target.value;
    setExitLicensePlate(e.target.value);
    const dataMontlyTicket = await GetResidentHistoryMoneysLicensePlate(
      e.target.value
    );
    const entryRecordData =
      (await getEntryRecordByisOutAndUuidAndLicensePlate(false, data)) || null;
    console.log("entryRecordData", entryRecordData);
    setEntryRecordData(entryRecordData);
    const estimateMoney = await EstimateParkingTransaction(
      data,
      entryRecordData?.vehicleType,
      new Date(entryRecordData?.entryTime).toLocaleString("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
      }),
      new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
    );
    console.log("estimateMoney", estimateMoney);

    if (estimateMoney) {
      setEstimateMoney(estimateMoney);
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
      setExitLicensePlate(data);
      setImageUrl({
        front: imageUrlFront,
        back: imageUrlBack,
      });
      const entryRecordData =
        (await getEntryRecordByisOutAndUuidAndLicensePlate(false, data)) ||
        null;
      console.log("entryRecordData", entryRecordData);

      if (entryRecordData === null) {
        setShowNotification({
          content: `Không tìm thấy phương tiện có biển số là ${exitLicensePlate} trong bãi`,
          type: "Error",
          show: true,
        });
        setExitLicensePlate("");
        setVehicleType("");
        return;
      }
      if (entryRecordData.licensePlate !== data) {
        setShowNotification({
          content: `Biển số xe ra và biển số xe vào không giống nhau. Biển số vào là ${entryRecordData.licensePlate} biển số ra là ${exitLicensePlate}`,
          type: "Error",
          show: true,
        });
        setExitLicensePlate("");
        setVehicleType("");
        return;
      }
      setEntryRecordData(entryRecordData);
      const estimateMoney = await EstimateParkingTransaction(
        data,
        entryRecordData?.vehicleType,
        new Date(entryRecordData?.entryTime).toLocaleString("en-US", {
          timeZone: "Asia/Ho_Chi_Minh",
        }),
        new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
      );
      console.log("estimateMoney", estimateMoney);

      if (estimateMoney) {
        setEstimateMoney(estimateMoney);
      }
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
          const formattedDate = date.split("/").reverse().join("-");

          const formattedTime = time.split(":").slice(0, 2).join(":");
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

  // Sử dụng `takePhotos` khi cần chụp ảnh
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        (type === "main" && event.key.toLowerCase() === "q") ||
        event.key === "Q" ||
        (type === "another" && event.key.toLowerCase() === "W") ||
        event.key === "w"
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
      type === "main" ? READ_RFID_CARD_EXIT : READ_ANOTHER_RFID_CARD_EXIT
    );
    eventSource.onmessage = (event) => {
      const newRfidData = event.data;
      // console.log("prevRfidData", prevRfidData);
      if (previousRfidDataRef.current === "") {
        previousRfidDataRef.current = newRfidData;
        setExitRfidData("");
        return;
      }
      if (newRfidData !== prevRfidData) {
        setExitRfidData(newRfidData);
        setPrevRfidData(newRfidData);
        previousRfidDataRef.current = newRfidData;
      }
      console.log("Mã số thẻ: ", newRfidData);
    };

    return () => {
      eventSource.close(); // Đóng kết nối khi component unmount
    };
  }, [isStart, type]);

  useEffect(() => {
    const handleRFIDCheck = async () => {
      if (isStart === false) {
        return;
      }
      if (exitRfidData === "" || isInitialLoad) {
        setIsInitialLoad(false); // Sau lần đầu tiên, không xử lý nữa
        return;
      }
      try {
        const check = await findCardByUUID(exitRfidData);
        if (check === null || check === undefined) {
          setShowNotification({
            content: `Không có thẻ ${exitRfidData} nào trong danh sách.`,
            type: "Error",
            show: true,
          });
          setPrevRfidData("");
          setExitRfidData("");
          return;
        } else {
          // console.log("được:");
          await uploadImages(check); // Gọi hàm uploadImages
        }
      } catch (error) {
        console.error("Lỗi khi xử lý RFID:", error);
      }
    };
    handleRFIDCheck(); // Gọi hàm xử lý RFID
  }, [exitRfidData, isStart, prevRfidData]);

  const uploadImages = async (rfidID) => {
    if (!photos.camera1 || !photos.camera2) {
      // Kiểm tra xem ảnh đã được chụp hay chưa
      setShowNotification({
        content: "Vui lòng chụp ảnh trước khi tiếp tục.",
        type: "Error",
        show: true,
      });
      setPrevRfidData("");
      setExitRfidData("");
      //   previousRfidDataRef.current = "";
      return;
    }

    try {
      const newExit = {
        entry_recordId: entryRecordData._id,
        picture_front: imageUrl.front,
        picture_back: imageUrl.back,
        licensePlate: exitLicensePlate,
        isResident: entryRecordData.isResident,
        vehicleType: vehicleType,
      };
      console.log("newExitRecord", newExit);

      const addNewExit = await createExitRecord(newExit);
      console.log("addNewExit", addNewExit);
      if (addNewExit) {
        setDataCheckCard((prev) => prev + 1);

        setShowNotification({
          content: `Tạo dữ liệu ra thành công.`,
          type: "Notification",
          show: true,
        });
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
        setExitLicensePlate("");
        setVehicleType("");
        setEntryRecordData();
      } else {
        setPrevRfidData("");
        setExitRfidData("");
      }
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
    }
  };
  return (
    <div className="bg-white shadow-lg px-4 rounded-lg">
      <p className="p-1 text-center font-bold text-orange-600">LÀN RA</p>
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
                className="object-contain w-auto h-auto"
              />
            ) : (
              <span className="text-gray-500">No photo captured</span>
            )}
          </div>
          <div className="flex items-center justify-center w-full h-72 border border-gray-300 bg-gray-100">
            {photos.camera2 ? (
              <img
                src={photos.camera2}
                alt="Captured from Camera 2"
                className="object-contain w-auto h-auto"
              />
            ) : (
              <span className="text-gray-500">No photo captured</span>
            )}
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
      </div>
      {/* Car Info */}
      <div className="p-4 bg-gray-50 rounded shadow-md max-w-full border">
        <div className="grid grid-cols-3 gap-4 text-sm p-4">
          {/* Thông tin ngày giờ và biển số */}
          <div className="col-span-2 grid grid-cols-2 gap-4">
            {/* Ngày vào & Giờ vào */}
            <div className="flex flex-col p-2 border rounded shadow-sm">
              <label className="font-semibold mb-1">Ngày vào:</label>
              <span>
                {entryRecordData?.entryTime
                  ? new Date(entryRecordData.entryTime)
                      .toLocaleDateString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                      })
                      .split("/")
                      .reverse()
                      .join("-")
                  : ""}
              </span>
            </div>
            <div className="flex flex-col p-2 border rounded shadow-sm">
              <label className="font-semibold mb-1">Giờ vào:</label>
              <span>
                {entryRecordData?.entryTime
                  ? new Date(entryRecordData.entryTime)
                      .toLocaleTimeString("vi-VN", {
                        hour12: false,
                        timeZone: "Asia/Ho_Chi_Minh",
                      })
                      .slice(0, 5) // Lấy giờ và phút
                  : ""}
              </span>
            </div>

            {/* Ngày ra & Giờ ra */}
            <div className="flex flex-col p-2 border rounded shadow-sm">
              <label className="font-semibold mb-1">Ngày ra:</label>
              <span>{current.date}</span>
            </div>
            <div className="flex flex-col p-2 border rounded shadow-sm">
              <label className="font-semibold mb-1">Giờ ra:</label>
              <span>{current.time}</span>
            </div>

            {/* Biển số xe */}
            <div className="flex flex-col p-2 border rounded shadow-sm">
              <label className="font-semibold mb-1">Biển số xe vào:</label>
              <span className="text-lg font-bold">
                {entryRecordData?.licensePlate}
              </span>
            </div>

            {/* Biển số xe ra */}
            <div className="flex flex-col p-2 border rounded shadow-sm">
              <label className="font-semibold mb-1">Biển số xe ra:</label>
              <input
                type="text"
                value={exitLicensePlate}
                className="border rounded p-2 text-center bg-white shadow-sm"
                onChange={handleLicensePlateChange}
                required
              />
            </div>
          </div>

          {/* Cột thông tin giá vé và loại vé */}
          <div className="flex flex-col justify-between">
            <div className="flex flex-col p-2 border rounded shadow-sm">
              <label className="font-semibold mb-1">Giá vé:</label>
              <span className="text-lg font-bold text-red-500">
                {estimateMoney}
              </span>
            </div>
            <div className="flex flex-col p-2 border rounded shadow-sm">
              <label className="font-semibold mb-1">Loại vé:</label>
              <span className="text-lg font-bold">
                {entryRecordData?.vehicleType === "motor"
                  ? "Xe máy"
                  : entryRecordData?.vehicleType === "car"
                  ? "Ô tô"
                  : entryRecordData?.vehicleType
                  ? entryRecordData.vehicleType
                  : ""}
              </span>
            </div>
          </div>

          {/* Hình ảnh
          <div className="flex justify-center items-center">
            {photos.camera1 ? (
              <img
                src={photos.camera1}
                alt="Captured from Camera 1"
                className="object-contain w-32 h-24 rounded shadow-lg"
              />
            ) : (
              <span className="text-gray-500">No image available</span>
            )}
          </div> */}
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

export default CheckCameraExit;
