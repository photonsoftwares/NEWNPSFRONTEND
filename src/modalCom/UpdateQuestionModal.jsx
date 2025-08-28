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

export default function UpdateQuestionModal({ open, handleClose, question }) {
  const [formData, setFormData] = useState({
    question: "",
    saasId: "",
    level: "",
    // type: "",
    // options: 3,
    status: "Inactive",
  });

  // ✅ whenever "question" changes, update formData
  useEffect(() => {
    if (question) {
      setFormData({
        question: question.question || "",
        saasId: question.saasId || "",
        level: question.level || "",
        // type: question.type || 1,
        // options: question.options || 3,
        status: question.status || "Inactive",
      });
    }
  }, [question]);

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // submit handler
  const handleSubmit = async () => {
    try {
      const res = await DataService.updateQuestion(question.questionId, formData);

      if (res.data?.status === true) {
        Swal.fire("Success", "Question updated successfully!", "success");
        handleClose();
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
          Update Question
        </Typography>

        <TextField
          fullWidth
          label="Question"
          name="question"
          value={formData.question}
          onChange={handleChange}
          margin="normal"
        />

        {/* <TextField
          fullWidth
          label="SaaS ID"
          name="saasId"
          value={formData.saasId}
          onChange={handleChange}
          margin="normal"
        /> */}

        <TextField
          fullWidth
          label="Level"
          name="level"
          type="number"
          value={formData.level}
          onChange={handleChange}
          margin="normal"
        />

        {/* <TextField
          select
          fullWidth
          label="Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          margin="normal"
        >
          <MenuItem value={1}>Type 1</MenuItem>
          <MenuItem value={2}>Type 2</MenuItem>
        </TextField> */}

        {/* <TextField
          fullWidth
          label="Options"
          name="options"
          type="number"
          value={formData.options}
          onChange={handleChange}
          margin="normal"
        /> */}
{/* 
        <TextField
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
