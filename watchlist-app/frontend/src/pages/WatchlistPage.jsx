import { useEffect, useState } from "react";
import MediaCard from "../components/MediaCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  fetchMedia,
  createMedia,
  updateRating,
  deleteMedia,
} from "../api/mediaApi.js";

export default function WatchlistPage() {
  const { logout } = useAuth();
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("unwatched");
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("MOVIE");
  const [error, setError] = useState("");

  const loadItems = async () => {
    try {
      const data = await fetchMedia();
      setItems(data);
    } catch (err) {
      setError("Couldn't load your watchlist.");
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const created = await createMedia({ title: newTitle, type: newType });
      setItems((prev) => [created, ...prev]);
      setNewTitle("");
    } catch (err) {
      setError("Couldn't add that title.");
    }
  };

  const handleRate = async (id, rating) => {
    try {
      const updated = await updateRating(id, rating);
      setItems((prev) => prev.map((m) => (m.id === id ? updated : m)));
    } catch (err) {
      setError("Couldn't update the rating.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMedia(id);
      setItems((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError("Couldn't delete that item.");
    }
  };

  const filtered = items.filter((m) =>
    tab === "watched" ? m.status === "WATCHED" : m.status === "UNWATCHED"
  );

  return (
    <div className="app-shell">
      <header>
        <h1>My watchlist</h1>
        <button className="logout-btn" onClick={logout}>Log out</button>
      </header>

      <form className="add-form" onSubmit={handleAdd}>
        <input
          placeholder="Add a title..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <select value={newType} onChange={(e) => setNewType(e.target.value)}>
          <option value="MOVIE">Movie</option>
          <option value="TV">TV Show</option>
        </select>
        <button type="submit">Add</button>
      </form>

      <div className="tabs">
        <button
          className={tab === "unwatched" ? "active" : ""}
          onClick={() => setTab("unwatched")}
        >
          To Watch
        </button>
        <button
          className={tab === "watched" ? "active" : ""}
          onClick={() => setTab("watched")}
        >
          Watched
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="media-list">
        {filtered.length === 0 && <p className="empty">Nothing here yet.</p>}
        {filtered.map((item) => (
          <MediaCard
            key={item.id}
            item={item}
            onRate={handleRate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
