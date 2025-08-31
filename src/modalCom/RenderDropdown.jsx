import React from "react";
import { ChevronDown } from "lucide-react";
import { useAuth } from "../contexts/AuthConext";
export default function RenderDropdown({
  surveyObj,
  expandedQuestion,
  setExpandedQuestion,
  selectedSub,
  handleSubSelect,
}) {
  if (!surveyObj?.length) {
    return <div className="text-gray-500 text-sm">No questions available.</div>;
  }

  const { subQuestions, getSubQuestions } = useAuth();

  return (
    <div className="mb-8 space-y-4">
      {surveyObj.map((question, index) => {
        const isExpanded = expandedQuestion === question.questionId;
        const selectedSubId = selectedSub?.[question.questionId]?.subQuestionId; // ✅ per question check

        return (
          <div
            key={question.questionId}
            className="p-4 border border-gray-200 rounded-xl"
          >
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => {
                setExpandedQuestion(isExpanded ? null : question.questionId);
                if (!isExpanded) {
                  getSubQuestions(question.questionId);
                }
              }}
            >
              <div className="flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  {index + 1}
                </span>
                <h4 className="text-lg font-medium text-gray-900">
                  {question.question}
                </h4>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-600 transform transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </div>

            {isExpanded &&
              Array.isArray(subQuestions) &&
              subQuestions.length > 0 && (
                <div className="ml-8 mt-3 space-y-2">
                  {subQuestions.map((sub) => {
                    const subId = sub?.subQuestionId ?? sub?.questionId;
                    const subText = sub?.subQuestion ?? sub?.question ?? "";

                    return (
                      <div
                        key={subId}
                        onClick={() =>
                          handleSubSelect(
                            question.questionId,
                            subId,
                            question.question, // ✅ Question name
                            subText            // ✅ SubQuestion name
                          )
                        }
                        className={`p-3 border rounded-lg cursor-pointer transition ${
                          selectedSubId === subId
                            ? "bg-blue-500 text-white border-blue-600"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {subText}
                      </div>
                    );
                  })}
                </div>
              )}
          </div>
        );
      })}
    </div>
  );
}
