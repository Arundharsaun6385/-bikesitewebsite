import React, { useState, useRef, useEffect, version, useContext } from "react";
import "./verifyotp.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mycontext } from "../../Context/Contextprovider";
import { Phone } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
const OTPVerify = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const userId = uuidv4();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleverifyOtp = (e, i) => {
    const { value } = e.target;
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[i] = value;
    setOtp(newOtp);

    if (value && i < inputRefs.current.length - 1) {
      inputRefs.current[i + 1].focus();
    }
  };

  const handleConformotp = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length === 4 && !otp.includes("")) {
      const storedOtp = localStorage.getItem("otp");
      const phone = localStorage.getItem("phone");
      if (enteredOtp === storedOtp) {
        alert("OTP Verified Successfully!");
        localStorage.setItem("isVerified", "true");
        navigate("/location");
        localStorage.removeItem("otp");
      } else {
        alert("Invalid OTP");
      }
    } else {
      alert("Please enter all 4 digits of the OTP.");
    }
  };

  const handleResendOtp = () => {
    setOtp(["", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputRefs.current[i - 1].focus();
    }
    if (e.key === "Enter") {
      handleConformotp();
    }
  };

  return (
    <div className="otp-verify">
      <h2>Verify OTP</h2>
      <p>Enter the 4-digit code</p>
      <div className="otp-inputs">
        {otp.map((digit, index) => (
          <input
            key={index}
            name="otp"
            type="text"
            value={digit}
            maxLength="1"
            ref={(el) => (inputRefs.current[index] = el)}
            onChange={(e) => handleverifyOtp(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </div>
      <button onClick={handleConformotp}>Conform Otp</button>
      <div className="class_p">
        <p onClick={handleResendOtp}>Resend Otp</p>
      </div>
    </div>
  );
};

export default OTPVerify;
