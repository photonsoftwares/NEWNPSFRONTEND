import http from "./http-common";

class DataService {
  // 🔐 Login API
  Login(data) {
    return http.post("/auth/login", data);
  }

  // 📝 Create Survey
  createSurvey(data) {
    return http.post("/nps/survey/create", data);
  }
  getCategories(saasId) {
    return http.get(`/category/get-by-saasId/${saasId}`);
  }

  getQuestions(saasId) {
    return http.get(`/Question/get-by-saasId/${saasId}`);
  }
  // 📋 Get All Surveys
  getSurveys() {
    return http.get("/nps/survey/list");
  }

  // 📄 Get Survey by ID
  getSurveyById(surveyId) {
    return http.get(`/nps/survey/${surveyId}`);
  }

  // ✅ Submit Feedback
  submitFeedback(data) {
    return http.post("/nps/feedback/submit", data);
  }

  // 📊 Get Feedback Results
  getFeedbackResults(surveyId) {
    return http.get(`/nps/feedback/results/${surveyId}`);
  }
   SubQuestion(data) {
    return http.post("/Question/create", data);
  }
   getQuestion(saasId) {
    return http.get(`/Question/get-by-saasId/${saasId}`);
  }
   deleteQuestion(Id) {
    return http.put(`/Question/delete/${Id}`);
  }
}

export default new DataService();
