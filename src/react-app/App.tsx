import { BrowserRouter as Router, Routes, Route } from "react-router";
import Survey from "@/react-app/pages/Survey";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Survey />} />
      </Routes>
    </Router>
  );
}
