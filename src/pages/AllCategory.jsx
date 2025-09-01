import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
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
import UpdateQuestionModal from '../modalCom/UpdateQuestionModal';
import CreateCategoryModal from '../modalCom/CreateCategoryModal';
import UpdateCategoryModal from '../modalCom/UpdateCategoryModal';

export default function AllCategory() {

  // const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { getCategories, categories } = useAuth();
  const saasId = localStorage.getItem("saasId");




  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      await getCategories();
      setLoading(false);
    };

    fetchCategories();
  }, []);





 


const filteredQuestions = categories?.filter((question) => {
  const search = searchTerm.toLowerCase();
  return (
    question?.id?.toString().toLowerCase().includes(search) || // convert id to string safely
    question?.categoryName?.toLowerCase().includes(search)    // make case-insensitive
  );
});


 const [selectedQuestion, setSelectedQuestion] = useState(null);
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
      // refresh table
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
              <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-6 transition-colors">
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back to Admin
              </Link>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">Manage Category</h1>
                  <p className="text-gray-600">Create and organize survey categories</p>
                </div>
              </div>
            </div>
         
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
               <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
            >
              <Plus className="mr-2 w-5 h-5" />
              New Category
            </button>
          
            
          </div>
        </div>

        {/* Questions Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Category</h2>
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
                      Category
                    </th>
                  
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredQuestions?.length === 0 ? (
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
                    filteredQuestions?.map((question) => (
                      <tr key={question.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {question.categoryName}
                          </div>
                        </td>
                      
                     
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(question.status)}`}>
                            {question.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                       <button
  onClick={() => {
    setSelectedCategory(question);
    setOpenUpdate(true);
  }}
  className="text-blue-600 hover:text-blue-700 transition-colors"
>
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
  <CreateCategoryModal
    saasId={saasId}
    onClose={() => setShowCreateModal(false)}
    onSave={getCategories} // refresh after save
  />
)}

{openUpdate && selectedCategory && (
  <UpdateCategoryModal
    open={openUpdate}
    handleClose={() => setOpenUpdate(false)}
    category={selectedCategory}
    onUpdated={getCategories} // refresh categories after update
  />
)}
    </div>
  );
}
