// src/modalCom/UpdateCategoryModal.jsx
import { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import { Save, X } from "lucide-react";
import DataService from "../services/requestApi";
import Swal from "sweetalert2";

export default function UpdateCategoryModal({ open, handleClose, category, onUpdated }) {
  const [formData, setFormData] = useState({
    id: 0,
    saasId: "",
    categoryCode: "",
    categoryName: "",
    description: "",
    status: "Active",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        id: category.id,
        saasId: category.saasId,
        categoryCode: category.categoryCode,
        categoryName: category.categoryName,
        description: category.description,
        status: category.status,
      });
    }
  }, [category]);

  const handleSave = async () => {
    try {
      const response = await DataService.updateCategory(formData.id, formData);
      if (response && response.status === 200) {
        Swal.fire("Updated!", "Category updated successfully.", "success");
        onUpdated(); // refresh list
        handleClose();
      } else {
        Swal.fire("Failed!", "Something went wrong.", "error");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      Swal.fire("Error!", "Unable to update the category.", "error");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Edit Category</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category Name</label>
            <input
              type="text"
              value={formData.categoryName}
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </button>
        </div>
      </div>
    </Dialog>
  );
}
