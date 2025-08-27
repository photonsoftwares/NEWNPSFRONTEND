import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Settings, 
  Plus, 
  Eye,
  Edit,
  TrendingUp,
  Calendar,
  Star,
  ArrowRight
} from 'lucide-react';

export default function Admin() {
  const [stats, setStats] = useState({
    totalSurveys: 0,
    activeSurveys: 0,
    totalResponses: 0,
    averageNPS: 0
  });
  const [recentSurveys, setRecentSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load surveys
      const surveysResponse = await fetch('/v2/surveymgmt/listsurvey/all');
      if (surveysResponse.ok) {
        const surveysData = await surveysResponse.json();
        const surveys = surveysData.data?.surveys || [];
        
        setStats({
          totalSurveys: surveys.length,
          activeSurveys: surveys.filter(s => s.status.toLowerCase() === 'active').length,
          totalResponses: 1247, // Mock data - would come from feedback API
          averageNPS: 42 // Mock data - would be calculated from feedback
        });

        // Get recent surveys (last 5)
        setRecentSurveys(surveys.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage surveys, questions, and analyze feedback</p>
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Surveys</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSurveys}</p>
                <p className="text-sm text-green-600 mt-1">+12% from last month</p>
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
                <p className="text-3xl font-bold text-gray-900">{stats.activeSurveys}</p>
                <p className="text-sm text-green-600 mt-1">Currently running</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Responses</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalResponses.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">+8% from last week</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average NPS</p>
                <p className="text-3xl font-bold text-gray-900">+{stats.averageNPS}</p>
                <p className="text-sm text-green-600 mt-1">Excellent score</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link 
            to="/admin/surveys/new"
            className="group bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-blue-200"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Survey</h3>
            <p className="text-gray-600 text-sm">Build new customer feedback surveys</p>
          </Link>

          <Link 
            to="/admin/surveys"
            className="group bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-green-200"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Surveys</h3>
            <p className="text-gray-600 text-sm">View and edit existing surveys</p>
          </Link>

          <Link 
            to="/admin/questions"
            className="group bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-purple-200"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Question Bank</h3>
            <p className="text-gray-600 text-sm">Manage survey questions and categories</p>
          </Link>

          <Link 
            to="/admin/analytics"
            className="group bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-orange-200"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600 text-sm">View feedback reports and insights</p>
          </Link>
        </div>

        {/* Recent Surveys */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Surveys</h2>
              <Link 
                to="/admin/surveys"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center transition-colors"
              >
                View All
                <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : recentSurveys.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No surveys found</p>
              <p className="text-gray-400 text-sm mb-6">Create your first survey to get started</p>
              <Link 
                to="/admin/surveys/new"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Survey
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Survey
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentSurveys.map((survey) => (
                    <tr key={survey.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{survey.survey_name}</div>
                          <div className="text-sm text-gray-500">{survey.survey_code}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(survey.status)}`}>
                          {survey.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(survey.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <Link 
                            to={`/admin/surveys/view/${survey.id}`}
                            className="text-blue-600 hover:text-blue-700 transition-colors"
                            title="View Survey"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link 
                            to={`/admin/surveys/edit/${survey.id}`}
                            className="text-gray-600 hover:text-gray-700 transition-colors"
                            title="Edit Survey"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <Link 
                            to={`/admin/analytics?survey=${survey.id}`}
                            className="text-green-600 hover:text-green-700 transition-colors"
                            title="View Analytics"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
