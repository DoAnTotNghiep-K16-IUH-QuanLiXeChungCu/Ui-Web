import React, { useState, useRef } from "react";
import axios from "axios";
import { DETECT_LICENSEPLATE } from "../config/API";

const LicensePlateRecognition = () => {
  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState([]); // Dữ liệu dự đoán
  const [imageUrl, setImageUrl] = useState(null);

  const handleImageChange = (e) => {
    console.log(e.target.files[0]); // Kiểm tra xem file được chọn hay chưa
    setImage(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0])); // Tạo URL cho ảnh đã upload
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      console.error("No image selected!");
      return;
    }
    console.log("image______-", image);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post(DETECT_LICENSEPLATE, formData);
      console.log("Response data:", response.data); // Kiểm tra dữ liệu trả về
      const licensePlates = response.data.license_plates || [];
      console.log("licensePlates_____", licensePlates);

      setPredictions(licensePlates); // Lưu các biển số xe vào predictions
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Upload Image</button>
      </form>
      {imageUrl && (
        <div>
          <img
            src={imageUrl}
            alt="Selected preview"
            style={{ display: "block", width: "100%", maxWidth: "500px" }} // Đặt style để hiển thị hình ảnh
          />
        </div>
      )}

      <div>
        {Array.isArray(predictions) &&
          predictions.map((plate, index) => (
            <div key={index}>
              <p>{`License Plate: ${plate}`}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LicensePlateRecognition;
