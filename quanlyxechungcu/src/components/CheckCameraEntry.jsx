import React, { useCallback, useEffect, useRef, useState } from "react";
import Notification from "./Notification";
import Camera from "./Camera";
import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import {
  DETECT_LICENSEPLATE,
  READ_ANOTHER_RFID_CARD_ENTRY,
  READ_RFID_CARD_ENTRY,
  UPLOAD_MEDIA,
} from "../config/API";
import { findCardByUUID } from "../useAPI/useCardAPI";
import axios from "axios";
import { createEntryRecord } from "../useAPI/useRecordAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrochip, faPen } from "@fortawesome/free-solid-svg-icons";
import { detectLicensePlate } from "../useAPI/useDetectLicensePalteAPI";
import { GetUserByRFIDCard } from "../useAPI/useUserAPI";

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
  const [edit, setEdit] = useState(false);
  const myUserID = Cookies.get("profileID");
  const handleLicensePlateChange = (e) => {
    setEntryLicensePlate(e.target.value);
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

      Object.keys(videoRefs).forEach((cameraKey) => {
        const video = videoRefs[cameraKey].current;
        const canvas = canvasRefs[cameraKey].current;
        if (canvas && video) {
          const context = canvas.getContext("2d");
          canvas.width = width;
          canvas.height = height;
          context.drawImage(video, 0, 0, width, height);
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
        setShowNotification({
          content: `Tạo dữ liệu vào thành công.`,
          type: "Notification",
          show: true,
        });
        setPhotos({
          camera1: null,
          camera2: null,
        });
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
        <div className="grid grid-cols-2 gap-2">
          {/* Camera 1 */}
          <Camera
            selectedDeviceId={selectedSettings?.camera1?.deviceID}
            isStart={isStart}
            videoRef={videoRefs.camera1}
          />

          {/* Camera 2 */}
          <Camera
            selectedDeviceId={selectedSettings?.camera2?.deviceID}
            isStart={isStart}
            videoRef={videoRefs.camera2}
          />
        </div>
        <canvas ref={canvasRefs.camera1} style={{ display: "none" }}></canvas>
        <canvas ref={canvasRefs.camera2} style={{ display: "none" }}></canvas>
        <div className="grid grid-cols-2 gap-2">
          {/* Camera 1 Photo */}
          <div>
            {photos.camera1 ? (
              <img src={photos.camera1} alt="Captured from Camera 1" />
            ) : (
              <div className="w-96 h-72 border border-gray-300 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-500">No photo captured</span>
              </div>
            )}
          </div>
          {/* Camera 2 Photo */}
          <div>
            {photos.camera2 ? (
              <img src={photos.camera2} alt="Captured from Camera 2" />
            ) : (
              <div className="w-96 h-72 border border-gray-300 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-500">No photo captured</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Car Info */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded shadow-md">
        {/* Biển số xe */}
        <div className="col-span-2 flex items-center">
          <label className="w-1/3 text-lg font-semibold">Biển số xe:</label>
          <div className="flex w-2/3 items-center">
            <input
              type="text"
              value={entryLicensePlate}
              className={`border rounded w-full p-2 text-center $bg-white`}
              onChange={handleLicensePlateChange}
              required
            />
          </div>
        </div>

        {/* Loại phương tiện */}
        <div className="col-span-2 flex items-center">
          <label className="w-1/3 text-lg font-semibold">Loại xe:</label>
          <select
            name="type"
            className="border rounded w-2/3 p-2 bg-white"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option value="">---------</option>
            <option value="car">Ô tô</option>
            <option value="motor">Xe máy</option>
          </select>
        </div>

        {/* Loại khách hàng */}
        <div className="col-span-2 flex items-center">
          <label className="w-1/3 text-lg font-semibold">Khách hàng:</label>
          <select
            name="customerType"
            className="border rounded w-2/3 p-2 bg-white"
            // value={customerType}
            // onChange={(e) => setCustomerType(e.target.value)}
          >
            <option value="">---------</option>
            <option value="visitor">Vãng lai</option>
            <option value="resident">Trong khu dân cư</option>
          </select>
        </div>
        {/* Ngày vào */}
        <div className="col-span-2 flex items-center">
          <label className="w-1/3 text-lg font-semibold">Ngày vào:</label>
          <input
            type="date"
            // value={entryDate}
            className="border rounded w-2/3 p-2 text-center bg-white"
            // onChange={(e) => setEntryDate(e.target.value)}
            required
          />
        </div>

        {/* Giờ vào */}
        <div className="col-span-2 flex items-center">
          <label className="w-1/3 text-lg font-semibold">Giờ vào:</label>
          <input
            type="time"
            // value={entryTime}
            className="border rounded w-2/3 p-2 text-center bg-white"
            // onChange={(e) => setEntryTime(e.target.value)}
            required
          />
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
