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

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminPage />} />
        <Route path="/customer" element={<CustomerPage />} />
        {/* <Route path="/admin" element={<AdminPage />} /> */}
        <Route path="/admin/surveys" element={<SurveyListPage />} />
        <Route path="/admin/surveys/new" element={<CreateSurveyPage />} />
        <Route path="/admin/surveys/view/:surveyId" element={<ViewSurveyPage />} />
        <Route path="/admin/surveys/edit/:surveyId" element={<EditSurveyPage />} />
        <Route path="/admin/questions" element={<ManageQuestionsPage />} />
        <Route path="/admin/analytics" element={<AnalyticsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </Router>
  );
}
