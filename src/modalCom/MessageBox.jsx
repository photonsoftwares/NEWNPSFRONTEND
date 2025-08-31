import React, { useState } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";

// ✅ MessageBox Component
const MessageBox = ({ rating, onSubmit ,message, setMessage }) => {
//   const [message, setMessage] = useState("");

  if (rating < 7) {
    return null; // rating < 7 toh ye component nahi dikhega
  }

  const handleSubmit = () => {
    if (message.trim() === "") {
      alert("Please enter a message before submitting!");
      return;
    }
    onSubmit(message); // parent me bhej dena
    setMessage(""); // clear
  };

  return (
    <Box
      className="p-4 rounded-xl shadow-md bg-gray-50 border"
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <Typography variant="h6" className="font-semibold text-gray-700">
        Please share your feedback
      </Typography>

      <TextField
        label="Your Message"
        multiline
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        className="rounded-lg"
      >
        Submit
      </Button>
    </Box>
  );
};

export default MessageBox;
