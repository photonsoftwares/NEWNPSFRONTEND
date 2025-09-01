import { useState } from "react";
import { X } from "lucide-react";
import DataService from "../services/requestApi";

export default function CreateCategoryModal({ onClose, onSave, saasId }) {
  const [category, setCategory] = useState({
    categoryCode: "",
    categoryName: "",
    description: "",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...category,
        createDate: new Date().toISOString(),
        updateDate: new Date().toISOString(),
      };

      const response = await DataService.createCategory(payload); // 👈 API call
      if (response?.status === 200) {
        onSave(); // refresh category list
        onClose();
      }
    } catch (err) {
      console.error("Error creating category:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Create Category</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            name="categoryCode"
            placeholder="Category Code"
            value={category.categoryCode}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
          <input
            type="text"
            name="categoryName"
            placeholder="Category Name"
            value={category.categoryName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={category.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          />
        
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
