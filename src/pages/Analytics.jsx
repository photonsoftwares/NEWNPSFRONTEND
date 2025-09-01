import { useState, useEffect, use } from 'react';
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
import { useAuth } from '../contexts/AuthConext';

export default function Analytics() {
    const [loading, setLoading] = useState(true);
  const [selectedSurvey, setSelectedSurvey] = useState("DAY"); // 👈 default daily

  // component mount hote hi "daily" feedback call karega
   useEffect(() => {
    (async () => {
      await getAllfeedbackCount("DAY");
    })();
  }, []);

  const handleSurveyChange = async (e) => {
    const value = e.target.value;
    setSelectedSurvey(value);

    if (value === "DAY") {
      await getAllfeedbackCount("DAY");
    } else if (value === "WEEK") {
      await getAllfeedbackCount("WEEK");
    } else if (value === "MONTH") {
      await getAllfeedbackCount("MONTH");
    } else if (value === "YEAR") {
      await getAllfeedbackCount("YEAR");
    } else {
      // agar "ALL" hai toh default DAY call karenge
      await getAllfeedbackCount("DAY");
    }
  };
  // Mock data - in real app this would come from API
  const {  getFeedbackbydate, feedbackByDate ,
        getAllfeedbackCount,feedbackweekly
  } = useAuth();
  const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};
  const [fromDate, setFromDate] = useState(getTodayDate());
  const [toDate, setToDate] = useState(getTodayDate());
useEffect(() => {
  if (fromDate && toDate) {
    const fetchData = async () => {
      try {
        setLoading(true);
        await getFeedbackbydate(fromDate, toDate);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }
}, [fromDate, toDate]);

  console.log(feedbackweekly, "feedbackweekly");





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
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                  <p className="text-gray-600">Feedback insights and trends</p>
                </div>
              </div>
            </div>
            {/* <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center">
              <Download className="mr-2 w-4 h-4" />
              Export Report
            </button> */}
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
      onChange={handleSurveyChange}
      className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    >
      <option value="all">All Feedback</option>
      <option value="DAY">Daily Feedback</option>
      <option value="WEEK">Weekly Feedback</option>
      <option value="MONTH">Monthly Feedback</option>
      <option value="YEAR">Yearly Feedback</option>

    </select>
</div>


            {/* <div className="flex items-center space-x-2">
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
            </div> */}

  {/* From Date */}
    <div className="flex flex-col mb-6">
      <label className="text-sm text-gray-600 mb-1">From Date:</label>
      <input
        type="date"
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        onChange={(e) => setFromDate(e.target.value || null)}
      />
    </div>

    {/* To Date */}
    <div className="flex flex-col mb-6">
      <label className="text-sm text-gray-600 mb-1">To Date:</label>
      <input
        type="date"
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        onChange={(e) => setToDate(e.target.value || null)}
      />
    </div>
          </div>
        </div>

      
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Responses</p>
                    <p className="text-3xl font-bold text-gray-900">{feedbackweekly?.total.toLocaleString()}</p>
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
                    <p className="text-3xl font-bold text-gray-900">{feedbackweekly?.detractor}</p>
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
                    <p className="text-3xl font-bold text-gray-900">+{feedbackweekly?.promotor}</p>
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
                    <p className="text-3xl font-bold text-gray-900">{feedbackweekly?.passive}%</p>
                    <p className="text-sm text-green-600 mt-1">+8% from last period</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

         {/* Feedback By Date Table */}
{fromDate && toDate && (
  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mt-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Feedback by Date</h2>

    {loading ? (
      // 👇 Loading spinner
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    ) : feedbackByDate && feedbackByDate.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Question</th>
              <th className="px-4 py-3">Sub Question</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbackByDate.map((fb) => (
              <tr key={fb.id} className="hover:bg-gray-50 border-b">
                <td className="px-4 py-3">{fb.id}</td>
                <td className="px-4 py-3">{fb.message || "-"}</td>
                <td className="px-4 py-3">{fb.question || "-"}</td>
                <td className="px-4 py-3">{fb.subQuestion || "-"}</td>
                <td className="px-4 py-3 font-semibold">{fb.ratingLevel}</td>
                <td className="px-4 py-3">
                  {new Date(fb.feedbackDate).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      // 👇 No data found
      <div className="text-center text-gray-500 py-10">
        No feedback available for the selected date range.
      </div>
    )}
  </div>
)}

          </>
        
      </div>
    </div>
  );
}
