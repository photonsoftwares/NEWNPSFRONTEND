import React, { createContext, useContext, useState } from "react";
import DataService from "../services/requestApi";
import Swal from "sweetalert2";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Create Survey
  const createSurvey = async (surveyData) => {
    try {
      const res = await DataService.createSurvey(surveyData);
      if (res?.data?.status === true) {
        Swal.fire("Success", "Survey created successfully!", "success");
      } else {
        Swal.fire("Error", res?.data?.message || "Failed to create survey", "error");
      }
      return res.data;
    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
      throw err;
    }
  };

  // Submit Feedback
  const submitFeedback = async (feedbackData) => {
    try {
      const res = await DataService.submitFeedback(feedbackData);
      if (res?.data?.status === true) {
        Swal.fire("Thank you!", "Feedback submitted successfully!", "success");
      } else {
        Swal.fire("Error", res?.data?.message || "Failed to submit feedback", "error");
      }
      return res.data;
    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
      throw err;
    }
  };

  // Get Surveys
  const getSurveys = async () => {
    try {
      const res = await DataService.getSurveys();
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);

  // Get Categories
  const getCategories = async () => {
    try {
      const res = await DataService.getCategories("6");
      setCategories(res.data?.data || []);
      return res.data;
    } catch (err) {
      console.error("Error loading categories", err);
    }
  };
    const getQuestions = async () => {
    try {
      const res = await DataService.getQuestions("6");
      setQuestions(res.data?.questions || []);
      return res.data;
    } catch (err) {
      console.error("Error loading questions", err);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        createSurvey,
        submitFeedback,
        getSurveys,
          categories,
        questions,
        getCategories,
        getQuestions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
