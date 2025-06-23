"use client";

import { useState } from "react";

export function StarRating({
  rating,
  editable = false,
  onChange,
}: {
  rating: number;
  editable?: boolean;
  onChange?: (rating: number) => void;
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value: number) => {
    if (editable && onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          className={`${
            editable ? "cursor-pointer" : "cursor-default"
          } text-xl focus:outline-none`}
          onClick={() => handleClick(value)}
          onMouseEnter={() => editable && setHoverRating(value)}
          onMouseLeave={() => editable && setHoverRating(0)}
          aria-label={`Rate ${value} out of 5`}
        >
          <span
            className={`${
              (hoverRating || rating) >= value
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}
