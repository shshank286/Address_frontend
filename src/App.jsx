import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import HomeWithPopup from "./Components/HomePageWithPopup";
import Local from "./Components/Category/Politics";
import International from "./Components/Category/International";
import National from "./Components/Category/National";
import DetailsPage from "./Components/Home/DetailsPage";
import ForgotPassword from "./Components/ForgotPassword";
import AdminLogin from "./Components/AdminLogin";
import ProtectedRoute from "./Components/ProtectedRoute";
import Dashboard from "./Components/admin/pages/Dashboard";
import QuizWinnerList from "./Components/admin/pages/QuizWinnerList ";
import NewsPage from "./Components/admin/pages/NewsPage";
import ContactPage from "./Components/admin/pages/ContactPage";
import SubscriptionPage from "./Components/admin/pages/SubscriptionPage";
import UserTable from "./Components/admin/pages/UserTable";
import Map from "./Components/Map/Map";
import AdminLayout from "./Components/admin/AdminLayout";
import Profile from "./Components/Profile";
import ResetPassword from "./Components/ResetPassword";
import NotFound from "./Components/NotFound";
import { useEffect, useState } from "react";
import CatogoryNews from "./Components/CatogoryNews";
import QuizPopup from "./Components/QuizPopup";
import { fetchNewsByDate, setSelectedDate } from "./Context/newsSlice";
import { useDispatch } from "react-redux";
import Business from "./Components/Category/Business";
import AdminProtectedRoute from "./Components/AdminProtectedRoute";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import SettingPage from "./Components/admin/pages/SettingPage";
import DetailsPageAdmin from "./Components/admin/pages/DetailsPage";
import TermsAndConditions from "./Components/Home/TermsAndConditions";
import Faq from "./Components/Home/Faq";
import PrivacyPolicy from "./Components/Home/PrivacyPolicy";
import PromptEdit from "./Components/admin/pages/PromptEdit";
import Popup from "./Components/Popup";

const App = () => {
  const location = useLocation();

  const dispatch = useDispatch();

  const [showNavbarFooter, setShowNavbarFooter] = useState(true);

  const token = localStorage.getItem("token");
  // Define routes where Navbar and Footer should not appear
  const adminRoutes = ["/admin", "/admin-dashboard", "/reset-password", "/*"];
  const shouldHideNavAndFooter = adminRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  const handleDateSelect = (date) => {
    dispatch(setSelectedDate(date));
    dispatch(fetchNewsByDate(date));
  };

  let today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  dispatch(setSelectedDate(formattedDate));
  dispatch(fetchNewsByDate(formattedDate));

  useEffect(() => {
    // Hide Navbar and Footer for 404 (Not Found) page
    if (location.pathname === "/404" || location.pathname === "*") {
      setShowNavbarFooter(false);
    } else {
      setShowNavbarFooter(true);
    }
  }, [location]);

  return (
    <div className="relative min-h-screen">
      {/* Conditionally render Navbar */}

      {/* <Route path="*" component={NotFound} /> */}
      <div className={`${!shouldHideNavAndFooter ? "pb-1" : ""}`}>
        {!shouldHideNavAndFooter && <Navbar onDateSelect={handleDateSelect} />}
        <Popup />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomeWithPopup />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          <Route
            path="/politics"
            element={
              <Local />
            }
          />
          <Route
            path="/international"
            element={
              <International />
            }
          />
          <Route
            path="/national"
            element={

              <National />
            }
          />
          <Route
            path="/business"
            element={


              <Business />
            }
          />
          <Route
            path="/worldnews"
            element={
              <Map />
            }
          />
          <Route
            path="/detailspage/:newsId"
            element={
              <ProtectedRoute>
                {" "}
                <DetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category/:categoryName"
            element={
              <ProtectedRoute>
                {" "}
                <CatogoryNews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forgot"
            element={
              <ProtectedRoute>
                {" "}
                <ForgotPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                {" "}
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reset-password/:token"
            element={

              <ResetPassword />

            }
          />

          {/* Admin Login */}
          <Route path="/admin" element={<AdminLogin />} />

          <Route
            path="/admin-dashboard"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            {/* Nested Admin Routes */}
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserTable />} />
            <Route path="quiz" element={<QuizWinnerList />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="edit-prompt" element={<PromptEdit />} />
            <Route path="subscription" element={<SubscriptionPage />} />
            <Route path="settings" element={<SettingPage />} />
            <Route path="detailspage/:newsId" element={<DetailsPageAdmin />} />

          </Route>
          {/* Catch-all Route for 404 Page Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {token ? <QuizPopup /> : null}

        <ToastContainer />
        <div>
          <Toaster />
        </div>
      </div>

      {/* Conditionally render Footer */}
      {!shouldHideNavAndFooter && showNavbarFooter && <Footer />}
    </div>
  );
};

export default App;





