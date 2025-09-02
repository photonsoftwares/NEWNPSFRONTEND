import http from "./http-common";

class DataService {
  // 🔐 Login API
  Login(data) {
    return http.post("/auth/login", data);
  }

  // 📝 Create Survey
  createSurvey(data) {
    return http.post("/survey/add", data);
  }
  // category
  createCategory(data) {
    return http.post("/category/add", data);
  }

  updateCategory(id, data) {
    return http.put(`/category/update-by-id/${id}`, data);
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
    return http.post("/feedback/add", data);
  }

  // 📊 Get Feedback Results
  getFeedbackResults(formdate , todate,saasId) {
    return http.get(`/feedback/${formdate}/${todate}/${saasId}`);
  }
   CreateQuestion(data) {
    return http.post("/Question/create", data);
  }
   getQuestion(saasId) {
    return http.get(`/Question/get-by-saasId/${saasId}`);
  }
    getQuestionbyLevel(saasId, level) {
    return http.get(`/Question/get-by-level/${saasId}/${level}`);
  }
   deleteQuestion(Id) {
    return http.put(`/Question/delete/${Id}`);
  }
  updateQuestion(id, data) {
    return http.put(`/Question/update-question/${id}`, data);
  }
  // sub question
  createSubQuestion(data) {
    return http.post("/SubQuestion/create", data);
  }
  getSubQuestions(Qsid) {
    return http.get(`/SubQuestion/getby-questionId/${Qsid}`);
  }
  deleteSubQuestion(Id) {
    return http.put(`/SubQuestion/delete/${Id}`);
  }
  updateSubQuestion(id, data) {
    return http.put(`/SubQuestion/update-Subquestion/${id}`, data);
  }
  //Survey
  getSurveys(saasId) {
    return http.get(`/survey/get-by-saasId/${saasId}`);
  }
  getSurveyById(surveyId) {
    return http.get(`/survey/get-by-id/${surveyId}`);
  }
  SurveyupdateById(surveyId, data) {
    return http.put(`/survey/update-by-id/${surveyId}`, data);
  }
  getAllbackcount(saasId, type) {
    return http.get(`/feedback/get-count-data/${saasId}/${type}`);
  }
 
  // users
  createUser(data) {
    return http.post("/user/create", data);
  }

  getUserById(userId) {
    return http.get(`/users/${userId}`);
  }
 
  deleteUser(userId) {
    return http.delete(`/user/delete/${userId}`);
  }
    getUsers(page,size,saasId) {
    return http.get(`/user/all/${page}/${size}/${saasId}`);
  }
   updateUser(userId, data) {
    return http.put(`/user/update/${userId}`, data);
  }

}

export default new DataService();
