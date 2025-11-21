import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Editprofile.scss";
import { Plus } from "lucide-react";

const EditProfile = () => {
  const [updatedData, setUpdatedData] = useState({
    user_id: localStorage.getItem("user_id") || 1,
    username: "",
    bio: "",
    gender: "",
    profileimage: "",
  });

  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id") || 1;

  /** ─── FETCH EXISTING PROFILE DATA ─── */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://bikesite.test/api/profiledetails?user_id=${user_id}`
        );
        if (res.data) {
          setUpdatedData((prev) => ({
            ...prev,
            username: res.data.username || "",
            bio: res.data.bio || "",
            gender: res.data.gender || "",
            profileimage: res.data.profileimage || "",
          }));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, [user_id]);

  /** ─── HANDLE TEXT & SELECT INPUTS ─── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };

  /** ─── HANDLE IMAGE UPLOAD ─── */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUpdatedData((prev) => ({ ...prev, profileimage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  /** ─── SAVE / UPDATE PROFILE ─── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://bikesite.test/api/profiledetails", updatedData);
      localStorage.setItem("hasCompletedProfile", "true");
      navigate("/profile-page");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save profile. Please try again.");
    }
  };

  return (
    <div className="edit-profile-container">
      {/* ─── PROFILE IMAGE ─── */}
      <div className="profile-avatar-wrapper">
        <img
          src={
            updatedData.profileimage ||
            "/default-avatar.png" // fallback if none in DB
          }
          alt="Profile"
          className="profile-avatar"
        />
        <label htmlFor="profile-upload" className="edit-icon">
          <Plus />
        </label>
        <input
          type="file"
          id="profile-upload"
          accept="image/*"
          onChange={handleImageChange}
          hidden
        />
      </div>

      {/* ─── FORM ─── */}
      <form className="edit-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="@username"
            value={updatedData.username}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea
            name="bio"
            placeholder="Write a short bio..."
            value={updatedData.bio}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select
            name="gender"
            value={updatedData.gender}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        <button type="submit" className="save-btn">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
