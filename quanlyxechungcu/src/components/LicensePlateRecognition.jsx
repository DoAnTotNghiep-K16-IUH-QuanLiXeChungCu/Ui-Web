import React, { useState, useRef } from "react";
import axios from "axios";

const LicensePlateRecognition = () => {
  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const canvasRef = useRef(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0])); // Tạo URL cho ảnh đã upload
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post(
        "http://localhost:5000/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPredictions(response.data);
      drawBoundingBoxes(response.data); // Vẽ bounding box khi nhận được dự đoán
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const drawBoundingBoxes = (predictions) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.src = imageUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      predictions.forEach((pred) => {
        ctx.beginPath();
        ctx.rect(
          pred.xmin,
          pred.ymin,
          pred.xmax - pred.xmin,
          pred.ymax - pred.ymin
        );
        ctx.lineWidth = 2;
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.fillStyle = "red";
        ctx.fillText(
          `${pred.name} (${(pred.confidence * 100).toFixed(2)}%)`,
          pred.xmin,
          pred.ymin > 10 ? pred.ymin - 5 : 10
        );
      });
    };
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Upload Image</button>
      </form>
      {imageUrl && (
        <div>
          <canvas ref={canvasRef} style={{ border: "1px solid black" }} />
        </div>
      )}
      <div>
        {predictions.map((pred, index) => (
          <div key={index}>
            <p>{`Label: ${pred.name}, Confidence: ${(
              pred.confidence * 100
            ).toFixed(2)}%, Coordinates: [${pred.xmin}, ${pred.ymin}, ${
              pred.xmax
            }, ${pred.ymax}]`}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LicensePlateRecognition;
