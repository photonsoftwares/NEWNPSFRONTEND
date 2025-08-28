import { X, Save } from "lucide-react";

export default function CreateSubQuestionModal({
  newQuestion,
  setNewQuestion,
  questions,
  onClose,
  onSave
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create Sub Question</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Sub Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub Question *
            </label>
            <input
              type="text"
              value={newQuestion.subQuestion}
              onChange={(e) =>
                setNewQuestion((prev) => ({ ...prev, subQuestion: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter sub question"
            />
          </div>

          {/* Parent Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent Question *
            </label>
            <select
              value={newQuestion.questionId}
              onChange={(e) =>
                setNewQuestion((prev) => ({
                  ...prev,
                  questionId: parseInt(e.target.value),
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={0}>Select a Question</option>
              {questions.map((q) => (
                <option key={q.questionId} value={q.questionId}>
                  {q.question}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button onClick={onClose} className="px-6 py-3 text-gray-600 hover:text-gray-900">
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!newQuestion.subQuestion || !newQuestion.questionId}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 
                       rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Save className="mr-2 w-4 h-4" />
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
