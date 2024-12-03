import React, { useState } from "react";

function LicensePlateDetection() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 404) {
          setResult("No license plate detected in the image.");
        } else {
          setError("Error detecting license plate.");
        }
        return;
      }

      const data = await response.json();
      setResult(data);
      setError(null); // Clear previous error if the request succeeds
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred while trying to detect the license plate.");
    }
  };

  const displayResults = () => {
    if (typeof result === "string") {
      return <p>{result}</p>; // For cases like "No license plate detected"
    }

    return result && result.length > 0 ? (
      <div>
        <h3>Detected License Plates:</h3>
        {result.map((pred, index) => (
          <div key={index}>
            <p>License Plate {index + 1}:</p>
            <ul>
              <li>
                Position: ({pred.xmin}, {pred.ymin}) to ({pred.xmax},{" "}
                {pred.ymax})
              </li>
              <li>Confidence: {(pred.confidence * 100).toFixed(2)}%</li>
            </ul>
          </div>
        ))}
      </div>
    ) : null;
  };

  return (
    <div>
      <h1>License Plate Detection</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit">Detect License Plate</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>{displayResults()}</div>
    </div>
  );
}

export default LicensePlateDetection;
