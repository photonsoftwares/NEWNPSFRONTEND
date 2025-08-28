import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  MessageSquare,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthConext';
import DataService from "../services/requestApi";
import Swal from 'sweetalert2';
import CreateQuestionModal from '../modalCom/CreateQuestionModal';

export default function QuestionManager() {
  const [questions, setQuestions] = useState([]);
  // const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);

const {getCategories,categories} = useAuth();
const [newQuestion, setNewQuestion] = useState({
  question: '',
      saasId: "6",
  question_code: '',
  category_id: 0,
  surveyId: "",
  weightage: 1.0,
  target_concept: '',
  user_category: '',
  language: 'EN',
  type: 'text',        // NEW field
  level: 5,    
  status: "Active",        // for rating
  options: ''          // comma separated string for multi-choice
});


  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      loadQuestions();
    }
  }, [categories, selectedCategory]);



  const loadQuestions = async () => {
    try {
      setLoading(true);
      // Load questions from all categories or specific category
      // const categoryId = selectedCategory || categories[0]?.id;
      // if (!categoryId) return;

      // const response = await fetch(`/v2/surveymgmt/listquestions/${categoryId}/all`);
       const response = await DataService.getQuestion("6");
      if (response && response.status === 200 && response.data.status) {
      // set data from API
      setQuestions(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async () => {
    try {
      if (!newQuestion.question || !newQuestion.question_code || !newQuestion.category_id) {
        return;
      }

      // const response = await fetch('/v2/surveymgmt/createquestions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...newQuestion,
      //     created_by: 'admin'
      //   })
      // });
  const response = await DataService.SubQuestion({
      ...newQuestion,
      created_by: "admin",
    });
    if (response && response.status === 200) {
        setShowCreateModal(false);
        setNewQuestion({
          question_name: '',
          question_code: '',
          category_id: 0,
          weightage: 1.0,
          target_concept: '',
          user_category: '',
          language: 'EN'
        });
        loadQuestions();
      }
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  const filteredQuestions = questions.filter(question => 
    question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.questionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
const handleDelete = async (id) => {
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const response = await DataService.deleteQuestion(id);

      if (response && response.status === 200) {
        Swal.fire("Deleted!", "Your question has been deleted.", "success");
        loadQuestions(); // refresh table
      } else {
        Swal.fire("Failed!", "Something went wrong.", "error");
      }
    }
  } catch (error) {
    console.error("Error deleting question:", error);
    Swal.fire("Error!", "Unable to delete the question.", "error");
  }
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
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">Manage Questions</h1>
                  <p className="text-gray-600">Create and organize survey questions</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
            >
              <Plus className="mr-2 w-5 h-5" />
              New Question
            </button>
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
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(parseInt(e.target.value))}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value={0}>All Categories</option>
                {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    ))}
              </select>
            </div>
          </div>
        </div>

        {/* Questions Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Question
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Survey Id
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weightage
                    </th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredQuestions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-lg font-medium">No questions found</p>
                        <p className="text-sm">Create your first question to get started</p>
                        <button 
                          onClick={() => setShowCreateModal(true)}
                          className="inline-flex items-center mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create Question
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredQuestions.map((question) => (
                      <tr key={question.questionId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {question.question}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600 font-mono">
                            {question.level}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">
                            {question.surveyId}
                          </span>
                        </td>
                        {/* <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {question.weightage}
                          </span>
                        </td> */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(question.status)}`}>
                            {question.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <button className="text-blue-600 hover:text-blue-700 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button     onClick={() => handleDelete(question.questionId)} className="text-red-600 hover:text-red-700 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Question Modal */}
    {showCreateModal && (
  <CreateQuestionModal
    newQuestion={newQuestion}
    setNewQuestion={setNewQuestion}
    categories={categories}
    onClose={() => setShowCreateModal(false)}
    onSave={handleCreateQuestion}
  />
)}

    </div>
  );
}
