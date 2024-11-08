import React, { useEffect, useRef, useState } from "react";
import Notification from "./Notification";
import Camera from "./Camera";
import Cookies from "js-cookie"; // Import js-cookie nếu chưa có
import { getAllShift } from "../useAPI/useShiftAPI";
import { findCurrentShift } from "../utils";
import { format } from "date-fns";
import { getUserShiftsByUserIdAndShiftIdAndDateTime } from "../useAPI/useUserShiftAPI";
import {
  DETECT_LICENSEPLATE,
  READ_ANOTHER_RFID_CARD_ENTRY,
  READ_RFID_CARD_ENTRY,
  UPLOAD_MEDIA,
} from "../config/API";
import { findCardByUUID } from "../useAPI/useCardAPI";
import axios from "axios";
import { createEntryRecord } from "../useAPI/useRecordAPI";
import CameraConfiguration from "./CameraConfiguration";

const CheckCameraEntry = ({ isStart, openSetting, type }) => {
  const [entryLicensePlate, setEntryLicensePlate] = useState("");
  const [devices, setDevices] = useState([]);
  const [selectedDeviceIds, setSelectedDeviceIds] = useState({
    camera1: "",
    camera2: "",
  });
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
  const [entryRfidData, setEntryRfidData] = useState("");
  const [prevRfidData, setPrevRfidData] = useState("");
  const previousRfidDataRef = useRef("");
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [userShiftHere, setUserShiftHere] = useState("");
  const [shifts, setShifts] = useState([]);
  const [vehicleType, setVehicleType] = useState("");
  const handleLicensePlateChange = (e) => {
    setEntryLicensePlate(e.target.value);
  };
  useEffect(() => {
    const fetchShiftsAndUserShift = async () => {
      const myUserID = Cookies.get("profileID");
      const shifts = await getAllShift();
      setShifts(shifts);
      const myShift = findCurrentShift(shifts);
      const dayStr = format(new Date(), "yyyy-MM-dd");
      const UShiftHere = await getUserShiftsByUserIdAndShiftIdAndDateTime(
        myUserID,
        myShift._id,
        dayStr
      );
      if (UShiftHere) {
        setUserShiftHere(UShiftHere);
      }
    };
    fetchShiftsAndUserShift();
  }, []);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
      const videoDevices = deviceInfos.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDeviceIds({
          camera1: videoDevices[0]?.deviceId || "",
          camera2: videoDevices[1]?.deviceId || "",
        });
      }
    });
  }, []);
  const startCamera = (cameraKey) => {
    const selectedDeviceId = selectedDeviceIds[cameraKey];
    if (selectedDeviceId) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: selectedDeviceId
              ? { exact: selectedDeviceId }
              : undefined,
          },
        })
        .then((stream) => {
          let video = videoRefs[cameraKey].current;
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          console.error("Error accessing the camera: ", err);
        });
    }
  };
  const handleDetectLicensePlate = async (photo1, photo2) => {
    if (!photo1 && !photo2) {
      console.error("No image selected!");
      return;
    }

    const formData1 = new FormData();
    const blob1 = await fetch(photo1).then((res) => res.blob());
    formData1.append("file", blob1);

    try {
      const response1 = await axios.post(DETECT_LICENSEPLATE, formData1);
      const licensePlates1 = response1.data.license_plates || [];
      if (licensePlates1.length === 0 && photo2) {
        const formData2 = new FormData();
        const blob2 = await fetch(photo2).then((res) => res.blob());
        formData2.append("file", blob2);
        const response2 = await axios.post(DETECT_LICENSEPLATE, formData2);
        const licensePlates2 = response2.data.license_plates || [];

        const data = licensePlates2.join(",");
        // console.log("data_______", data);
        setEntryLicensePlate(data);
      } else {
        const data = licensePlates1.join(",");
        // console.log("data_______", data);
        setEntryLicensePlate(data); // Sử dụng biển số từ photo1 nếu có
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const takePhotos = () => {
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
        const imageData = canvas.toDataURL("image/png");
        updatedPhotos[cameraKey] = imageData;
      } else {
        console.warn(`Canvas not found for camera key: ${cameraKey}`);
      }
    });

    setPhotos((prevPhotos) => {
      const newPhotos = { ...prevPhotos, ...updatedPhotos };
      handleDetectLicensePlate(newPhotos.camera1, newPhotos.camera2); // Gọi hàm nhận diện biển số
      return newPhotos;
    });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "p" || event.key === "P") {
        event.preventDefault();
        takePhotos();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isStart === false) {
      previousRfidDataRef.current = "";
      return;
    }
    if (window.eventSource) return;
    let eventSource;
    switch (type) {
      case "main":
        eventSource = new EventSource(READ_RFID_CARD_ENTRY);
        break;
      case "another":
        eventSource = new EventSource(READ_ANOTHER_RFID_CARD_ENTRY);
        break;
      default:
        console.warn("Unknown RFID type:", type);
        return;
    }
    window.eventSource = eventSource; // Lưu eventSource vào đối tượng global để dùng cho lần sau

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
      window.eventSource = null;
    };
  }, [isStart]);

  useEffect(() => {
    const handleRFIDCheck = async () => {
      if (isStart === false) {
        return;
      }
      //   console.log("entryRfidData", entryRfidData);
      if (entryRfidData === "" || isInitialLoad) {
        setIsInitialLoad(false); // Sau lần đầu tiên, không xử lý nữa
        return;
      }
      try {
        console.log("entryRfidData", entryRfidData);

        const check = await findCardByUUID(entryRfidData);
        // console.log("check", check);

        if (check === null || check === undefined) {
          setShowNotification({
            content: `Không có thẻ ${entryRfidData} nào trong danh sách.`,
            type: "Error",
            show: true,
          });
          // previousRfidDataRef.current = "";
          setPrevRfidData("");
          setEntryRfidData("");
          return;
        } else {
          // console.log("được:");
          await uploadImages(check._id); // Gọi hàm uploadImages
        }
        // Cập nhật giá trị rfidData cuối cùng đã xử lý
        //   previousRfidDataRef.current = rfidData;
        // setPrevRfidData(rfidData);
      } catch (error) {
        console.error("Lỗi khi xử lý RFID:", error);
      }
    };
    handleRFIDCheck(); // Gọi hàm xử lý RFID
  }, [entryRfidData, isStart, prevRfidData]);

  // Kiểm tra thẻ RFID và hiển thị thông báo

  const uploadImages = async (rfidID) => {
    if (userShiftHere === null) {
      setShowNotification({
        content: `Hôm nay không phải ca trực của bạn`,
        type: "Error",
        show: true,
      });
      setPrevRfidData("");
      //   previousRfidDataRef.current = "";
      return;
    }
    if (!photos.camera1 || !photos.camera2) {
      // Kiểm tra xem ảnh đã được chụp hay chưa
      setShowNotification({
        content: "Vui lòng chụp ảnh trước khi tiếp tục.",
        type: "Error",
        show: true,
      });
      setPrevRfidData("");
      setEntryRfidData("");
      //   previousRfidDataRef.current = "";
      return;
    }
    if (vehicleType === "") {
      // Kiểm tra xem ảnh đã được chụp hay chưa
      setShowNotification({
        content: "Vui lòng chọn loại phương tiện trước khi tiếp tục.",
        type: "Error",
        show: true,
      });
      setPrevRfidData("");
      setEntryRfidData("");
      //   previousRfidDataRef.current = "";
      return;
    }
    try {
      const formData = new FormData();
      const blobFront = await (await fetch(photos.camera1)).blob();
      const blobBack = await (await fetch(photos.camera2)).blob();

      const frontFileName = "Entry_camera1-photo.png";
      const backFileName = "Entry_camera2-photo.png";

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

      console.log("Image uploaded successfully from camera1:", imageUrlFront);
      console.log("Image uploaded successfully from camera2:", imageUrlBack);

      const newEnTry = {
        picture_front: imageUrlFront,
        picture_back: imageUrlBack,
        licensePlate: entryLicensePlate,
        isResident: true,
        vehicleType: vehicleType,
        users_shiftId: userShiftHere._id,
        rfidId: rfidID,
      };
      console.log("newEntryRecord", newEnTry);

      const addNewEntry = await createEntryRecord(newEnTry);
      console.log("addNewEntry", addNewEntry);
      if (addNewEntry) {
        setPhotos({
          camera1: null,
          camera2: null,
        });
        setEntryLicensePlate("");
        setVehicleType("");
      }
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
    }
  };

  return (
    <div className="bg-white shadow-lg px-4 rounded-lg">
      <CameraConfiguration openSetting={openSetting} type={"entry"} />
      <div>
        <div className="grid grid-cols-2 gap-2">
          {/* Camera 1 */}
          <Camera
            openSetting={openSetting}
            cameraKey="camera1"
            selectedDeviceId={selectedDeviceIds.camera1}
            devices={devices}
            startCamera={startCamera}
            videoRef={videoRefs.camera1}
            setSelectedDeviceIds={setSelectedDeviceIds}
          />

          {/* Camera 2 */}
          <Camera
            openSetting={openSetting}
            cameraKey="camera2"
            selectedDeviceId={selectedDeviceIds.camera2}
            devices={devices}
            startCamera={startCamera}
            videoRef={videoRefs.camera2}
            setSelectedDeviceIds={setSelectedDeviceIds}
          />
        </div>
        <canvas ref={canvasRefs.camera1} style={{ display: "none" }}></canvas>
        <canvas ref={canvasRefs.camera2} style={{ display: "none" }}></canvas>
        <div className="flex gap-2">
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

        <div className="flex justify-center">
          {/* Nút chụp có thể thêm vào đây nếu cần */}
        </div>
      </div>
      {/* Car Info */}
      <div className="grid grid-cols-4 gap-1 mt-1">
        <div className="col-span-3">
          <div className="grid grid-cols-2">
            <h3 className="p-2 rounded w-full text-lg font-bold">
              {" "}
              Biển số xe
            </h3>
            <input
              type="text"
              value={entryLicensePlate}
              className="border rounded mb-1 border-gray-300 text-center"
              onChange={handleLicensePlateChange}
              required
            />
            <h3 className="p-2 rounded w-full font-semibold">Loại xe:</h3>
            <select
              name="type"
              className="border p-2 rounded w-full"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="">Chọn loại phương tiện</option>
              <option value="car">Ô tô</option>
              <option value="motor">Xe máy</option>
            </select>
          </div>
        </div>
        <div className="col-span-1 flex justify-center items-center"></div>
      </div>
      <div className="flex justify-between items-center mt-1">
        <div className="block bg-[#ec7a00] border border-gray-100 w-[100px] rounded-md mb-1">
          <p className="p-1 text-center">làn vào</p>
        </div>
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
