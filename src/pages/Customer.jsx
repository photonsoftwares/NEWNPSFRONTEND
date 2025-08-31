import { useEffect, useState, useMemo } from 'react';
import {
  CheckCircle,
  ArrowRight,
  Heart,
  ChevronDown,
  User,
  Store
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthConext';
import RenderNPSRating from '../modalCom/RenderNPSRating';
import RenderDropdown from '../modalCom/RenderDropdown';

export default function Customer() {
  const { surveyId } = useParams();

  const {
    getSurveyById,
    getQuestions,
    getSubQuestions,
    submitSurveyAnswers,
    submitFeedback,
    surveyDetails,
    getQuestionbyLevel ,
    questions
  } = useAuth();

  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Static flow: Step 1 = NPS, Step 2 = dropdown (expand/collapse list from API)
  const steps = useMemo(
    () => [
      { id: 1, type: 'nps', title: 'How likely are you to recommend us?' },
      { id: 2, type: 'dropdown', title: 'Tell us what we can improve' }
    ],
    []
  );

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const currentStep = steps[currentStepIdx];

  // NPS ratings (allow 0)
  const [ratings, setRatings] = useState({}); // { [stepId]: number }
  const handleRatingChange = (stepId, rating) => {
    setRatings(prev => ({ ...prev, [stepId]: rating }));
  };

  // Dropdown state
  const [expandedQuestion, setExpandedQuestion] = useState(null); // questionId
  const [selectedSub, setSelectedSub] = useState({}); // { [questionId]: subQuestionId }
  // Also keep a normalized selection payload for API
  const [selectedOptions, setSelectedOptions] = useState({}); // { [questionId]: {questionId, subQuestionId} }

  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', mobile: '', email: '' });

  // ---------- Load survey + questions + subQuestions ----------
// ---------- Load survey + questions + subQuestions ----------
useEffect(() => {
  if (!surveyId) return;
  getSurveyById(surveyId);
  // 👇 dependency array should ONLY have surveyId
}, [surveyId]);

 useEffect(() => {
  if (surveyDetails?.saasId) {
    getQuestionbyLevel(surveyDetails?.saasId, ratings[1]);
  }
}, [surveyDetails?.saasId, ratings[1]]);

  // ---------- UI helpers ----------


  // Handle sub-question selection
const handleSubSelect = (qId, subId, qName, subText) => {
  setSelectedSub(prev => ({
    ...prev,
    [qId]: {
      questionId: qId,
      questionName: qName,       // ✅ question text
      subQuestionId: subId,
      subQuestionName: subText   // ✅ sub-question text
    }
  }));

  setSelectedOptions(prev => ({
    ...prev,
    [qId]: {
      questionId: qId,
      questionName: qName,
      subQuestionId: subId,
      subQuestionName: subText
    }
  }));
};


  // Expand/collapse dropdown renderer (uses API-loaded survey.questions)

  // ---------- Validation + Next flow ----------
 // ---------- Validation + Next flow ----------
const isNextDisabled = useMemo(() => {
  if (currentStep?.type === 'nps') {
    return ratings[currentStep.id] === undefined;
  }
  if (currentStep?.type === 'dropdown') {
    return Object.keys(selectedOptions).length === 0;
  }
  return false;
}, [currentStep, ratings, selectedOptions]);

const nextStep = async () => {
  try {
    if (currentStep?.type === 'nps') {
      if (typeof submitSurveyAnswers === 'function') {
        await submitSurveyAnswers({
          surveyId,
          type: 'nps',
          rating: ratings[currentStep.id]
        });
      }
    } else if (currentStep?.type === 'dropdown') {
      if (typeof submitSurveyAnswers === 'function') {
        const answers = Object.values(selectedOptions);
        await submitSurveyAnswers({
          surveyId,
          type: 'subSelections',
          answers
        });
      }
    }
  } catch (e) {
    console.error('Failed to submit step answers (continuing flow):', e);
  }

  // Flow control
  if (currentStepIdx < steps.length - 1) {
    setCurrentStepIdx(i => i + 1);
  } else {
    // Agar rating < 7 toh customer info lena hai
    if ((ratings[1] ?? 0) < 7) {
      setShowForm(true);
    } else {
      // Rating >= 7 → direct submit
      handleSubmitFeedback();
    }
  }
};

  const saasId = localStorage.getItem("saasId");

  // ---------- Final submit (customer details) ----------
const handleSubmitFeedback = async () => {
  if (!surveyId) {
    Swal.fire("Error", "Survey not loaded properly", "error");
    return;
  }

  const feedbackData = {
    saasId: surveyDetails?.saasId || saasId,
    message: "Great service, very satisfied!", // TODO: Textarea se value lo
    surveyId: Number(surveyId),
    surveyName: surveyDetails?.surveyName || "",
    categoryId: surveyDetails?.categoryId || "",
    categoryName: surveyDetails?.categoryName || "",
    storeName: surveyDetails?.storeName || "",
    customerName: customerInfo.name,
    customerMobile: customerInfo.mobile,
    customerEmail: customerInfo.email,
    question: selectedSub?.[expandedQuestion]?.questionName || "",
    subQuestion: selectedSub?.[expandedQuestion]?.subQuestionName || "",
    feedbackDate: new Date().toISOString(),
    ratingLevel: ratings[1] ?? 0,
  };

  try {
    setSubmitting(true);
    const res = await submitFeedback(feedbackData);

    if (res?.status === true) {
      setSubmitted(true); // ✅ show success screen
    } else {
      Swal.fire("Error", res?.message || "Failed to submit feedback", "error");
    }
  } catch (err) {
    Swal.fire("Error", "Something went wrong", "error");
  } finally {
    setSubmitting(false);
  }
};




  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-600 text-lg mb-6">
            Your feedback has been submitted successfully.
          </p>
          <Heart className="w-8 h-8 text-red-500 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <div className="py-2 w-full flex justify-center items-center h-[65px] border-b border-accent-600 bg-accent-800">
              <img
                src="/src/assets/navlogo.png"
                alt="Logo"
                className="h-10 w-auto object-contain rounded-xl"
              />
            </div>
            </div>
            <User className="w-6 h-6" />
          </div>
          <div className="text-center mt-4">
            <h1 className="text-lg font-semibold">
              {surveyDetails?.surveyName || 'Customer Satisfaction Survey'}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showForm ? (
            <div>
              {!!surveyDetails?.description && (
                <div className="mb-8">
                  <p className="text-gray-800 text-base leading-relaxed">
                    {surveyDetails.description}
                  </p>
                </div>
              )}

              {/* Step title (optional) */}
              <h3 className="text-base font-semibold text-gray-800 mb-4">
                {currentStep?.title}
              </h3>

              {/* Step Body */}
              {currentStep?.type === "nps" && (
                <RenderNPSRating
                  stepId={currentStep.id}
                  currentRating={ratings[currentStep.id]}
                  onRatingChange={handleRatingChange}
                />
              )}

              {currentStep?.type === "dropdown" && (
                <RenderDropdown
                  surveyObj={questions}
                  expandedQuestion={expandedQuestion}
                  setExpandedQuestion={setExpandedQuestion}
                  selectedSub={selectedSub}
                  handleSubSelect={handleSubSelect}
                />
              )}

              <div className="flex justify-end mt-8">
                  {currentStepIdx > 0 && (
    <button
      onClick={() => setCurrentStepIdx(i => i - 1)}
      className="flex items-center bg-transparent text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50"
    >
      ← Previous
    </button>
  )}
                <button
                  onClick={nextStep}
                  disabled={isNextDisabled}
                  className="flex items-center bg-transparent text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-600">(Store Name)</p>
              </div>

              <h2 className="text-xl font-bold mb-6 text-gray-900">Customer Details</h2>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Jeel Patel"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Mobile</label>
                  <input
                    type="tel"
                    value={customerInfo.mobile}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, mobile: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="9876543210"
                  />
                </div>

                <div className="text-center text-gray-400 text-sm my-4">
                  <div className="flex items-center">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4">Or</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="xyz123@gmail.com"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSubmitFeedback}
                  disabled={((!customerInfo.name || !customerInfo.mobile) && !customerInfo.email) || submitting}
                  className="flex items-center bg-transparent text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50"
                >
                  {submitting ? 'Processing...' : <>Proceed <ArrowRight className="ml-2 w-5 h-5" /></>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
