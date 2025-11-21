import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Index = () => {
  const [phone, setPhone] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [userLogins, setUserLogins] = useState([]);

  const navigate = useNavigate();
  const userId = uuidv4();

  // Fetch all user logins when component mounts
  useEffect(() => {
    const fetchUserLogins = async () => {
      try {
        const response = await axios.get("http://bikesite.test/api/userlogin");
        setUserLogins(response.data);
      } catch (error) {
        console.error("Error fetching user logins:", error);
      }
    };

    fetchUserLogins();
  }, []);

  // Handle OTP send
const handleSendOTP = async (e) => {
  e.preventDefault();
  setIsSending(true);
  setResponseMessage(null);

  try {
    // Check if the phone number already exists in the database
    const existingUser = userLogins.find((v) => v.phone === phone);

    // If it exists, use the existing id; otherwise, generate a new one
    const userIdToUse = existingUser ? existingUser.id : uuidv4();

    const res = await axios.post("http://bikesite.test/api/send-sms", {
      id: userIdToUse,
      phone,
    });

    if (res.data.success) {
      setResponseMessage("OTP sent successfully");
      localStorage.setItem("phone", phone);
      localStorage.setItem("otp", res.data.otp);

      setTimeout(() => navigate("/verifyOtp"), 1000);
    } else {
      setResponseMessage(`Failed: ${res.data.message}`);
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    setResponseMessage("Something went wrong while sending OTP.");
  }

  setIsSending(false);
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4a90e2] to-[#6a82fb] flex flex-col items-center justify-start pt-16 pb-8 relative overflow-hidden">
      {/* Top Illustration */}
      <div className="absolute top-0 left-0 w-full h-48 bg-[#4a90e2] rounded-br-full rounded-bl-full md:h-64"></div>
      <div className="absolute top-0 left-0 z-10 flex items-center justify-center w-full h-48">
        <div
          className="w-48 h-32 bg-center bg-no-repeat bg-contain md:w-64 md:h-40"
          style={{
            backgroundImage:
              'url("https://res.cloudinary.com/dtg0s0j1j/image/upload/v1717392686/login_illustration_wop1g5.png")',
          }}
        ></div>
      </div>

      {/* Wave at bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-[150px]"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-white"
          ></path>
        </svg>
      </div>

      {/* Login Card */}
      <div className="relative z-20 w-11/12 max-w-sm p-6 mx-auto mt-32 bg-white shadow-xl rounded-2xl md:p-8 md:mt-40">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Login</h2>
        <form onSubmit={handleSendOTP} className="flex flex-col items-center">
          <div className="flex items-center w-full border border-gray-300 rounded-lg mb-4 p-2 focus-within:ring-2 focus-within:ring-[#4a90e2]">
            <span className="px-2 font-medium text-gray-500 border-r border-gray-300">+91</span>
            <input
              type="number"
              name="phone"
              placeholder="Enter Mobile Number"
              className="flex-grow p-2 text-gray-800 outline-none"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <p className="mb-6 text-sm text-center text-gray-500">
            We will send you one time password (OTP)
          </p>
          <button
            type="submit"
            className="w-16 h-16 bg-[#00ffff] text-black rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isSending}
          >
            {isSending ? (
              <svg
                className="w-6 h-6 text-black animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            )}
          </button>
        </form>
        {responseMessage && <p className="mt-4 text-center text-gray-700">{responseMessage}</p>}
      </div>
    </div>
  );
};

export default Index;
