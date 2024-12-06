import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { getAllSetting, updateSetting } from "../../useAPI/useSettingAPI";
import { getAllLane, updateLane } from "../../useAPI/useLaneAPI";
import CameraSelect from "../components/CameraSelect";
import { LIST_PORT } from "../../config/API";
import { getAllCamera } from "../../useAPI/useCameraAPI";
import PortSelect from "../components/PortSelect";
import { changeLabel } from "../../utils";
import Notification from "../components/Notification";
import NotificationNewCamera from "../components/NotificationNewCamera";

// Component chính
const ConnectConfiguration = () => {
  const [devices, setDevices] = useState([]);
  const [ports, setPorts] = useState([]);
  const [settings, setSettings] = useState([]);
  const [selectedSettings, setSelectedSettings] = useState("");
  const [lanes, setLanes] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCamera, setOpenCamera] = useState(false);
  const [lanesUpdate, setLanesUpdate] = useState([]);
  const [settingsUpdate, setSettingsUpdate] = useState([]);
  const [showCameraOption, setShowCameraOption] = useState(false);
  const [showNotification, setShowNotification] = useState({
    content: "",
    type: "",
    show: false,
  });
  let newDeviceID;
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const settings = await getAllSetting();
        setSettings(settings || []);
        setSelectedSettings(settings[0]);
        setSettingsUpdate(
          settings.map((setting) => ({
            id: setting._id,
            entryLane: setting.entryLane._id,
            exitLane: setting.exitLane._id,
            secondaryEntryLane: setting.secondaryEntryLane._id,
            secondaryExitLane: setting.secondaryExitLane._id,
          }))
        );
        // console.log("settingsUpdate", settingsUpdate);
        const lanes = await getAllLane();
        setLanes(lanes);
        setLanesUpdate(
          lanes.map((lane) => ({
            id: lane._id,
            name: lane.name,
            camera1: lane.camera1._id,
            camera2: lane.camera2._id,
            port: lane.port,
          }))
        );
        const cameras = await getAllCamera();
        setCameras(cameras);
        const response = await fetch(LIST_PORT);
        const portsData = await response.json();
        setPorts(portsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
      const videoDevices = deviceInfos.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices);
    });
  }, []);

  const handleChangeSetting = (e) => {
    const selectedSettingId = e.target.value;
    const selectedSetting = settings.find(
      (setting) => setting._id === selectedSettingId
    );
    setSelectedSettings(selectedSetting || null);
  };
  const handleSaveAllChangeSetting = async (e) => {
    // for (const camera of cameras) {
    //   try {
    //     const update = await updateCamera(camera);
    //     if (!update) {
    //       setShowNotification({
    //         content: `Đã có lỗi khi cập nhật Camera có tên ${camera.name} với deviceID ${camera.deviceID}.`,
    //         type: "Error",
    //         show: true,
    //       });
    //     }
    //   } catch (error) {
    //     console.error("Lỗi khi cập nhật camera:", error);
    //   }
    // }

    for (const lane of lanesUpdate) {
      try {
        console.log("lane", lane);

        const update = await updateLane(lane);
        if (!update) {
          setShowNotification({
            content: `Đã có lỗi khi cập nhật ${changeLabel(lane.name)}`,
            type: "Error",
            show: true,
          });
          return;
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật camera:", error);
      }
    }
    for (const setting of settingsUpdate) {
      try {
        const update = await updateSetting(setting);
        if (!update) {
          setShowNotification({
            content: `Đã có lỗi khi cập nhật Setting với version ${changeLabel(
              setting.version
            )}`,
            type: "Error",
            show: true,
          });
          return;
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật camera:", error);
      }
    }
    setShowNotification({
      content: "Các điều chỉnh đã được cập nhật",
      type: "Notification",
      show: true,
    });
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="container mx-auto p-4 bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">DANH SÁCH CÁC CÀI ĐẶT</h1>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="grid grid-cols-4 gap-4">
          <select
            value={selectedSettings?._id}
            onChange={handleChangeSetting}
            className="border p-2 rounded col-span-3"
          >
            {settings.map((setting) => (
              <option key={setting._id} value={setting._id}>
                {setting.version}
              </option>
            ))}
          </select>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => {
              setOpenCamera((prev) => !prev);
            }} // Dùng arrow function để truyền callback
          >
            {openCamera === false ? "Bật camera" : "Tắt camera"}
          </button>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded justify-end"
            onClick={handleSaveAllChangeSetting}
          >
            Lưu các thay đổi
          </button>
        </div>
      </div>

      {/* Render camera selections for lanes */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        {[
          "entryLane",
          "exitLane",
          "secondaryEntryLane",
          "secondaryExitLane",
        ].map((laneType, index) => (
          <div key={laneType + index}>
            {" "}
            {/* Add the index to make the key unique */}
            <div>
              <label className="text-xl font-semibold text-blue-500">
                {changeLabel(selectedSettings?.[laneType]?.name)}
              </label>
              <PortSelect
                ports={ports}
                selectedPort={selectedSettings?.[laneType]?.port}
                onChange={(newPort) => {
                  const duplicateLane = Object.keys(selectedSettings).find(
                    (key) =>
                      key !== laneType &&
                      selectedSettings[key]?.port === newPort
                  );

                  console.log("duplicateLane", duplicateLane);

                  if (duplicateLane) {
                    setShowNotification({
                      content: `Port ${newPort} đã được sử dụng ở lane: ${changeLabel(
                        duplicateLane
                      )}`,
                      type: "Error",
                      show: true,
                    });
                    return; // Stop the update
                  }

                  const updatedSettings = { ...selectedSettings };
                  updatedSettings[laneType].port = newPort;
                  setSelectedSettings(updatedSettings);
                  setLanesUpdate((prev) =>
                    prev.map((lane) =>
                      lane.id === selectedSettings?.[laneType]._id
                        ? { ...lane, port: newPort }
                        : lane
                    )
                  );
                }}
              />

              <CameraSelect
                selectedCamera={selectedSettings?.[laneType]?.camera1?.deviceID}
                devices={devices}
                openCamera={openCamera}
                onChange={(newCameraId) => {
                  const updatedSettings = { ...selectedSettings };
                  newDeviceID = newCameraId;
                  const data =
                    cameras.filter(
                      (camera) => camera.deviceID === newCameraId
                    ) || null;
                  // console.log("data1:", data);
                  if (data) {
                    const selectedCameraID =
                      selectedSettings?.[laneType]?.camera1?._id;
                    setLanesUpdate((prev) =>
                      prev.map((lane) =>
                        lane.camera1 === selectedCameraID
                          ? { ...lane, camera1: data[0]._id }
                          : lane
                      )
                    );
                    updatedSettings[laneType].camera1 = data[0];
                    setSelectedSettings(updatedSettings);
                  } else {
                    setShowCameraOption(true);
                  }
                }}
              />
            </div>
            <div>
              <CameraSelect
                selectedCamera={selectedSettings?.[laneType]?.camera2?.deviceID}
                devices={devices}
                openCamera={openCamera}
                onChange={(newCameraId) => {
                  const updatedSettings = { ...selectedSettings };
                  newDeviceID = newCameraId;
                  const data =
                    cameras.filter(
                      (camera) => camera.deviceID === newCameraId
                    ) || null;
                  // console.log("data2:", data);
                  if (data) {
                    const selectedCameraID =
                      selectedSettings?.[laneType]?.camera2?._id;
                    setLanesUpdate((prev) =>
                      prev.map((lane) => {
                        return lane.camera2 === selectedCameraID
                          ? { ...lane, camera2: data[0]._id }
                          : lane;
                      })
                    );
                    updatedSettings[laneType].camera2 = data[0];
                    setSelectedSettings(updatedSettings);
                  } else {
                    setShowCameraOption(true);
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <Notification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
      />
      <NotificationNewCamera
        showCameraOption={showCameraOption}
        setShowCameraOption={setShowCameraOption}
        newDeviceID={newDeviceID}
      />
    </div>
  );
};
export default ConnectConfiguration;
