import { useState, useEffect } from "react";
import DataService from "../services/requestApi";
import Swal from "sweetalert2";

export default function EditUserModal({ user, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    role: "user",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || "",
        email: user.email || "",
        role: user.role || "user",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await DataService.updateUser(user.userId, formData);
      if (response && response.status === 200) {
        Swal.fire("Success!", "User updated successfully", "success");
        onUpdated({ ...user, ...formData });
        onClose();
      } else {
        Swal.fire("Error!", "Failed to update user", "error");
      }
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire("Error!", "Something went wrong", "error");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>

        <input
          type="text"
          name="userName"
          placeholder="User Name"
          value={formData.userName}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
