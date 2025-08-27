import { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Heart
} from 'lucide-react';

export default function Customer() {
  // Static survey details
  const survey = {
    survey_name: "Customer NPS Feedback",
    description: "We value your opinion, please rate your experience."
  };

  // Static dummy questions
  const questions = [
    { id: 1, question_name: "How satisfied are you with our service?", weightage: 1 },
    { id: 2, question_name: "How likely are you to recommend us to a friend?", weightage: 1 },
    { id: 3, question_name: "How was your overall experience?", weightage: 1 },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [ratings, setRatings] = useState({});
  const [remarks, setRemarks] = useState({});
  const [customerInfo, setCustomerInfo] = useState({ name: '', mobile: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleRatingChange = (questionId, rating) => {
    setRatings(prev => ({ ...prev, [questionId]: rating }));
  };

  const handleRemarksChange = (questionId, value) => {
    setRemarks(prev => ({ ...prev, [questionId]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowForm(true);
    }
  };

  const prevQuestion = () => {
    if (showForm) {
      setShowForm(false);
    } else if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitFeedback = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
    }, 1000);
  };

  const renderStars = (questionId, currentRating) => (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {[1,2,3,4,5,6,7,8,9,10].map(rating => (
        <button
          key={rating}
          onClick={() => handleRatingChange(questionId, rating)}
          className={`w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center text-sm font-bold ${
            rating <= currentRating
              ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white scale-110 shadow-lg'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          {rating}
        </button>
      ))}
    </div>
  );

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {survey.survey_name}
          </h1>
          <p className="text-gray-600 text-lg">
            {survey.description}
          </p>
        </div>

        {/* Progress */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-medium text-gray-600">
              {showForm ? questions.length : currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${showForm ? 100 : ((currentQuestion + 1) / questions.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>

        {/* Question / Form */}
        <div className="max-w-2xl mx-auto">
          {!showForm ? (
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {questions[currentQuestion]?.question_name}
                </h2>
                <p className="text-gray-600">
                  Please rate from 1 (poor) to 10 (excellent)
                </p>
              </div>

              {renderStars(questions[currentQuestion]?.id, ratings[questions[currentQuestion]?.id] || 0)}

              <div className="mb-8">
                <textarea
                  value={remarks[questions[currentQuestion]?.id] || ''}
                  onChange={(e) => handleRemarksChange(questions[currentQuestion]?.id, e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Additional comments (optional)"
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                >
                  <ArrowLeft className="mr-2 w-5 h-5" /> Previous
                </button>
                <button
                  onClick={nextQuestion}
                  disabled={!ratings[questions[currentQuestion]?.id]}
                  className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                >
                  {currentQuestion === questions.length - 1 ? 'Continue' : 'Next'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <h2 className="text-2xl font-bold mb-4">Almost Done!</h2>
              <p className="text-gray-600 mb-6">Please provide your contact information.</p>

              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4"
                placeholder="Your Name *"
                required
              />

              <input
                type="tel"
                value={customerInfo.mobile}
                onChange={(e) => setCustomerInfo({ ...customerInfo, mobile: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4"
                placeholder="Mobile Number *"
                required
              />

              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4"
                placeholder="Email (Optional)"
              />

              <textarea
                value={remarks.overall || ''}
                onChange={(e) => handleRemarksChange('overall', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-6"
                placeholder="Overall comments (optional)"
              />

              <div className="flex justify-between">
                <button
                  onClick={prevQuestion}
                  className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="mr-2 w-5 h-5" /> Back
                </button>
                <button
                  onClick={submitFeedback}
                  disabled={!customerInfo.name || !customerInfo.mobile || submitting}
                  className="flex items-center bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : <><Send className="mr-2 w-5 h-5" /> Submit</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
