interface NPSRatingProps {
  selectedScore: number | null;
  onScoreSelect: (score: number) => void;
}

export default function NPSRating({
  selectedScore,
  onScoreSelect,
}: NPSRatingProps) {
  const getScoreColor = (score: number) => {
    if (score <= 6) return "text-red-600 border-red-600";
    return "text-green-600 border-green-600";
  };

  const getScoreBg = (score: number) => {
    if (score <= 6) return "bg-red-600";
    return "bg-green-600";
  };

  const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <div className="px-6 py-8">
      <div className="text-center mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Based on your shopping experience, how likely are you to recommend to
          a friend or colleague?
        </h2>
        <p className="text-gray-500 text-sm">
          0 (least likely) to 10 (most likely)
        </p>
      </div>

      <div className="mb-8 space-y-3">
        {/* First row (0–5) */}
        <div className="grid grid-cols-6 gap-3">
          {scores.slice(0, 6).map((score) => (
            <button
              key={score}
              onClick={() => onScoreSelect(score)}
              className={`
          w-12 h-12 rounded-full border-2 font-medium text-lg
          transition-all duration-200 flex items-center justify-center
          ${
            selectedScore === score
              ? `${getScoreBg(score)} text-white border-transparent`
              : `${getScoreColor(score)} bg-white hover:bg-gray-50`
          }
        `}
            >
              {score}
            </button>
          ))}
        </div>

        {/* Second row (6–10) */}
        <div className="flex justify-center gap-3">
          {scores.slice(6).map((score) => (
            <button
              key={score}
              onClick={() => onScoreSelect(score)}
              className={`
          w-12 h-12 rounded-full border-2 font-medium text-lg
          transition-all duration-200 flex items-center justify-center
          ${
            selectedScore === score
              ? `${getScoreBg(score)} text-white border-transparent`
              : `${getScoreColor(score)} bg-white hover:bg-gray-50`
          }
        `}
            >
              {score}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
