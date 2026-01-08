"use client";

import "./profile.css";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { username } = useParams();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  const [isFollowing, setIsFollowing] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const isOwnProfile = user?.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/users/${username}`,
          { credentials: "include" }
        );

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();

        setProfile(data.user);
        setRecipes(data.recipes);
        setIsFollowing(Boolean(data.user?.isFollowing));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const openEditModal = () => {
    setBio(profile.bio || "");
    setPreviewAvatar(profile.avatarUrl || null);
    setShowEditModal(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setPreviewAvatar(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    const formData = new FormData();
    formData.append("bio", bio);
    if (avatarFile) formData.append("avatar", avatarFile);

    const res = await fetch("http://localhost:5000/api/users/me", {
      method: "PUT",
      credentials: "include",
      body: formData,
    });

    if (!res.ok) return;

    const data = await res.json();
    setProfile((p) => ({ ...p, ...data.user }));
    setShowEditModal(false);
  };

  const toggleFollow = async () => {
    await fetch(
      `http://localhost:5000/api/users/${profile.username}/follow`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    setIsFollowing((prev) => !prev);

    setProfile((p) => ({
      ...p,
      followersCount: p.followersCount + (isFollowing ? -1 : 1),
    }));
  };

  const followFromSearch = async (targetUsername) => {
    await fetch(
      `http://localhost:5000/api/users/${targetUsername}/follow`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    setSearchResults((prev) =>
      prev.map((u) =>
        u.username === targetUsername ? { ...u, isFollowing: true } : u
      )
    );

    if (profile.username === user.username) {
      setProfile((p) => ({
        ...p,
        followingCount: p.followingCount + 1,
      }));
    }
  };

  const searchPeople = async (q) => {
    setSearch(q);
    if (!q) {
      setSearchResults([]);
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/users/search?q=${q}`,
      { credentials: "include" }
    );

    if (!res.ok) return;

    const data = await res.json();
    setSearchResults(data.map((u) => ({ ...u, isFollowing: false })));
  };

  if (loading) return <div className="page-loading">Loading...</div>;
  if (!profile) return <div className="page-error">User not found</div>;

  return (
    <div className="profile-layout">
      <div className="profile-main">
        <div className="profile-header-card">
          <img
            src={profile.avatarUrl || "/default-avatar.png"}
            className="profile-avatar"
          />

          <div className="profile-info">
            <h2>@{profile.username}</h2>
            {profile.bio && <p className="profile-bio">{profile.bio}</p>}

            <div className="profile-stats">
              <span>
                <strong>{profile.followersCount}</strong> Followers
              </span>
              <span>
                <strong>{profile.followingCount}</strong> Following
              </span>
            </div>

            {isOwnProfile ? (
              <button className="edit-profile-btn" onClick={openEditModal}>
                Edit Profile
              </button>
            ) : (
              <button className="follow-btn" onClick={toggleFollow}>
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </div>

        <div className="profile-recipes">
          {recipes.length === 0 && (
            <p className="empty-state">No recipes yet</p>
          )}

          <div className="recipe-grid">
            {recipes.map((r) => (
              <div key={r.id} className="recipe-card">
                <img src={r.imageUrls?.[0] || "/default-recipe.png"} />
                <div className="recipe-card-info">
                  <h4>{r.title}</h4>
                  {r.rating && <span>⭐ {r.rating}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="profile-sidebar">
        <input
          className="search-input"
          placeholder="Search people"
          value={search}
          onChange={(e) => searchPeople(e.target.value)}
        />

        <div className="suggested-box">
          <h4>Who to follow</h4>

          {searchResults.map((u) => (
            <div key={u.username} className="suggested-user">
              <div className="suggested-left">
                <img src={u.avatarUrl || "/default-avatar.png"} />
                <span>@{u.username}</span>
              </div>

              {!u.isFollowing ? (
                <button
                  className="follow-plus"
                  onClick={() => followFromSearch(u.username)}
                >
                  +
                </button>
              ) : (
                <span className="followed-check">✓</span>
              )}
            </div>
          ))}
        </div>
      </aside>

      {showEditModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <button
              className="modal-close"
              onClick={() => setShowEditModal(false)}
            >
              ×
            </button>

            <div className="avatar-upload">
              <label className="avatar-clickable">
                <img
                  src={previewAvatar || "/default-avatar.png"}
                  className="modal-avatar"
                />
                <div className="avatar-overlay">Change</div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  hidden
                />
              </label>
            </div>

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write your bio"
            />

            <button className="save-btn" onClick={handleSaveProfile}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
