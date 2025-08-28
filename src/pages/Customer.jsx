import { useState } from 'react';
import { 
  CheckCircle,
  ArrowRight,
  Heart,
  ChevronDown,
  User,
  Store
} from 'lucide-react';

export default function Customer() {
  // Static survey details
  const survey = {
    survey_name: "Feedback",
    description: "Based on your shopping experience, how likely are you to recommend us to a friend or colleague?"
  };

  // Static dummy questions with different types
  const questions = [
    { 
      id: 1, 
      question_name: "Based on your shopping experience, how likely are you to recommend us to a friend or colleague?", 
      type: "nps",
      weightage: 1 
    },
    { 
      id: 2, 
      question_name: "What is one thing we could have done differently to improve your experience?", 
      type: "dropdown",
      options: ["Product", "Staff Service", "Checkout Experience", "Store Ambience"],
      subOptions: {
        "Product": ["Size Avilablity", "Fashion Trend", "Fitting & Stitching"],
        "Staff Service": ["Greeting", "Product Knowledge", "Helpfulness"],
        "Checkout Experience": ["Queue Time", "Payment Options", "Receipt Process"],
        "Store Ambience": ["Cleanliness", "Music", "Lighting", "Layout"]
      },
      weightage: 1 
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [ratings, setRatings] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [customerInfo, setCustomerInfo] = useState({ name: '', mobile: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleRatingChange = (questionId, rating) => {
    setRatings(prev => ({ ...prev, [questionId]: rating }));
  };

  const handleDropdownChange = (questionId, category, subOption = null) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questionId]: { category, subOption: subOption || undefined }
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowForm(true);
    }
  };

  const submitFeedback = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
    }, 1000);
  };

  const renderNPSRating = (questionId, currentRating) => (
    <div className="mb-8">
      <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
        {[0,1,2,3,4,5,6,7,8,9,10].map(rating => (
          <button
            key={rating}
            onClick={() => handleRatingChange(questionId, rating)}
            className={`w-12 h-12 rounded-full transition-all duration-200 flex items-center justify-center text-lg font-bold border-2 ${
              rating === currentRating
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

  const renderDropdown = (questionId) => {
    const question = questions.find(q => q.id === questionId);
    const selected = selectedOptions[questionId];
    
    if (!question || !question.options) return null;
    
    return (
      <div className="mb-8 space-y-4">
        {question.options.map((option) => (
          <div key={option} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => {
                if (selected?.category === option && !selected.subOption) {
                  setSelectedOptions(prev => {
                    const newState = { ...prev };
                    delete newState[questionId];
                    return newState;
                  });
                } else {
                  handleDropdownChange(questionId, option);
                }
              }}
              className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
                selected?.category === option 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className="font-medium text-gray-900">{option}</span>
              <ChevronDown 
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  selected?.category === option ? 'rotate-180' : ''
                }`} 
              />
            </button>
            
            {selected?.category === option && question.subOptions?.[option] && (
              <div className="bg-gray-50 border-t border-gray-200">
                {question.subOptions[option].map(subOption => (
                  <button
                    key={subOption}
                    onClick={() => handleDropdownChange(questionId, option, subOption)}
                    className={`w-full text-left p-3 pl-8 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                      selected?.subOption === subOption 
                        ? 'bg-blue-100 text-blue-800 font-medium' 
                        : 'text-gray-700'
                    }`}
                  >
                    {subOption}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
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

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="font-medium">Brand Name</span>
            </div>
            <User className="w-6 h-6" />
          </div>
          <div className="text-center mt-4">
            <h1 className="text-lg font-semibold">
              {survey.survey_name}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showForm ? (
            <div>
              <div className="mb-8">
                <p className="text-gray-800 text-base leading-relaxed">
                  {currentQuestionData?.question_name}
                </p>
              </div>

              {currentQuestionData?.type === 'nps' && 
                renderNPSRating(currentQuestionData.id, ratings[currentQuestionData.id])
              }

              {currentQuestionData?.type === 'dropdown' && 
                renderDropdown(currentQuestionData.id)
              }

              <div className="flex justify-end mt-8">
                <button
                  onClick={nextQuestion}
                  disabled={
                    (currentQuestionData?.type === 'nps' && !ratings[currentQuestionData.id]) ||
                    (currentQuestionData?.type === 'dropdown' && !selectedOptions[currentQuestionData.id])
                  }
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
                    placeholder="+91 9876543210"
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
                  onClick={submitFeedback}
                  disabled={(!customerInfo.name || !customerInfo.mobile) && !customerInfo.email || submitting}
                  className="flex items-center bg-transparent text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50"
                >
                  {submitting ? "Processing..." : <>Proceed <ArrowRight className="ml-2 w-5 h-5" /></>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
