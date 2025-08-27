import { X, Save } from "lucide-react";

export default function CreateQuestionModal({
  newQuestion,
  setNewQuestion,
  categories,
  onClose,
  onSave
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Question</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Question Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Name *
              </label>
              <textarea
                value={newQuestion.question}
                onChange={(e) =>
                  setNewQuestion((prev) => ({ ...prev, question: e.target.value }))
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="Enter the question text"
              />
            </div>

            {/* Question Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Code *
              </label>
              <input
                type="text"
                value={newQuestion.question_code}
                onChange={(e) =>
                  setNewQuestion((prev) => ({
                    ...prev,
                    question_code: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Q001"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={newQuestion.category_id}
                onChange={(e) =>
                  setNewQuestion((prev) => ({
                    ...prev,
                    category_id: parseInt(e.target.value),
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value={0}>Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>

            {/* Question Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Type *
              </label>
              <select
                value={newQuestion.type}
                onChange={(e) =>
                  setNewQuestion((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="text">Text</option>
                <option value="rating">Rating</option>
                <option value="multi-choice">Multiple Choice</option>
              </select>
            </div>

            {/* Weightage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weightage
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="10"
                value={newQuestion.weightage}
                onChange={(e) =>
                  setNewQuestion((prev) => ({
                    ...prev,
                    weightage: parseFloat(e.target.value),
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Rating Scale (only if type=rating) */}
            {newQuestion.type === "rating" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating Scale (e.g. 5 or 10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newQuestion.level}
                  onChange={(e) =>
                    setNewQuestion((prev) => ({
                      ...prev,
                      level: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            )}

            {/* Options (only if type=multi-choice) */}
            {newQuestion.type === "multi-choice" && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Options (comma separated)
                </label>
                <input
                  type="text"
                  value={newQuestion.options}
                  onChange={(e) =>
                    setNewQuestion((prev) => ({
                      ...prev,
                      options: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Option1, Option2, Option3"
                />
              </div>
            )}

            {/* Target Concept */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Concept
              </label>
              <input
                type="text"
                value={newQuestion.target_concept}
                onChange={(e) =>
                  setNewQuestion((prev) => ({
                    ...prev,
                    target_concept: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Target concept or theme"
              />
            </div>

            {/* User Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Category
              </label>
              <input
                type="text"
                value={newQuestion.user_category}
                onChange={(e) =>
                  setNewQuestion((prev) => ({
                    ...prev,
                    user_category: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Target user category"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!newQuestion.question || !newQuestion.question_code || !newQuestion.category_id}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center"
          >
            <Save className="mr-2 w-4 h-4" />
            Create Question
          </button>
        </div>
      </div>
    </div>
  );
}
