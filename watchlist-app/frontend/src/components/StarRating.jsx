import { useState } from "react";

export default function StarRating({ rating, onRate }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="star-rating" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || rating || 0);
        return (
          <span
            key={star}
            className={`star ${filled ? "filled" : ""}`}
            onMouseEnter={() => setHovered(star)}
            onClick={() => onRate(star)}
            role="button"
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
