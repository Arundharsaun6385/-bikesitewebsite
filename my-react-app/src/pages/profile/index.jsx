import React, { useState, useEffect } from "react";
import defaultMale from "../../../images/default proifle.webp";
import defaultFemale from "../../../images/femaledefaultprofile.jpg";
import "./profile.scss";

import {
  Camera,
  Tag,
  Video,
  Plus,
  LogOut,
  Share2,
  Settings,
} from "lucide-react";
import { TiThMenu } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../Components/tabs";
import { Card, CardContent } from "../../Components/Card";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [highlights, setHighlights] = useState([]);
  // selectedVideo: { videos: [...], index: 0, id, link, views }
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [archivedHighlights, setArchivedHighlights] = useState([]);
  const [modalMenuOpen, setModalMenuOpen] = useState(false);
  const [profile, setProfile] = useState({});

  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id") || 1; // replace in prod

  /** ─── IMAGE UPLOAD ─── */
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result;
      setProfile((prev) => ({ ...prev, profileimage: base64Data }));

      try {
        await axios.post("http://bikesite.test/api/profiledetails", {
          user_id,
          profileimage: base64Data,
          username: profile.username,
          bio: profile.bio,
          gender: profile.gender,
          highlight: JSON.stringify({ highlights }),
        });
        console.log("Profile image updated ✅");
      } catch (error) {
        console.error("Profile image update failed ❌", error);
      }
    };

    reader.readAsDataURL(file);
  };

  /** ─── REDIRECT IF PROFILE NOT COMPLETED ─── */
  useEffect(() => {
    if (!localStorage.getItem("hasCompletedProfile")) {
      navigate("/Editprofile");
    }
  }, [navigate]);

  /** ─── FETCH POSTS ─── */
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("http://bikesite.test/api/sellerinfo");
        setPosts(res.data || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  /** ─── FETCH PROFILE FROM DB ─── */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://bikesite.test/api/profiledetails?user_id=${user_id}`
        );
        setProfile(res.data || {});
        // If profile contains stored highlights, hydrate local highlights
        if (res.data && res.data.highlights) {
          // try to parse server highlight structure
          try {
            const serverHighlights =
              typeof res.data.highlights === "string"
                ? JSON.parse(res.data.highlights)
                : res.data.highlights;
            if (Array.isArray(serverHighlights)) {
              setHighlights(serverHighlights);
            }
          } catch {
            // ignore parse errors
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, [user_id]);

  /** ─── LOGOUT ─── */
  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    try {
      await axios.post("http://bikesite.test/api/logout", {
        phone: localStorage.getItem("phone"),
      });
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  /** ─── PROFILE IMAGE SOURCE ─── */
  const profileImageSrc =
    profile.profileimage ||
    (profile.gender === "Female" ? defaultFemale : defaultMale);

  /** ─── HIGHLIGHT ACTION HELPERS ─── */
  const handleRemoveHighlight = async (id) => {
    if (!id) {
      // if no id (temp highlight), remove locally by reference
      setHighlights((prev) => prev.filter((h) => h.id !== id));
      setSelectedVideo(null);
      setActiveMenuId(null);
      return;
    }
    try {
      setHighlights((prev) => prev.filter((h) => h.id !== id));
      await axios.delete(`http://bikesite.test/api/highlights/${id}`);
    } catch (err) {
      console.error("Failed to remove highlight:", err);
    } finally {
      setSelectedVideo(null);
      setActiveMenuId(null);
      setModalMenuOpen(false);
    }
  };

  const handleEditHighlight = (id) => {
    // trigger hidden input for editing (if exists)
    const input = document.getElementById(`highlight-edit-input-${id}`);
    if (input) {
      input.click();
    } else {
      // nothing to edit — fallback: alert
      alert("No edit input available for this highlight.");
    }
    setActiveMenuId(null);
    setModalMenuOpen(false);
  };

  const handleCopyLink = async (linkOrId) => {
    const link =
      typeof linkOrId === "string"
        ? linkOrId
        : `${window.location.origin}/h/${linkOrId}`;
    try {
      await navigator.clipboard.writeText(link);
      alert("Link copied to clipboard");
    } catch (err) {
      console.error("Copy link failed:", err);
    } finally {
      setActiveMenuId(null);
      setModalMenuOpen(false);
    }
  };

  const handleShareHighlight = async (linkOrId) => {
    const link =
      typeof linkOrId === "string"
        ? linkOrId
        : `${window.location.origin}/h/${linkOrId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Highlight", url: link });
      } else {
        await navigator.clipboard.writeText(link);
        alert("Link copied to clipboard (share fallback).");
      }
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setActiveMenuId(null);
      setModalMenuOpen(false);
    }
  };

  const handleArchiveHighlight = async (id) => {
    try {
      const toArchive =
        highlights.find((h) => h.id === id) || { id, videos: selectedVideo?.videos };
      setHighlights((prev) => prev.filter((h) => h.id !== id));
      setArchivedHighlights((prev) => [toArchive, ...prev]);
      if (id) {
        await axios.post(`http://bikesite.test/api/highlights/${id}/archive`);
      }
    } catch (err) {
      console.error("Failed to archive highlight:", err);
    } finally {
      setSelectedVideo(null);
      setActiveMenuId(null);
      setModalMenuOpen(false);
    }
  };

  /** ─── HIGHLIGHT UPLOAD (no heavy validation — graceful) ─── */
  const handleAddHighlights = async (files) => {
    const safeFiles = Array.from(files || []);
    if (safeFiles.length === 0) return;

    // immediate UI feedback using local object URLs
    const previewUrls = safeFiles.map((f) => URL.createObjectURL(f));
    const newHighlight = { id: Date.now(), videos: previewUrls, views: 0 };
    setHighlights((prev) => [...prev, newHighlight]);

    try {
      const formData = new FormData();
      formData.append("user_id", user_id);
      safeFiles.forEach((file) => formData.append("videos", file));

      const res = await axios.post("http://bikesite.test/api/highlights", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res && res.data) {
        const serverHighlight = res.data.highlight || res.data;
        // merge server info with our provisional highlight
        setHighlights((prev) =>
          prev.map((h) => (h.id === newHighlight.id ? { ...h, ...serverHighlight } : h))
        );
      }
    } catch (err) {
      console.error("Error uploading highlights:", err);
      // keep local preview so user can retry (no hard validation)
    }
  };

  return (
    <div className="insta-profile-container">
      {/* TOPBAR */}
      <div className="profile-topbar">
        <h2 className="username">{profile.username || "User"}</h2>

        <div className="menu-container">
          <button className="menu-button" onClick={() => setShowMenu(!showMenu)}>
            <TiThMenu />
          </button>

          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={() => navigate("/Editprofile")}>
                <Settings size={16} /> Edit Profile
              </button>
              <button onClick={() => navigate("/Share-profile")}>
                <Share2 size={16} /> Share Profile
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PROFILE HEADER */}
      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          <img src={profileImageSrc} alt="Profile" className="profile-avatar" />
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

        <div className="profile-stats">
          <div className="stat-item">
            <strong>{posts.length}</strong>
            <span>Posts</span>
          </div>
          <div className="stat-item">
            <strong>12</strong>
            <span>BikeBuys</span>
          </div>
          <div className="stat-item">
            <strong>30</strong>
            <span>Bikes Sold</span>
          </div>
        </div>
      </div>

      {/* BIO */}
      <div className="bio-section">
        <p className="bio-text">{profile.bio || "Welcome to my bike page 🚴"}</p>
      </div>

      {/* PROFILE BUTTONS */}
      <div className="profile-buttons">
        <button onClick={() => navigate("/Editprofile")}>Edit profile</button>
        <button onClick={() => navigate("/Share-profile")}>Share profile</button>
      </div>

      {/* HIGHLIGHTS */}
      <div className="highlights">
        <div
          className="highlight add-highlight"
          onClick={() => document.getElementById("highlight-video-input").click()}
        >
          <Plus size={20} />
        </div>

        <input
          type="file"
          id="highlight-video-input"
          accept="video/*"
          multiple
          hidden
          onChange={async (e) => {
            const files = Array.from(e.target.files || []);
            await handleAddHighlights(files);
            e.target.value = null;
          }}
        />

        {highlights.map((highlight, index) => (
          <div className="highlight" key={highlight.id || index}>
            <div
              className="highlight-thumb"
              onClick={() =>
                setSelectedVideo({
                  videos: highlight.videos || [],
                  index: 0,
                  id: highlight.id,
                  link: highlight.link,
                  views: highlight.views || 0,
                })
              }
            >
              {highlight.videos && highlight.videos[0] ? (
                <video src={highlight.videos[0]} className="highlight-video" />
              ) : (
                <div className="highlight-empty" />
              )}
            </div>

            {/* Thumbnail menu (three dots) */}
            <div className="highlight-menu-wrapper">
              <button
                className="highlight-menu-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuId((prev) => (prev === highlight.id ? null : highlight.id));
                }}
                aria-haspopup="true"
                aria-expanded={activeMenuId === highlight.id}
              >
                ⋯
              </button>

              {activeMenuId === highlight.id && (
                <div
                  className="highlight-menu-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button onClick={() => handleRemoveHighlight(highlight.id)}>
                    Remove from highlight
                  </button>
                  <button onClick={() => handleEditHighlight(highlight.id)}>Edit highlight</button>
                  <button onClick={() => handleShareHighlight(highlight.link || highlight.id)}>
                    Share
                  </button>
                  <button onClick={() => handleCopyLink(highlight.link || highlight.id)}>
                    Copy link
                  </button>
                  <button onClick={() => handleArchiveHighlight(highlight.id)}>
                    Archive highlight
                  </button>
                </div>
              )}
            </div>

            {/* hidden edit input per highlight */}
            <input
              type="file"
              id={`highlight-edit-input-${highlight.id}`}
              accept="video/*"
              multiple
              hidden
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                if (files.length === 0) return;

                const previewUrls = files.map((f) => URL.createObjectURL(f));
                // optimistic UI replace
                setHighlights((prev) =>
                  prev.map((h) => (h.id === highlight.id ? { ...h, videos: previewUrls } : h))
                );

                try {
                  const formData = new FormData();
                  formData.append("user_id", user_id);
                  files.forEach((file) => formData.append("videos", file));

                  const res = await axios.post(
                    `http://bikesite.test/api/highlights/${highlight.id}/replace`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                  );

                  if (res && res.data) {
                    const serverHighlight = res.data.highlight || res.data;
                    setHighlights((prev) =>
                      prev.map((h) => (h.id === highlight.id ? { ...h, ...serverHighlight } : h))
                    );
                  }
                } catch (err) {
                  console.error("Failed to update highlight:", err);
                } finally {
                  e.target.value = null;
                }
              }}
            />
          </div>
        ))}
      </div>

      {/* VIDEO MODAL */}
      {selectedVideo && (
        <div className="video-modal" onClick={() => setSelectedVideo(null)}>
          <div
            className="video-modal-content"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {modalMenuOpen && selectedVideo && (
              <div className="video-modal-menu" onClick={(e) => e.stopPropagation()}>
                <div>
                  <button onClick={() => handleRemoveHighlight(selectedVideo.id)}>
                    Remove from highlight
                  </button>
                  <button onClick={() => handleEditHighlight(selectedVideo.id)}>
                    Edit highlight
                  </button>
                  <button onClick={() => handleShareHighlight(selectedVideo.link || selectedVideo.id)}>
                    Share
                  </button>
                  <button onClick={() => handleCopyLink(selectedVideo.link || selectedVideo.id)}>
                    Copy link
                  </button>
                  <button onClick={() => handleArchiveHighlight(selectedVideo.id)}>
                    Archive highlight
                  </button>
                  <button onClick={() => setModalMenuOpen(false)}>
                  cancel  
                  </button>
                </div>

              </div>
            )}

            <div className="video-player-wrap">
              <video
                src={selectedVideo.videos[selectedVideo.index]}
                controls
                autoPlay
                className="video-player"
              />
              {/* bottom overlay — left: views, right: menu */}
              <div className="video-bottom-overlay">
                <div className="overlay-left">
                  {/* show the view count if available; default to 0 */}
                  <span className="views-count">{selectedVideo.views ?? 0} views</span>
                </div>

                <div className="overlay-right">
                  {/* menu button */}
                  <button
                    className="video-overlay-menu-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      // open modal bottom menu
                      setModalMenuOpen(true);
                    }}
                    aria-haspopup="true"
                    aria-expanded={modalMenuOpen}
                  >
                    ⋯
                  </button>
                </div>
              </div>
            </div>


            <button className="close-btn" onClick={() => setSelectedVideo(null)}>
              ✖
            </button>
          </div>
        </div>
      )}

      {/* Archived highlights (simple list) */}
      {archivedHighlights.length > 0 && (
        <div className="archived-highlights">
          <h3>Archived highlights</h3>
          <div className="archived-list">
            {archivedHighlights.map((h) => (
              <div key={h.id} className="archived-item">
                {h.videos && h.videos[0] ? (
                  <video src={h.videos[0]} className="highlight-video" />
                ) : (
                  <div className="highlight-empty" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* POSTS TAB */}
      <Tabs defaultValue="posts" className="tabs">
        <TabsList className="tabs-list">
          <TabsTrigger value="posts">
            <Camera className="tab-icon" style={{ marginInline: "auto" }} />
          </TabsTrigger>
          <TabsTrigger value="reels">
            <Video className="tab-icon" style={{ marginInline: "auto" }} />
          </TabsTrigger>
          <TabsTrigger value="tagged">
            <Tag className="tab-icon" style={{ marginInline: "auto" }} />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <Card className="tab-content">
            <CardContent className="card-content">
              {isLoading ? (
                <div className="loading-spinner-container">
                  <div className="spinner" />
                  <p>Loading listings...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="no-posts-instagram-style">
                  <Camera className="no-posts-icon" />
                  <p className="no-posts-text">No Listings Yet</p>
                </div>
              ) : (
                <div className="post-grid">
                  {posts.map((bike, idx) => (
                    <div className="post-item" key={idx}>
                      <img src={bike.profileImage} alt={bike.model} className="post-image" />
                      <div className="overlay">
                        <p className="overlay-text">
                          {bike.brand} - ₹{bike.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
