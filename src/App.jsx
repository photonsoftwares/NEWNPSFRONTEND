import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "./pages/Home";
import CustomerPage from "./pages/Customer";
import AdminPage from "./pages/Admin";
import AnalyticsPage from "./pages/Analytics";
import CreateSurveyPage from "./pages/CreateSurvey";
import ViewSurveyPage from "./pages/ViewSurvey";
import EditSurveyPage from "./pages/EditSurvey";
import ManageQuestionsPage from "./pages/ManageQuestions";
import SurveyListPage from "./pages/SurveyList";
import SubQuestionManager from "./pages/SubQuestionManager";
import LoginPage from "./Login/LoginPage";
import ProtectedRoute from "./ProtectedRoute";   // ✅ import
import { useEffect, useState } from "react";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loginStatus);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/customer/:surveyId" element={<CustomerPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/surveys"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <SurveyListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/subQuestion/new"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <SubQuestionManager />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/surveys/new"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <CreateSurveyPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/surveys/view/:surveyId"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ViewSurveyPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/surveys/edit/:surveyId"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <EditSurveyPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/questions"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ManageQuestionsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
