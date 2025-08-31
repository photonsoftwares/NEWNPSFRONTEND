import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  Edit,
  BarChart3,
  Calendar,
  MessageSquare,
  Users,
  Eye,
  Star,
  TrendingUp,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../contexts/AuthConext";

export default function ViewSurvey() {
  const { surveyId } = useParams();
  const { getSurveyById, getQuestions, getSubQuestions } = useAuth(); // ✅ Added getSubQuestions
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (surveyId) {
      loadSurvey(surveyId);
    }
  }, [surveyId]);

const loadSurvey = async (id) => {
  try {
    setLoading(true);

    // ✅ Survey details
    const surveyResponse = await getSurveyById(id);
    if (surveyResponse?.status === true) {
      const surveyData = surveyResponse.data;

      // ✅ Load questions for this survey
      const questionsResponse = await getQuestions(id);
      if (questionsResponse?.status === true) {
        const questions = questionsResponse.data || []; // ✅ array directly

        // ✅ Har question ke liye sub-questions attach karo
        const questionsWithSubs = await Promise.all(
          questions.map(async (q) => {
            try {
              const subRes = await getSubQuestions(q.questionId);
              return {
                ...q,
                subQuestions: subRes?.status ? (subRes.data || []) : [], // ✅ always array
              };
            } catch (err) {
              console.error("Error fetching sub-questions:", err);
              return { ...q, subQuestions: [] };
            }
          })
        );

        // ✅ Final survey object with questions + subQuestions
        setSurvey({
          ...surveyData,
          questions: questionsWithSubs,
        });
      } else {
        setSurvey({
          ...surveyData,
          questions: [],
        });
      }
    }
  } catch (error) {
    console.error("Error loading survey:", error);
  } finally {
    setLoading(false);
  }
};



  const copyToClipboard = () => {
const surveyUrl = `${window.location.origin}/customer/${surveyId}`;

    navigator.clipboard.writeText(surveyUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Survey not found
          </h2>
          <p className="text-gray-600 mb-6">
            The survey you're looking for doesn't exist.
          </p>
          <Link
            to="/admin"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center text-gray-600 hover:text-gray-900 mr-6 transition-colors"
              >
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back to Admin
              </Link>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Survey Details
                  </h1>
                  <p className="text-gray-600">
                    View and manage survey information
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to={`/admin/surveys/edit/${surveyId}`}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                <Edit className="mr-2 w-4 h-4" />
                Edit Survey
              </Link>
              <Link
                to={`/customer?survey=${surveyId}`}
                target="_blank"
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                <ExternalLink className="mr-2 w-4 h-4" />
                Preview Survey
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Survey Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {survey.surveyName}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      Code: <span className="font-mono">{survey.surveyCode}</span>
                    </span>
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                        survey.status
                      )}`}
                    >
                      {survey.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates & Meta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Survey Name</h4>
                  <p className="text-gray-600">{survey.surveyName}</p>
                </div>

                {survey.target_concept && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Target Concept
                    </h4>
                    <p className="text-gray-600">{survey.target_concept}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Start Date</h4>
                  <p className="text-gray-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(survey.startDate)}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">End Date</h4>
                  <p className="text-gray-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(survey.endDate)}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Created</h4>
                  <p className="text-gray-600">{formatDate(survey.createdDate)}</p>
                </div>
              </div>

              {survey.description && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {survey.description}
                  </p>
                </div>
              )}

              {survey.short_description && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Short Description
                  </h4>
                  <p className="text-gray-600">{survey.short_description}</p>
                </div>
              )}
            </div>

            {/* Questions */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="mr-2 w-6 h-6 text-blue-600" />
                  Survey Questions
                </h3>
                <span className="text-sm text-gray-600">
                  {survey.questions?.length || 0} questions
                </span>
              </div>

              {survey.questions && survey.questions.length > 0 ? (
                <div className="space-y-4">
                  {survey.questions.map((question, index) => (
                    <div
                      key={question.questionId}
                      className="p-4 border border-gray-200 rounded-xl"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                              {index + 1}
                            </span>
                          </div>
                          <h4 className="text-lg font-medium text-gray-900 mb-1">
                            {question.question}
                          </h4>

                          {/* ✅ Sub Questions */}
                          {question.subQuestions &&
                            question.subQuestions.length > 0 && (
                              <div className="ml-6 mt-3 space-y-2">
                                {question.subQuestions.map((sub, subIdx) => (
                                  <div
                                    key={sub.questionId}
                                    className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
                                  >
                                    <span className="text-sm text-gray-700">
                                      {index + 1}.{subIdx + 1} {sub.subQuestion}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No questions assigned to this survey
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={copyToClipboard}
                  className="w-full flex items-center justify-center bg-blue-50 text-blue-700 px-4 py-3 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  {copySuccess ? (
                    <>
                      <Star className="mr-2 w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 w-4 h-4" />
                      Copy Survey Link
                    </>
                  )}
                </button>

                <Link
                  to={`/admin/surveys/edit/${surveyId}`}
                  className="w-full flex items-center justify-center bg-gray-50 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Edit className="mr-2 w-4 h-4" />
                  Edit Survey
                </Link>

                <Link
                  to={`/admin/analytics?survey=${surveyId}`}
                  className="w-full flex items-center justify-center bg-green-50 text-green-700 px-4 py-3 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <BarChart3 className="mr-2 w-4 h-4" />
                  View Analytics
                </Link>
              </div>
            </div>

            {/* Survey Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Survey Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-gray-600">Total Responses</span>
                  </div>
                  <span className="font-semibold text-gray-900">247</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-600">NPS Score</span>
                  </div>
                  <span className="font-semibold text-green-600">+42</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="text-gray-600">Avg Rating</span>
                  </div>
                  <span className="font-semibold text-gray-900">8.3</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="text-gray-600">Last Response</span>
                  </div>
                  <span className="text-sm text-gray-600">2 hours ago</span>
                </div>
              </div>
            </div>

            {/* Status Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Survey Status
              </h3>
              <div className="space-y-3">
                <div
                  className={`p-3 rounded-xl ${getStatusColor(survey.status)}`}
                >
                  <p className="font-medium">
                    Current Status: {survey.status}
                  </p>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Survey is currently {survey.status.toLowerCase()}</p>
                  <p>• Questions: {survey.questions?.length || 0} assigned</p>
                  <p>• Category: {survey.category_name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}
