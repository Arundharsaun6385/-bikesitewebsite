import React, { useEffect, useState } from "react";
import axios from "axios";
import "./webpage.scss";
import SideBar from "../../Components/SidebarFilter";
import logo from "../../assets/images/Screenshot (19).png";
const FlipCardGrid = () => {
  const [bikes, setBikes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch bikes from API
  useEffect(() => {
    const fetchBikes = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("http://bikesite.test/api/sellerinfo");
        setBikes(res.data);
      } catch (err) {
        console.error("Error fetching bikes:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBikes();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="loader-container">
          <div className="css-spinner"></div>
        </div>
      ) : bikes.length === 0 ? (
        <div className="loader-container">
          <p>No bikes or cars found.</p>
        </div>
      ) : (
        <div>
          <div className="class_head">
            <img src={logo}/>
            <h1 className="page-title">Secondhand Bikes & Cars</h1>
            <SideBar />
          </div>
          <div className="card-grid">
            {bikes.map((bike) => (
              <div className="card" key={bike.id || bike.model}>
                <div className="card-inner">
                  {/* Card Front */}
                  <div
                    className="card-front"
                    style={{
                      backgroundImage: `url(${
                        bike.profileImage || "/placeholder.jpg"
                      })`,
                    }}
                  >
                    <div className="card-content">
                      <p>{bike.brand}</p>
                      <span>{bike.model}</span>
                    </div>
                  </div>

                  {/* Card Back */}
                  <div className="card-back">
                    <p>
                      <strong>City:</strong> {bike.city}
                    </p>
                    <p>
                      <strong>Price:</strong> ₹{bike.price}
                    </p>
                    <p>
                      <strong>Year:</strong> {bike.year}
                    </p>
                    <button className="visit-button">Visit</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default FlipCardGrid;
