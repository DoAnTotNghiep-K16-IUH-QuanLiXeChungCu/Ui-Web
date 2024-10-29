import React, { useState, useRef, useEffect, useContext } from "react";
import Camera from "./Camera";
import { checkRFIDUUID, findUserShift } from "../utils";
import Notification from "./Notification";
import { UserContext } from "./../context/UserContext";
import { createEntryRecord, createExitRecord } from "../useAPI/useRecordAPI";
import axios from "axios";
import { getData, saveData } from "../context/indexedDB";
import { READ_RFID_CARD_ENTRY, UPLOAD_MEDIA } from "../config/API";
const CameraCapture = ({
  type,
  openSetting,
  entryLicensePlate,
  setEntryLicensePlate,
  exitLicensePlate,
  setExitLicensePlate,
  vehicleType,
  setVehicleType,
}) => {
  const {
    cards,
    shifts,
    userShifts,
    profile,
    entryRecords,
    setEntryRecords,
    exitRecords,
    setExitRecords,
  } = useContext(UserContext);
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
  const [rfidData, setRfidData] = useState("");
  const previousRfidDataRef = useRef("");
  const userShiftId = findUserShift(userShifts, profile._id, shifts);
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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
  const takePhotos = () => {
    const width = 640;
    const height = 480;

    Object.keys(videoRefs).forEach((cameraKey) => {
      let video = videoRefs[cameraKey].current;
      let canvas = canvasRefs[cameraKey].current;
      let context = canvas.getContext("2d");

      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      const imageData = canvas.toDataURL("image/png");
      setPhotos((prevPhotos) => ({ ...prevPhotos, [cameraKey]: imageData }));
    });
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Kiểm tra phím tắt, sử dụng 'P' hoặc 'p' cho entry và 'Q' hoặc 'q' cho exit
      if (
        (type === "entry" && (event.key === "p" || event.key === "P")) ||
        (type === "exit" && (event.key === "q" || event.key === "Q"))
      ) {
        event.preventDefault(); // Ngăn chặn hành động mặc định (nếu cần)
        takePhotos();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [type]);

  useEffect(() => {
    if (window.eventSource) return; // Kiểm tra xem EventSource đã tồn tại hay chưa
    const eventSource = new EventSource(READ_RFID_CARD_ENTRY);
    window.eventSource = eventSource; // Lưu eventSource vào đối tượng global để dùng cho lần sau

    eventSource.onmessage = (event) => {
      const newRfidData = event.data;
      if (newRfidData !== previousRfidDataRef.current) {
        setRfidData(newRfidData);
        previousRfidDataRef.current = newRfidData; // Cập nhật dữ liệu cũ
      }
      console.log("Mã số thẻ: ", newRfidData);
    };

    return () => {
      eventSource.close(); // Đóng kết nối khi component unmount
      window.eventSource = null; // Reset flag để có thể tái kết nối nếu cần thiết
    };
  }, []);

  // Kiểm tra thẻ RFID và hiển thị thông báo
  useEffect(() => {
    if (!rfidData || isInitialLoad) {
      setIsInitialLoad(false); // Sau lần đầu tiên, không xử lý nữa
      return;
    }
    const check = checkRFIDUUID(cards, rfidData);
    if (check === null) {
      setShowNotification({
        content: `Không có thẻ ${rfidData} nào trong danh sách.`,
        type: "Error",
        show: true,
      });
      console.log("không được:");
      return;
    } else {
      console.log("được:");
      uploadImages(check._id);
      setVehicleType("");
    }
    previousRfidDataRef.current = rfidData;
  }, [rfidData]);

  const uploadImages = async (rfidID) => {
    if (userShiftId === null) {
      setShowNotification({
        content: `Hôm nay không phải ca trực của bạn`,
        type: "Error",
        show: true,
      });
      return;
    }
    if (!photos.camera1 || !photos.camera2) {
      // Kiểm tra xem ảnh đã được chụp hay chưa
      setShowNotification({
        content: "Vui lòng chụp ảnh trước khi tiếp tục.",
        type: "Error",
        show: true,
      });
      return;
    }
    if (vehicleType === "") {
      // Kiểm tra xem ảnh đã được chụp hay chưa
      setShowNotification({
        content: "Vui lòng chọn loại phương tiện trước khi tiếp tục.",
        type: "Error",
        show: true,
      });
      return;
    }
    try {
      const formData = new FormData();
      const blobFront = await (await fetch(photos.camera1)).blob();
      const blobBack = await (await fetch(photos.camera2)).blob();

      const frontFileName =
        type === "entry" ? "Entry_camera1-photo.png" : "Exit_camera1-photo.png";
      const backFileName =
        type === "entry" ? "Entry_camera2-photo.png" : "Exit_camera2-photo.png";

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

      if (type === "entry") {
        const newEnTry = {
          picture_front: imageUrlFront,
          picture_back: imageUrlBack,
          licensePlate: entryLicensePlate,
          isResident: true,
          vehicleType: vehicleType,
          users_shiftId: userShiftId._id,
          rfidId: rfidID,
        };
        console.log("newEntryRecord", newEnTry);

        const addNewEntry = await createEntryRecord(newEnTry);
        setEntryRecords((prev) => [...prev, addNewEntry]);
        const data = await getData("userData");
        if (data) {
          await saveData({
            id: "userData",
            ...data,
            entryRecords: [...data.entryRecords, addNewEntry], // Cập nhật danh sách thẻ mới
          });
        }
        console.log("addNewEntry", addNewEntry);
        setPhotos({
          camera1: null,
          camera2: null,
        });
      } else {
        return;
      }
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
    }
  };

  return (
    <div>
      <div className="flex gap-2">
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
            <div className="w-[360px] h-72 border border-gray-300 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500">No photo captured</span>
            </div>
          )}
        </div>

        {/* Camera 2 Photo */}
        <div>
          {photos.camera2 ? (
            <img src={photos.camera2} alt="Captured from Camera 2" />
          ) : (
            <div className="w-[360px] h-72 border border-gray-300 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500">No photo captured</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        {/* Nút chụp có thể thêm vào đây nếu cần */}
      </div>
      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
    </div>
  );
};

export default CameraCapture;
