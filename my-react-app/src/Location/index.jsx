import React, { useState } from "react";
import "./location.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const LocationPicker = () => {
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState("");
  const navigate = useNavigate();

  const handleGetLocation = async (e) => {
    e.preventDefault();

    const location = await axios.get("https://ipapi.co/json");

    if (location != "") {
      setLocations(location);
      setLoading(true);
      setTimeout(() => {
        navigate("/Webpage");
      }, 2000);
    }
  };

  return (
    <div className="location-container">
      <h1>📍{locations == '' ? "Detect Your Location" : locations.data.city}</h1>
      <p className="subtitle">
        Click the button below to fetch your current coordinates.
      </p>

      <button
        className={`location-button ${loading ? "loading" : ""}`}
        onClick={handleGetLocation}
        disabled={loading}
      >
        {loading ? "Locating..." : "Get My Location"}
      </button>

      {/* {error && <div className="error">{error}</div>} */}
    </div>
  );
};

export default LocationPicker;
