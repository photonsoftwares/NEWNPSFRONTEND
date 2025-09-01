import { useState } from "react";
import DataService from "../services/requestApi";

export default function CreateUsersModal({ saasId, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    userName: "",
    saasId: saasId,
    password: "",
    role: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

// CreateUsersModal.jsx
const handleSave = async () => {
  try {
    const response = await DataService.createUser(formData);
    if (response && response.status === 200) {
  // CreateUsersModal.jsx
if (response && response.status === 200) {
  onCreated(response.data.data);   // 👈 newUser pass karo
  onClose();
}
  // ✅ argument hata diya
      onClose();
    }
  } catch (err) {
    console.error("Error creating user:", err);
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Create New User</h2>

        <input
          name="userName"
          placeholder="User Name"
          value={formData.userName}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />
     <select
  name="role"
  value={formData.role}
  onChange={handleChange}
  className="w-full border p-2 rounded mb-3"
>
  <option value="">Select Role</option>
  <option value="user">User</option>
  <option value="admin">Admin</option>
</select>


        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
