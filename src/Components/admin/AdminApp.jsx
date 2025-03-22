import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "../admin/Sidebar";
import Navbar from "../admin/AdminNavBar";
import QuizPage from "../admin/pages/QuizWinnerList ";
import SubscriptionPage from "../admin/pages/SubscriptionPage";
import ContactPage from "../admin/pages/ContactPage";

const App = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow">
        <Navbar />
        <Routes>
          <Route path="admin-dashboard/quiz" element={<QuizPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
