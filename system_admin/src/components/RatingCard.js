import React, { useState } from "react";
import Swal from "sweetalert2";

const RatingCard = ({
  storeId,
  storeName,
  address,
  averageRating,
  userRating,
  userId,
  email,
  name,
  token,
  onRatingSuccess,
}) => {
  const [rating, setRating] = useState(userRating || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRatingClick = (value) => {
    setRating(value);
    setIsEditing(true);
  };

 const handleSubmit = async () => {
  if (rating === 0) {
    Swal.fire("Oops!", "Please select a rating before submitting.", "warning");
    return;
  }

  setLoading(true);
  try {
    const response = await fetch("http://localhost:5000/api/rate", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        storeID: storeId,
        userId,     // <-- include userId if backend needs it
        rating,
        name,
        email
      }),
    });

    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.msg || json.message || "Failed to submit rating");
    }

    Swal.fire("Success!", json.msg || "Your rating has been submitted!", "success");
    setIsEditing(false);

    if (onRatingSuccess) onRatingSuccess(storeId, rating);
  } catch (error) {
    Swal.fire("Error!", error.message, "error");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative bg-white shadow rounded-lg p-4 w-64 text-sm">
      {/* Store Info */}
      <h2 className="text-base font-semibold truncate">{storeName}</h2>
      <p className="text-gray-500 text-xs truncate">{address}</p>

      <p className="text-gray-700 text-xs mt-2">
        Overall:{" "}
        <span className="text-yellow-600 font-bold">
          {averageRating ?? "N/A"}
        </span>
      </p>
      <p className="text-gray-600 text-xs">
        Your Rating:{" "}
        <span className="font-semibold">{userRating || "Not rated"}</span>
      </p>

      {/* Rating Buttons */}
      <div className="mt-2 flex space-x-1">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => handleRatingClick(num)}
            disabled={loading}
            className={`px-2 py-1 rounded-full border text-xs ${
              rating >= num
                ? "bg-yellow-400 text-white"
                : "bg-gray-200 text-gray-700"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex justify-end space-x-2 mt-2">
          <button
            onClick={() => {
              setRating(userRating || 0);
              setIsEditing(false);
            }}
            className="px-2 py-1 bg-gray-300 rounded text-xs hover:bg-gray-400"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>
      )}
      <div className="absolute bottom-1 right-1 opacity-40 text-xs">⭐</div>
    </div>
  );
};

export default RatingCard;
