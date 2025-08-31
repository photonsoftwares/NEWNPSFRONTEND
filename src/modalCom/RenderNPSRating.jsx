import React from "react";

export default function RenderNPSRating({ stepId, currentRating, onRatingChange }) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
        {[0,1,2,3,4,5,6,7,8,9,10].map(rating => (
          <button
            key={rating}
            onClick={() => onRatingChange(stepId, rating)}
            className={`w-12 h-12 rounded-full transition-all duration-200 flex items-center justify-center text-lg font-bold border-2 ${
              currentRating === rating
                ? rating <= 3
                  ? 'bg-red-500 border-red-600 text-white scale-110 shadow-lg'
                  : rating <= 6
                  ? 'bg-yellow-500 border-yellow-600 text-white scale-110 shadow-lg'
                  : 'bg-green-500 border-green-600 text-white scale-110 shadow-lg'
                : rating <= 3
                ? 'border-red-300 text-red-500 hover:bg-red-50'
                : rating <= 6
                ? 'border-yellow-300 text-yellow-600 hover:bg-yellow-50'
                : 'border-green-300 text-green-600 hover:bg-green-50'
            }`}
          >
            {rating}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-sm text-gray-500 px-2">
        <span>0 (least likely)</span>
        <span>10 (most likely)</span>
      </div>
    </div>
  );
}
