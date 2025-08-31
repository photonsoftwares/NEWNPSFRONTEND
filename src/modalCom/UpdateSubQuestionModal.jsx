import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import DataService from "../services/requestApi";
import Swal from "sweetalert2";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
};

export default function UpdateSubQuestionModal({ open, handleClose, subQuestion,fetchSubQuestions }) {
  const [formData, setFormData] = useState({
    questionId: "",
    subQuestion: "",
    status: "Active",
  });
  console.log("subQuestion", subQuestion);
  // ✅ Autofill when subQuestion changes
  useEffect(() => {
    if (subQuestion) {
      setFormData({
        questionId: subQuestion.questionId || "",
        subQuestion: subQuestion.subQuestion || "",
        status: subQuestion.status || "Active",
      });
    }
  }, [subQuestion]);

  // ✅ handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ submit handler
  const handleSubmit = async () => {
    try {
      const res = await DataService.updateSubQuestion(subQuestion?.subQuestionId, formData);

      if (res.data?.status === true) {
        Swal.fire("Success", "Sub-question updated successfully!", "success");
        handleClose();
        fetchSubQuestions()
      } else {
        Swal.fire("Error", res.data?.message || "Update failed", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          Update Sub-Question
        </Typography>

        {/* Question ID */}
        <TextField
          fullWidth
          label="Question ID"
          name="questionId"
          type="number"
          value={formData.questionId}
          onChange={handleChange}
          margin="normal"
        />

        {/* SubQuestion */}
        <TextField
          fullWidth
          label="Sub Question"
          name="subQuestion"
          value={formData.subQuestion}
          onChange={handleChange}
          margin="normal"
        />

        {/* Status */}
        {/* <TextField
          select
          fullWidth
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          margin="normal"
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </TextField> */}

        {/* Buttons */}
        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
