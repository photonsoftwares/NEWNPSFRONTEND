import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Star,
  Download,
  Filter,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function Analytics() {
  const [searchParams] = useSearchParams();
  const surveyId = searchParams.get('survey');
  
  const [loading, setLoading] = useState(true);
  const [selectedSurvey, setSelectedSurvey] = useState(surveyId || 'all');
  const [surveys, setSurveys] = useState([]);
  const [dateRange, setDateRange] = useState('7d');

  // Mock data - in real app this would come from API
  const mockStats = {
    totalResponses: 1247,
    averageRating: 8.3,
    npsScore: 42,
    responseRate: 78
  };

  const mockTrendData = [
    { date: '2024-01-01', responses: 45, rating: 8.2, nps: 38 },
    { date: '2024-01-02', responses: 52, rating: 8.4, nps: 41 },
    { date: '2024-01-03', responses: 38, rating: 8.1, nps: 36 },
    { date: '2024-01-04', responses: 67, rating: 8.6, nps: 45 },
    { date: '2024-01-05', responses: 41, rating: 8.3, nps: 39 },
    { date: '2024-01-06', responses: 58, rating: 8.5, nps: 43 },
    { date: '2024-01-07', responses: 49, rating: 8.4, nps: 42 }
  ];

  const mockRatingDistribution = [
    { rating: '1-2', count: 12, percentage: 1.0 },
    { rating: '3-4', count: 34, percentage: 2.7 },
    { rating: '5-6', count: 89, percentage: 7.1 },
    { rating: '7-8', count: 456, percentage: 36.6 },
    { rating: '9-10', count: 656, percentage: 52.6 }
  ];

  const mockNPSBreakdown = [
    { name: 'Promoters', value: 656, color: '#10b981' },
    { name: 'Passives', value: 456, color: '#f59e0b' },
    { name: 'Detractors', value: 135, color: '#ef4444' }
  ];

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedSurvey, dateRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Load surveys for dropdown
      const surveysResponse = await fetch('/v2/surveymgmt/listsurvey/all');
      if (surveysResponse.ok) {
        const surveysData = await surveysResponse.json();
        setSurveys(surveysData.data?.surveys || []);
      }

      // In real app, load actual analytics data here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
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
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                  <p className="text-gray-600">Feedback insights and trends</p>
                </div>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center">
              <Download className="mr-2 w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <div>
              <select 
                value={selectedSurvey} 
                onChange={(e) => setSelectedSurvey(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">All Surveys</option>
                {surveys.map(survey => (
                  <option key={survey.id} value={survey.id}>
                    {survey.survey_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Responses</p>
                    <p className="text-3xl font-bold text-gray-900">{mockStats.totalResponses.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-1">+12% from last period</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Rating</p>
                    <p className="text-3xl font-bold text-gray-900">{mockStats.averageRating}</p>
                    <p className="text-sm text-green-600 mt-1">+0.3 from last period</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">NPS Score</p>
                    <p className="text-3xl font-bold text-gray-900">+{mockStats.npsScore}</p>
                    <p className="text-sm text-green-600 mt-1">+5 from last period</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Response Rate</p>
                    <p className="text-3xl font-bold text-gray-900">{mockStats.responseRate}%</p>
                    <p className="text-sm text-green-600 mt-1">+8% from last period</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Response Trends */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Response Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      stroke="#6b7280"
                    />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      labelFormatter={(value) => formatDate(value)}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="responses" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Rating Distribution */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Rating Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockRatingDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="rating" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* NPS Breakdown */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">NPS Breakdown</h3>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mockNPSBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockNPSBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {mockNPSBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Average Rating Trend */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Average Rating Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      stroke="#6b7280"
                    />
                    <YAxis 
                      domain={[7, 9]} 
                      stroke="#6b7280"
                    />
                    <Tooltip 
                      labelFormatter={(value) => formatDate(value)}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rating" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
