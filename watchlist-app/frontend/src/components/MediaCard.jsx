import StarRating from "./StarRating.jsx";

export default function MediaCard({ item, onRate, onDelete }) {
  return (
    <div className="media-card">
      <div className="media-info">
        <span className="media-title">{item.title}</span>
        <span className="media-type">{item.type === "TV" ? "TV Show" : "Movie"}</span>
      </div>
      <StarRating rating={item.rating} onRate={(r) => onRate(item.id, r)} />
      <button className="delete-btn" onClick={() => onDelete(item.id)} aria-label="Delete">
        ✕
      </button>
    </div>
  );
}
