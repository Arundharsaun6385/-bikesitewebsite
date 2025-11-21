import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import EntryOtpLogin from "../src/pages/EntryOtpLogin";
import Verifyotp from "../src/pages/verifyOtp";
import Location from "../src/Location";
import Webpage from "../src/pages/Webpage";
import Profile from "../src/pages/profile";
import NavBar from "../src/Components/NavBar";
import Seller from "../src/pages/SellerForm";
import Buyer from "../src/pages/Buyer";
import EditProfile from "../src/pages/Editprofile";
import ShareProfile from "../src/pages/ShareProfile";
import { useEffect } from "react";
import { Contextprovider } from "./Context/Contextprovider";
import { useNavigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const hideNavRoutes = ["/", "/verifyOtp", "/location"];
  const shouldHideNav = hideNavRoutes.includes(location.pathname);
  const success = localStorage.getItem("isVerified");

  // 🔥 Auto redirect if verified
  useEffect(() => {
    if (
      success &&
      (location.pathname === "/" || location.pathname === "/verifyOtp")
    ) {
      navigate("/Webpage", { replace: true });
    }
  }, [success, location.pathname, navigate]);
  return (
    <>
      <Contextprovider>
        <Routes>
          <Route path="/" element={<EntryOtpLogin />} />
          <Route path="/verifyOtp" element={<Verifyotp />} />
          {success && (
            <>
              <Route path="/location" element={<Location />} />
              <Route path="/Webpage" element={<Webpage />} />
              <Route path="/profile-page" element={<Profile />} />
              <Route path="/Seller-page" element={<Seller />} />
              <Route path="/Buyer-page" element={<Buyer />} />
              <Route path="/Editprofile" element={<EditProfile />} />
              <Route path="/Share-profile" element={<ShareProfile />} />
            </>
          )}
        </Routes>
      </Contextprovider>
      {success && !shouldHideNav && <NavBar />}
    </>
  );
}

export default App;
