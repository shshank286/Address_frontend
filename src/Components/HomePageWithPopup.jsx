import React, { useState, useEffect } from "react";
import Popup from "./Popup"; 
import HomePage from "./Home/Home"; 
import QuizPopup from "./QuizPopup"; 
import { useDispatch, useSelector } from "react-redux";
import { closeQuizPopup } from "../Context/authSlice"; 

const HomeWithPopup = () => {
  // State to control Popup visibility and logged-in state
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
 
  const isPopupOpen = useSelector((state) => state.auth.isPopupOpen); 
  const isQuizPopupOpen = useSelector((state) => state.auth.isQuizPopupOpen);

  const idToken = localStorage.getItem('token');
  const id = localStorage.getItem('userId');
  const stayLoggedIn = idToken && id;

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      setIsPopupVisible(false); 
    } else {
      setIsPopupVisible(true); 
    }
  }, []); 

  
  const handleCloseQuiz = () => {
    
    dispatch(closeQuizPopup());
  };

  return (
    <div>
      
      {isPopupVisible && <Popup />}

      
      {isLoggedIn && isQuizPopupOpen && (
        <QuizPopup onClose={handleCloseQuiz} />
      )}

      {/* HomePage content */}
      <HomePage />
    </div>
  );
};

export default HomeWithPopup;
