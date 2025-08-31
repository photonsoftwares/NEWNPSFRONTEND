import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  BarChart3, 
  Calendar,
  MessageSquare,
  TrendingUp,
  Users
} from 'lucide-react';
import { useAuth } from '../contexts/AuthConext';

export default function SurveyList() {
  // const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
const { getAllSurveys, surveys } = useAuth();
  const saasId = localStorage.getItem("saasId");

useEffect(() => {
  const fetchSurveys = async () => {
    try {
      setLoading(true);
      await getAllSurveys(saasId);
    } catch (error) {
      console.error("Error fetching surveys:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchSurveys(); // ✅ hamesha fetch kare
}, []);

  // const loadSurveys = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch('/v2/surveymgmt/listsurvey/all');
  //     if (response.ok) {
  //       const data = await response.json();
  //       setSurveys(data.data?.surveys || []);
  //     }
  //   } catch (error) {
  //     console.error('Error loading surveys:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

const filteredSurveys = surveys.filter((survey) => {
  const matchesSearch =
    survey.surveyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.surveyCode.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "all" ||
    survey.status.toLowerCase() === statusFilter.toLowerCase();

  return matchesSearch && matchesStatus;
});


  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <TrendingUp className="w-4 h-4" />;
      case 'inactive':
        return <Users className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-6 transition-colors">
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back to Admin
              </Link>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">All Surveys</h1>
                  <p className="text-gray-600">Manage and monitor your surveys</p>
                </div>
              </div>
            </div>
            <Link 
              to="/admin/surveys/new"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
            >
              <Plus className="mr-2 w-5 h-5" />
              New Survey
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search surveys..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Survey Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Surveys</p>
                <p className="text-3xl font-bold text-gray-900">{surveys.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Surveys</p>
                <p className="text-3xl font-bold text-gray-900">
                  {surveys.filter(s => s.status.toLowerCase() === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft Surveys</p>
                <p className="text-3xl font-bold text-gray-900">
                  {surveys.filter(s => s.status.toLowerCase() === 'draft').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Edit className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-gray-900">
                  {surveys.filter(s => {
                    const created = new Date(s.created_at);
                    const now = new Date();
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Surveys Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredSurveys.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No surveys found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Create your first survey to get started'
              }
            </p>
            <Link 
              to="/admin/surveys/new"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Survey
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSurveys.map((survey) => (
              <div key={survey.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white mr-3">
                        {getStatusIcon(survey.status)}
                      </div>
                      <div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(survey.status)}`}>
                          {survey.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {survey.survey_name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Code: <span className="font-mono">{survey.surveyCode}</span>
                    </p>
                    {/* <p className="text-sm text-gray-600 mb-3">
                      Category: <span className="font-medium">{survey.categoryId}</span>
                    </p> */}
                    {survey.surveyName && (
                      <p className="text-sm text-gray-600 line-clamp-2">{survey.surveyName}</p>
                    )}
                      {survey.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{survey.description}</p>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="space-y-2 mb-6">
                    {survey.start_date && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Start: {formatDate(survey.start_date)}
                      </div>
                    )}
                    {survey.end_date && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        End: {formatDate(survey.end_date)}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      Created: {formatDate(survey.created_at)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <Link 
                        to={`/admin/surveys/view/${survey.id}`}
                        className="text-blue-600 hover:text-blue-700 transition-colors p-2 rounded-lg hover:bg-blue-50"
                        title="View Survey"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link 
                        to={`/admin/surveys/edit/${survey.id}`}
                        className="text-gray-600 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-50"
                        title="Edit Survey"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <Link 
                        to={`/admin/analytics?survey=${survey.id}`}
                        className="text-green-600 hover:text-green-700 transition-colors p-2 rounded-lg hover:bg-green-50"
                        title="View Analytics"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Link>
                    </div>
                    <Link 
                      to={`/admin/surveys/view/${survey.id}`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
