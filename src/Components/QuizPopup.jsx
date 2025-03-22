import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeQuizPopup } from "../Context/authSlice";
import QuizQuestion from "../Components/QuizQuestions";
import { ImCross } from "react-icons/im";

const QuizPopup = ({ onClose }) => {
  const dispatch = useDispatch();
  const isQuizPopupOpen = useSelector((state) => state.auth.isQuizPopupOpen);
  
  
  const userRole = useSelector((state) => state.auth.userRole); 
  


  useEffect(() => {
    if (userRole === "admin" || !isQuizPopupOpen) {
      dispatch(closeQuizPopup());  
    }
  }, [userRole, isQuizPopupOpen, dispatch]);

  
  if (userRole === "admin" || !isQuizPopupOpen) return null;



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300 bg-opacity-50 ">
      <div className="relative bg-white rounded-lg shadow-lg w-[50rem] max-w-[45rem]">
        <button
          onClick={() => {
            dispatch(closeQuizPopup());
            onClose(); 
          }}
          className="absolute top-3 right-3 text-white"
        >
          <ImCross size={20} className="text-black" />
        </button>
        <QuizQuestion onClose={onClose} />
      </div>
    </div>
  );
};

export default QuizPopup;
