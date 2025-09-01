import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Plus,
  Search,
  Edit,
  Trash2,
  MessageSquare,
} from "lucide-react";
import Swal from "sweetalert2";
import DataService from "../services/requestApi";
import CreateUsersModal from "../modalCom/CreateUsersModal";
import { TextField } from "@mui/material";
import EditUserModal from "../modalCom/EditUsersModal";

export default function ManageUser() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const saasId = localStorage.getItem("saasId");

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await DataService.getUsers(currentPage, pageSize, saasId);
      if (response && response.status === 200) {
        const { data } = response;
        setUsers(data?.data || []);
    setTotalPages(Math.ceil((data?.count || 0) / pageSize));

      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
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
        const response = await DataService.deleteUser(id);
        if (response && response.status === 200) {
          Swal.fire("Deleted!", "User has been deleted.", "success");
          fetchUsers();
        } else {
          Swal.fire("Failed!", "Something went wrong.", "error");
        }
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      Swal.fire("Error!", "Unable to delete the user.", "error");
    }
  };

const filteredUsers = users
  ?.filter((user) => user.status === "Active") // sirf Active users
  ?.filter(
    (user) =>
      user?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

// ManageUser.jsx
const handleCreated = (newUser) => {
  setUsers((prev) => [newUser, ...prev]); 
  setCurrentPage(1);
};

const [showEditModal, setShowEditModal] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-6 transition-colors"
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              Back to Admin
            </Link>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Manage Users
                </h1>
                <p className="text-gray-600">Create and organize survey users</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => {setShowCreateModal(true)}}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
          >
            <Plus className="mr-2 w-5 h-5" />
            New User
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
 <form autoComplete="off">
  <TextField
    type="text"
    placeholder="Search Users..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    name="searchUsers123"       // 👈 unique name
    id="search-users-123"       // 👈 unique id
    autoComplete="new-password" // 👈 strongest way to kill autofill
    inputProps={{
      autoComplete: "new-password",
    }}
    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
  />
</form>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
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
                      userId
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.userId}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">{user.userId}</td>
                        <td className="px-6 py-4">{user.userName}</td>
                        <td className="px-6 py-4">{user.role}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                                <button
      onClick={() => {
        setSelectedUser(user);
        setShowEditModal(true);
      }}
      className="text-blue-600 hover:text-blue-700 transition-colors"
    >
      <Edit className="w-4 h-4" />
    </button>
                            <button
                              onClick={() => handleDelete(user.userId)}
                              className="text-red-600 hover:text-red-700 transition-colors"
                            >
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

          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-4 border-t">
            <div>
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUsersModal
          saasId={saasId}
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCreated}
        />
      )}
      {showEditModal && selectedUser && (
  <EditUserModal
    user={selectedUser}
    onClose={() => setShowEditModal(false)}
    onUpdated={(updatedUser) => {
      setUsers((prev) =>
        prev.map((u) => (u.userId === updatedUser.userId ? updatedUser : u))
      );
    }}
  />
)}

    </div>
  );
}
