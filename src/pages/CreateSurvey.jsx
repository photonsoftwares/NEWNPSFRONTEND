import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Eye,
  MessageSquare,
  Calendar,
  Tag,
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthConext';

export default function CreateSurvey() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [step, setStep] = useState(1); // 1: Survey Info, 2: Questions, 3: Review

  const [surveyData, setSurveyData] = useState({
    survey_name: '',
    survey_code: '',
    category_id: '',
    description: '',
    short_description: '',
    target_concept: '',
    survey_startdate: '',
    survey_enddate: ''
  });
const { getCategories ,categories,getQuestions,} = useAuth();
  useEffect(() => {
    // loadCategories();
    getQuestions();
    getCategories();
  }, []);

  useEffect(() => {
    if (surveyData.category_id) {
      loadQuestions();
    }
  }, [surveyData.category_id]);

  // const loadCategories = async () => {
  //   try {
  //     const response = await fetch('/v2/categories');
  //     if (response.ok) {
  //       const data = await response.json();
  //       setCategories(data.data?.categories || []);
  //     }
  //   } catch (error) {
  //     console.error('Error loading categories:', error);
  //   }
  // };

  const loadQuestions = async () => {
    try {
      const response = await fetch(`/v2/surveymgmt/listquestions/${surveyData.category_id}/all`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.data?.questions || []);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setSurveyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleQuestion = (questionId) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const createSurvey = async () => {
    try {
      setLoading(true);

      // Step 1: Create survey
      const surveyPayload = {
        ...surveyData,
        category_id: parseInt(surveyData.category_id),
        created_by: 'admin'
      };

      const surveyResponse = await fetch('/v2/surveymgmt/createsurvey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyPayload)
      });

      if (!surveyResponse.ok) {
        throw new Error('Failed to create survey');
      }

      const surveyResult = await surveyResponse.json();
      const surveyId = surveyResult.data?.survey_id;

      if (!surveyId) {
        throw new Error('Survey ID not returned');
      }

      // Step 2: Map selected questions to survey
      if (selectedQuestions.length > 0) {
        const mappingPromises = selectedQuestions.map(questionId =>
          fetch('/v2/surveymgmt/mapquestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              survey_id: surveyId,
              question_id: questionId
            })
          })
        );

        await Promise.all(mappingPromises);
      }

      // Success - redirect to survey view
      navigate(`/admin/surveys/view/${surveyId}`);
    } catch (error) {
      console.error('Error creating survey:', error);
      alert('Failed to create survey. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceedToStep2 = () => {
    return surveyData.survey_name && surveyData.survey_code && surveyData.category_id;
  };

  const canProceedToStep3 = () => {
    return selectedQuestions.length > 0;
  };

  const canSubmit = () => {
    return canProceedToStep2() && canProceedToStep3();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/admin" className="flex items-center text-gray-600 hover:text-gray-900 mr-6 transition-colors">
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back to Admin
              </Link>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">Create New Survey</h1>
                  <p className="text-gray-600">Build a customer feedback survey</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= stepNum 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div 
                    className={`w-16 h-1 mx-2 ${
                      step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">
                Step {step}: {step === 1 ? 'Survey Information' : step === 2 ? 'Select Questions' : 'Review & Create'}
              </p>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          {step === 1 && (
            <div className="p-8">
              <div className="flex items-center mb-6">
                <FileText className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Survey Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Survey Name *
                  </label>
                  <input
                    type="text"
                    value={surveyData.survey_name}
                    onChange={(e) => handleInputChange('survey_name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter survey name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Survey Code *
                  </label>
                  <input
                    type="text"
                    value={surveyData.survey_code}
                    onChange={(e) => handleInputChange('survey_code', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., CSAT2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={surveyData.category_id}
                    onChange={(e) => handleInputChange('category_id', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Concept
                  </label>
                  <input
                    type="text"
                    value={surveyData.target_concept}
                    onChange={(e) => handleInputChange('target_concept', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Target concept or theme"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={surveyData.survey_startdate}
                    onChange={(e) => handleInputChange('survey_startdate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={surveyData.survey_enddate}
                    onChange={(e) => handleInputChange('survey_enddate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={surveyData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Detailed description of the survey"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <input
                  type="text"
                  value={surveyData.short_description}
                  onChange={(e) => handleInputChange('short_description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Brief description for display"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <MessageSquare className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Select Questions</h2>
                </div>
                <span className="text-sm text-gray-600">
                  {selectedQuestions.length} questions selected
                </span>
              </div>

              {questions.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No questions available for the selected category</p>
                  <p className="text-gray-400 text-sm">Please select a category first or create questions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question) => (
                    <div
                      key={question.id}
                      className={`p-4 border rounded-xl cursor-pointer transition-all ${
                        selectedQuestions.includes(question.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleQuestion(question.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              checked={selectedQuestions.includes(question.id)}
                              onChange={() => toggleQuestion(question.id)}
                              className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-600">
                              {question.question_code}
                            </span>
                          </div>
                          <h4 className="text-lg font-medium text-gray-900 mb-1">
                            {question.question_name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Weightage: {question.weightage} | Category: {question.category_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="p-8">
              <div className="flex items-center mb-6">
                <Eye className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Review & Create</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Survey Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Name:</span>
                      <p className="text-gray-900">{surveyData.survey_name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Code:</span>
                      <p className="text-gray-900">{surveyData.survey_code}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Category:</span>
                      <p className="text-gray-900">
                        {categories.find(c => c.id === parseInt(surveyData.category_id))?.category_name}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Questions:</span>
                      <p className="text-gray-900">{selectedQuestions.length} selected</p>
                    </div>
                  </div>
                  {surveyData.description && (
                    <div className="mt-4">
                      <span className="text-sm font-medium text-gray-600">Description:</span>
                      <p className="text-gray-900">{surveyData.description}</p>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Questions</h3>
                  <div className="space-y-3">
                    {selectedQuestions.map((questionId, index) => {
                      const question = questions.find(q => q.id === questionId);
                      return (
                        <div key={questionId} className="flex items-start">
                          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-1">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900">{question?.question_name}</p>
                            <p className="text-sm text-gray-600">{question?.question_code}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="px-8 py-6 border-t border-gray-200 flex justify-between">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            {step < 3 ? (
              <button
                onClick={nextStep}
                disabled={(step === 1 && !canProceedToStep2()) || (step === 2 && !canProceedToStep3())}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={createSurvey}
                disabled={!canSubmit() || loading}
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 w-5 h-5" />
                    Create Survey
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
