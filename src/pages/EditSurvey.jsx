import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  Save, 
  Edit, 
  MessageSquare,
  Calendar,
  Tag,
  FileText,
  Plus,
  Trash2
} from 'lucide-react';

export default function EditSurvey() {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [surveyData, setSurveyData] = useState({
    survey_name: '',
    survey_code: '',
    category_id: '',
    description: '',
    short_description: '',
    target_concept: '',
    start_date: '',
    end_date: '',
    status: 'Active'
  });

  useEffect(() => {
    loadSurveyData();
    loadCategories();
  }, [surveyId]);

  useEffect(() => {
    if (surveyData.category_id) {
      loadQuestions();
    }
  }, [surveyData.category_id]);

  const loadSurveyData = async () => {
    try {
      setLoading(true);
      
      // Load survey details
      const surveyResponse = await fetch(`/v2/surveymgmt/listsurvey/${surveyId}`);
      if (surveyResponse.ok) {
        const surveyResult = await surveyResponse.json();
        const survey = surveyResult.data;
        
        setSurveyData({
          survey_name: survey.survey_name || '',
          survey_code: survey.survey_code || '',
          category_id: survey.category_id || '',
          description: survey.description || '',
          short_description: survey.short_description || '',
          target_concept: survey.target_concept || '',
          start_date: survey.start_date ? survey.start_date.split('T')[0] : '',
          end_date: survey.end_date ? survey.end_date.split('T')[0] : '',
          status: survey.status || 'Active'
        });
      }

      // Load current questions for this survey
      const questionsResponse = await fetch(`/v2/question/getquestions/${surveyId}`);
      if (questionsResponse.ok) {
        const questionsResult = await questionsResponse.json();
        const currentQuestions = questionsResult.data?.questions || [];
        setSelectedQuestions(currentQuestions.map(q => q.id));
      }
    } catch (error) {
      console.error('Error loading survey data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('/v2/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data?.categories || []);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

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

  const saveSurvey = async () => {
    try {
      setSaving(true);

      // Update survey details
      const updatePayload = {
        survey_name: surveyData.survey_name,
        survey_code: surveyData.survey_code,
        category_id: parseInt(surveyData.category_id),
        description: surveyData.description,
        short_description: surveyData.short_description,
        target_concept: surveyData.target_concept,
        start_date: surveyData.start_date || null,
        end_date: surveyData.end_date || null,
        status: surveyData.status
      };

      const updateResponse = await fetch(`/v2/surveymgmt/updatesurvey/${surveyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update survey');
      }

      // Update question mappings
      // First, remove all existing mappings (in a real app, you'd have a more sophisticated approach)
      // Then add new mappings for selected questions
      if (selectedQuestions.length > 0) {
        const mappingPromises = selectedQuestions.map(questionId =>
          fetch('/v2/surveymgmt/mapquestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              survey_id: parseInt(surveyId),
              question_id: questionId
            })
          })
        );

        await Promise.all(mappingPromises);
      }

      // Success - redirect to survey view
      navigate(`/admin/surveys/view/${surveyId}`);
    } catch (error) {
      console.error('Error updating survey:', error);
      alert('Failed to update survey. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const canSave = () => {
    return surveyData.survey_name && surveyData.survey_code && surveyData.category_id;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
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
              <Link to={`/admin/surveys/view/${surveyId}`} className="flex items-center text-gray-600 hover:text-gray-900 mr-6 transition-colors">
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back to Survey
              </Link>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Edit className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">Edit Survey</h1>
                  <p className="text-gray-600">Modify survey details and questions</p>
                </div>
              </div>
            </div>
            <button
              onClick={saveSurvey}
              disabled={!canSave() || saving}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Survey Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Survey Information</h2>
            </div>

            <div className="space-y-6">
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
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={surveyData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Draft">Draft</option>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={surveyData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={surveyData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
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

              <div>
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
          </div>

          {/* Questions */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <MessageSquare className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Survey Questions</h2>
              </div>
              <span className="text-sm text-gray-600">
                {selectedQuestions.length} questions selected
              </span>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No questions available</p>
                <p className="text-gray-400 text-sm">Please select a category to load questions</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
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
                          Weightage: {question.weightage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Save Button (Mobile) */}
        <div className="mt-8 lg:hidden">
          <button
            onClick={saveSurvey}
            disabled={!canSave() || saving}
            className="w-full bg-green-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {saving ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
