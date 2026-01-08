"use client";

import { useState } from "react";

export default function CreateRecipeForm({ onClose }) {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [source, setSource] = useState("");
  const [image, setImage] = useState(null);
  const [rating, setRating] = useState(1);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", caption);
    formData.append("source", source);
    formData.append("rating", rating);
    if (image) formData.append("image", image);

    try {
      const res = await fetch("http://localhost:5000/api/recipes/", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to post recipe");

      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="recipe-modal-card">
      <button className="modal-close" onClick={onClose}>×</button>

      <div className="recipe-left">
        <label className="image-box">
          {image ? (
            <img src={URL.createObjectURL(image)} />
          ) : (
            <div className="upload-placeholder">
              <span className="upload-icon">＋</span>
              <span>Click to upload image</span>
            </div>
          )}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        <div className="rating-left">
          <span className="rating-label">Your Recipe Rating:</span>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className={`star ${rating >= n ? "active" : ""}`}
                onClick={() => setRating(n)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="recipe-right">
        <div>
          <label className="field-label">Title</label>
          <input
            className="input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="field-label">Caption</label>
          <textarea
            className="textarea"
            placeholder="Add a describe, or story about recipe"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        <div>
          <label className="field-label">
            Recipe Source <span className="muted">(please upload the original recipe URL)</span>
          </label>
          <input
            className="input small"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </div>

        <div className="actions">
          <button className="cancel" onClick={onClose}>Cancel</button>
          <button className="post" disabled={!title} onClick={handleSubmit}>
            Post Recipe
          </button>
        </div>
      </div>
    </div>
  );
}
