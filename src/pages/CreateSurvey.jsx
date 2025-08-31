import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthConext';
import DataService from "../services/requestApi";
import Swal from 'sweetalert2';

export default function CreateSurvey() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { getCategories, categories } = useAuth();
  const saasId = localStorage.getItem("saasId");

  const [surveyData, setSurveyData] = useState({
    saasId: saasId,
    surveyName: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "ACTIVE",
    createdBy: "admin",
    categoryId: "",
    surveyCode: "",
    shortDescription: "",
    targetConcept: ""
  });

  useEffect(() => {
    getCategories();
  }, []);

  const handleInputChange = (field, value) => {
    setSurveyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const createSurvey = async () => {
    try {
      setLoading(true);
      const payload = {
        ...surveyData,
        categoryId: parseInt(surveyData.categoryId)
      };

      const response = await DataService.createSurvey(payload);
      if (response && response.status === 200) {
        Swal.fire("Success", "Survey created successfully!", "success");
        navigate("/admin/surveys"); // ✅ redirect after success
      } else {
        throw new Error("Failed to create survey");
      }
    } catch (error) {
      console.error("Error creating survey:", error);
      Swal.fire("Failed to create survey. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center">
            <Link to="/admin/surveys" className="flex items-center text-gray-600 hover:text-gray-900 mr-6 transition-colors">
              <ArrowLeft className="mr-2 w-5 h-5" />
              Back to Admin
            </Link>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Create Survey</h1>
                <p className="text-gray-600">Add a new survey</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6">
          
          {/* Survey Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Survey Name *</label>
            <input
              type="text"
              value={surveyData.surveyName}
              onChange={(e) => handleInputChange("surveyName", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter survey name"
            />
          </div>
    <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Survey Code *
                  </label>
                  <input
                    type="text"
                    value={surveyData.surveyCode}
                    onChange={(e) => handleInputChange('surveyCode', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., CSAT2024"
                  />
                </div>
          {/* Survey Code / Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
            <input
              type="text"
              value={surveyData.shortDescription}
              onChange={(e) => handleInputChange("shortDescription", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter short description"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              value={surveyData.categoryId}
              onChange={(e) => handleInputChange("categoryId", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Target Concept */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Concept</label>
            <input
              type="text"
              value={surveyData.targetConcept}
              onChange={(e) => handleInputChange("targetConcept", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Target concept"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="datetime-local"
                value={surveyData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="datetime-local"
                value={surveyData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={surveyData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Detailed description"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              onClick={createSurvey}
              disabled={loading}
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center"
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
          </div>
        </div>
      </div>
    </div>
  );
}
