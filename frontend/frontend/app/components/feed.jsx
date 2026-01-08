"use client";

import "./feed.css";
import { useEffect, useState } from "react";

export default function Feed() {
  const [recipes, setRecipes] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const feedRes = await fetch("http://localhost:5000/api/feed", {
        credentials: "include",
      });
      const feedData = await feedRes.json();
      setRecipes(feedData.recipes || []);

      const suggestRes = await fetch(
        "http://localhost:5000/api/users/suggested",
        { credentials: "include" }
      );
      const suggestData = await suggestRes.json();
      setSuggested(suggestData);

      setLoading(false);
    };

    load();
  }, []);

  const followUser = async (username) => {
    await fetch(`http://localhost:5000/api/users/${username}/follow`, {
      method: "POST",
      credentials: "include",
    });

    setSuggested((prev) =>
      prev.filter((u) => u.username !== username)
    );
  };

  if (loading) return <div className="feed-loading">Loading...</div>;

  return (
    <div className="feed-layout">
      <div />

      <div className="feed-center">
        {recipes.length === 0 && (
          <div className="feed-empty">
            <h3>Your feed is empty 🍽️</h3>
            <p>Follow people to start seeing recipes.</p>
          </div>
        )}

        {recipes.map((r) => (
          <div key={r.id} className="feed-card">
            <div className="feed-card-header">
              <img
                src={r.author.avatarUrl || "/default-avatar.png"}
                className="feed-avatar"
              />
              <span>@{r.author.username}</span>
            </div>

            <h3 className="feed-title">{r.title}</h3>

            {r.imageUrls?.[0] && (
              <img src={r.imageUrls[0]} className="feed-image" />
            )}

            {r.description && (
              <p className="feed-caption">
                <strong>@{r.author.username}</strong> {r.description}
              </p>
            )}

            {r.source && (
              <a
                href={r.source}
                target="_blank"
                rel="noopener noreferrer"
                className="feed-source"
              >
                View original recipe →
              </a>
            )}

            <div className="feed-actions">
              <span className="like-btn">♥ Like</span>
              {r.rating && <span className="rating">⭐ {r.rating}</span>}
            </div>
          </div>
        ))}
      </div>

      <aside className="feed-sidebar">
        <div className="suggested-box">
          <h4>Who to follow</h4>

          {suggested.map((u) => (
            <div key={u.id} className="suggested-user">
              <div className="suggested-left">
                <img src={u.avatarUrl || "/default-avatar.png"} />
                <span>@{u.username}</span>
              </div>

              <button
                className="follow-plus"
                onClick={() => followUser(u.username)}
              >
                +
              </button>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
