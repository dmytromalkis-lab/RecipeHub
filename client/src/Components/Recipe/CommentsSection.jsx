import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CommentsSection.css";
import useUserStore from "../../stores/userStore";
import api from "../../api/axios";
import avatarImg from "../../assets/avatar.png";
import { Pencil, Trash2, X, Check } from "lucide-react";

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CommentsSection({ recipeId }) {
  const [comments, setComments] = useState([]);

  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const maxLength = 250;
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    if (!recipeId) return;

    const fetchComments = async () => {
      try {
        const res = await api.get(`/comment/${recipeId}`);
        setComments(res.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setComments([]);
        } else {
          console.error("Failed to load comments", err);
        }
      }
    };

    fetchComments();
  }, [recipeId]);

  const handleChange = (e) => {
    setComment(e.target.value);
    setError("");
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Please login to verify comment");
      return;
    }

    if (!comment.trim()) return;

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await api.post(
        `/comment/create/${recipeId}`,
        {
          content: comment,
        },
        config
      );

      const newComment = {
        ...res.data,
        User: {
          user_id: user.user_id || user.id, // Гарантируем наличие ID
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username || "",
          avatar: user.avatar,
        },
      };

      setComments((prev) => [...prev, newComment]);
      setComment("");
      setError("");

      const textarea = document.querySelector(".comment-form-textarea");
      if (textarea) textarea.style.height = "auto";
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.delete(`/comment/${commentId}`, config);

      setComments((prev) =>
        prev.filter((c) => (c.comment_id || c.id) !== commentId)
      );
    } catch (err) {
      console.error("Failed to delete", err);
      alert("Failed to delete comment");
    }
  };

  const startEditing = (c) => {
    setEditingId(c.comment_id || c.id);
    setEditText(c.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = async (commentId) => {
    if (!editText.trim()) return;
    if (editText.length > maxLength) {
      alert("Comment is too long");
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await api.put(`/comment/${commentId}`, { content: editText }, config);

      setComments((prev) =>
        prev.map((c) => {
          if ((c.comment_id || c.id) === commentId) {
            return {
              ...c,
              content: editText,
              updatedAt: new Date().toISOString(),
            };
          }
          return c;
        })
      );

      setEditingId(null);
      setEditText("");
    } catch (err) {
      console.error("Failed to update", err);
      alert("Failed to update comment");
    }
  };

  return (
    <section className="comments-section">
      <h3>Comments ({comments.length})</h3>

      <div className="comments-list">
        {comments.map((c) => {
          const author = c.User || c.user || {};
          // Получаем ID автора для ссылки
          const authorId = author.user_id || author.id;

          const isOwner =
            user && (user.user_id === c.user_id || user.id === c.user_id);
          const isEditing = editingId === (c.comment_id || c.id);

          const wasEdited = c.updatedAt && c.updatedAt !== c.createdAt;
          const displayDate = wasEdited ? c.updatedAt : c.createdAt;

          return (
            <div className="comment-item" key={c.comment_id || c.id}>
              {/* Обернули аватар в Link */}
              <Link to={`/profile/${authorId}`} className="comment-avatar-link">
                <div className="comment-avatar">
                  {author.avatar ? (
                    <img
                      src={author.avatar}
                      alt="avatar"
                      className="avatar-img"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {author.first_name ? author.first_name[0] : "?"}
                    </div>
                  )}
                </div>
              </Link>

              <div className="comment-content">
                <div className="comment-header">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {/* Обернули имя в Link */}
                    <Link
                      to={`/profile/${authorId}`}
                      className="comment-author-link"
                    >
                      <span className="comment-author">
                        {author.first_name} {author.last_name}
                      </span>
                    </Link>
                  </div>
                  <span className="comment-date">
                    {formatDate(displayDate)}
                    {wasEdited && (
                      <span style={{ marginLeft: "5px", fontStyle: "italic" }}>
                        (edited)
                      </span>
                    )}
                  </span>
                </div>

                {isEditing ? (
                  <div className="edit-mode">
                    <textarea
                      className="edit-textarea"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      maxLength={maxLength}
                    />
                    <div className="edit-footer">
                      <div className="edit-actions">
                        <button
                          className="comment-save-btn"
                          onClick={() => saveEdit(c.comment_id || c.id)}
                        >
                          <Check size={14} /> Save
                        </button>
                        <button
                          className="comment-cancel-btn"
                          onClick={cancelEditing}
                        >
                          <X size={14} /> Cancel
                        </button>
                      </div>
                      <span className="edit-char-counter">
                        {editText.length}/{maxLength}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="comment-text">{c.content}</div>
                )}
              </div>

              {isOwner && !isEditing && (
                <div className="comment-actions">
                  <button
                    className="action-btn"
                    title="Edit"
                    onClick={() => startEditing(c)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="action-btn delete"
                    title="Delete"
                    onClick={() => handleDelete(c.comment_id || c.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {comments.length === 0 && (
          <p style={{ color: "#888", fontStyle: "italic" }}>
            No comments yet. Be the first!
          </p>
        )}
      </div>

      <form className="comment-form" onSubmit={handleSubmit}>
        <div className="comment-form-avatar">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="User avatar"
              className="avatar-img"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              onError={(e) => {
                if (e.target.src !== avatarImg) e.target.src = avatarImg;
              }}
            />
          ) : (
            <img src={avatarImg} alt="User avatar" className="avatar-img" />
          )}
        </div>
        <div className="comment-form-body">
          <div className="comment-form-input-wrap">
            <textarea
              className="comment-form-textarea"
              placeholder={token ? "Add a comment..." : "Login to comment"}
              value={comment}
              onChange={handleChange}
              disabled={!token || loading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              rows={1}
              style={{ resize: "none", overflow: "hidden" }}
              maxLength={maxLength}
            />
            <button
              type="submit"
              className="comment-send-btn"
              disabled={!token || loading}
            >
              <span>&#x27A4;</span>
            </button>
          </div>

          <span className="comment-char-counter">
            {comment.length}/{maxLength}
          </span>

          {error && <div className="comment-error">{error}</div>}
        </div>
      </form>
    </section>
  );
}
