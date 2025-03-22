import React, { useEffect, useState } from 'react';
import Register from './Register';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import OTPVerification from './OTPVerification';
import Logo from './Logo';
import QuizPopup from './QuizPopup';
import { useDispatch, useSelector } from "react-redux";
import { closePopup } from "../Context/authSlice";
import AuthService from '../services/authService';
import newSignup from "../assets/images/LocationPopup.png";

const Popup = () => {
  const dispatch = useDispatch();

  const isPopupOpen = useSelector((state) => state.auth.isPopupOpen);

  const initialForm = useSelector((state) => state.auth.initialForm);
  const [currentForm, setCurrentForm] = useState(initialForm);

  const isQuizPopupOpen = useSelector((state) => state.auth.isQuizPopupOpen);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const isLoggedIn = token && userId;



  
  useEffect(() => {
    setCurrentForm(initialForm); 
  }, [initialForm, isPopupOpen]);

  const handleClose = () => {
    dispatch(closePopup());
  };

  const switchForm = (form) => {
    setCurrentForm(form);
  };

  const handleRegisterSuccess = () => {
    setCurrentForm('otpVerification');
  };

  const handleOtpSuccess = () => {
    setCurrentForm('login');
  };

  const handleForgotPasswordSubmit = () => {
    setCurrentForm('otpVerification');
  };

  const [timerExpired, setTimerExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); 

  useEffect(() => {
    // Timer countdown for 5 minutes (300 seconds)
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer); 
          setTimerExpired(true); 
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleResendOtp = () => {
    const restEmail = localStorage.getItem("restEmail");
    try {
      const response = AuthService.resetOtp(restEmail);
      return response;
    } catch (error) {
      console.error("Error resend otp", error);

    }
  };
 
  return (
    <>
      {/* Authentication Popup */}
      {isPopupOpen && !isLoggedIn && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 backdrop-blur-md">
          <div className="bg-white w-full max-w-[50rem] h-auto rounded-md shadow-lg flex flex-col md:flex-row relative">
            <Logo />
            <button
              className="absolute top-2 right-2 md:top-4 md:right-4 z-50 text-black text-3xl mr-2 md:mr-3"
              onClick={handleClose}
            >
              &#x2715;
            </button>
           
            <div className="hidden md:block md:w-2/5 h-56 p-3 md:h-auto order-2">
              <img
                src={newSignup}
                alt="Register or Login"
                className="h-full w-full object-cover rounded-t-md md:rounded-l-md md:rounded-tr-none"
              />
            </div>
            <div className="w-full md:w-3/5 p-6 relative flex flex-col items-center order-1">
              <h2 className="text-2xl font-semibold text-black mb-4 text-center mt-12">
                {currentForm === 'login'
                  ? <p className='font-roboto text-3xl'>Login</p>
                  : currentForm === 'register'
                    ? <p className='font-roboto text-3xl'>Sign Up</p>
                    : currentForm === 'forgotPassword'
                      ? ''
                      : ''}
              </h2>
              <p className="text-gray-500 text-sm text-center mb-6">
                {currentForm === 'login'
                  ? 'Access your personal account.'
                  : currentForm === 'register'
                    ? 'Let’s get you set up so you can access your personal account.'
                    : ''}
              </p>
              {currentForm === 'login' && <Login />}
              
              {currentForm === 'register' && <Register onRegisterSuccess={handleRegisterSuccess} />}
              {currentForm === 'forgotPassword' && (
                <ForgotPassword
                  onSubmit={handleForgotPasswordSubmit}
                  onBackToLogin={() => switchForm('login')}
                />
              )}
              {currentForm === 'otpVerification' && (
                <OTPVerification handleSendOtp={handleOtpSuccess} />
              )}
              <div className="text-center mt-4 text-xs">
                {currentForm === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <span
                      className="text-[#D6043C] cursor-pointer"
                      onClick={() => switchForm('register')}
                    >
                      Sign Up
                    </span>
                    <br />
                    <span
                      className="text-[#D6043C] cursor-pointer"
                      onClick={() => switchForm('forgotPassword')}
                    >
                      Forgot Password?
                    </span>
                  </>
                ) : currentForm === 'register' ? (
                  <>
                    Already have an account?{' '}
                    <span
                      className="text-[#D6043C] cursor-pointer"
                      onClick={() => switchForm('login')}
                    >
                      Login
                    </span>
                  </>
                ) : currentForm === 'otpVerification' ? (
                  <>
                    Didn't receive the OTP?{' '}
                    {timerExpired ? (
                      <span
                        className="text-[#D6043C] cursor-pointer"
                        onClick={handleResendOtp}
                      >
                        Resend OTP
                      </span>
                    ) : (
                      <span className="text-[#D6043C]">{`Resend available in ${formatTime(timeLeft)}`}</span>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Popup */}
      {isQuizPopupOpen && <QuizPopup onClose={() => setIsQuizPopupOpen(false)} />}
    </>
  );
};

export default Popup;
