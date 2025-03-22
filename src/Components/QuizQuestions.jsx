import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeQuizPopup } from "../Context/authSlice";
import AuthService from "../services/authService";
import { toast } from "react-hot-toast";

export default function QuizQuestion() {
  const dispatch = useDispatch();
  const isQuizPopupOpen = useSelector((state) => state.auth.isQuizPopupOpen);
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [quizCompletedToday, setQuizCompletedToday] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  const userId = useSelector(state => state.auth.userId);
  const token = useSelector(state => state.auth.token);

  // Check if the quiz was completed today

  const checkQuizCompletion = () => {
    const lastCompletedDate = localStorage.getItem("quizCompletedDate");
    const today = new Date().toISOString().split("T")[0];
    if (lastCompletedDate === today) {
      setQuizCompletedToday(true);
    }
  };

  useEffect(() => {
    // Check the quiz status when the component is mounted
    if (userId && token) {
      quizStatus();
    }
  }, [userId, token]);

  useEffect(() => {
    if (!quizCompletedToday) {
      const fetchQuizData = async () => {
        try {
          const response = await AuthService.recentQuiz();
          const quizQuestions = response.questions.map((q) => ({
            id: q.id,
            question: q.question_text,
            options: q.options.map((opt, index) => ({
              id: `option_${index}`,
              text: opt,
            })),
          }));
          setQuizData(quizQuestions);

          localStorage.setItem("QuizQuestionId", response.id);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching quiz data:", error);
          setIsLoading(false);
        }
      };

      fetchQuizData();
    }
  }, [quizCompletedToday]);

  const currentQuestion = quizData[currentQuestionIndex];

  useEffect(() => {
    if (timeLeft > 0 && !hasTimedOut) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (timeLeft === 0 && !hasTimedOut) {
      setHasTimedOut(true);
      handleTimeout();
    }
  }, [timeLeft, hasTimedOut]);

  const handleTimeout = () => {
    handleSkip();
  };

  const handleOptionClick = (optionText) => {
    setSelectedOption(optionText);
  };

  let score_quizz;

  const handleNext = async () => {
    if (!selectedOption) {
      toast.error("Please select an answer!");
      return;
    }

    try {
      const quizQuestionId = localStorage.getItem("QuizQuestionId");
      const quizId = quizQuestionId;
      const response = await AuthService.submitAnswer(quizId, currentQuestion.id, selectedOption);

      score_quizz = response?.total_score;

      if (response.correct) {
        setScore((prevScore) => prevScore + 5); 
        setFeedbackMessage("Correct answer!");
      } else {
        setFeedbackMessage(response.message);
      }

      setCorrectAnswer(response.correct_answer);

      setTimeout(() => {
        if (currentQuestionIndex < quizData.length - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          resetQuestionState();
        } else {
          handleSubmit(score_quizz); // Submit after the last question
        }
      }, 1500);
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("You have already attempted this question. Skipping to the next.");
      handleSkip();
    }
  };

  const resetQuestionState = () => {
    setSelectedOption(null);
    setCorrectAnswer(null);
    setFeedbackMessage("");
    setTimeLeft(30);
    setHasTimedOut(false);
  };

  const [isDone, setIsDone] = useState("")

  const quizStatus = async () => {
    try {
      const isQuizDone = await AuthService.checkQuizStatus(userId, token);
      console.log("Quiz completion status:", isQuizDone);
      setIsDone(isQuizDone.todayQuizDone);

      return isQuizDone;
    } catch (error) {
      console.error("Error checking quiz completion status:", error);
    }
  };

  const handleSubmit =async (score_quizz) => {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("quizCompletedDate", today);

    toast.success(`Quiz Completed! Your score is: ${score_quizz} points`);
    dispatch(closeQuizPopup());
  };

  const handleSkip = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      resetQuestionState();
    } else {
      handleSubmit(score_quizz);
    }
  };

  const generateCustomId = (index) => {
    return (index % 10) + 1;
  };

  if (!isQuizPopupOpen) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-80">
        <l-tail-chase size="40" speed="1.75" color="black"></l-tail-chase>
      </div>
    );
  }

  if (quizData.length === 0) {
    return <div className="text-center">No quiz data available</div>;
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-[700px] md:max-w-[900px] bg-gray-100 rounded-xl shadow-xl overflow-hidden">
        {quizCompletedToday || isDone  ? (
          <div className="h-72 flex justify-center items-center">
            <h2 className="text-2xl font-poppins m-4 text-center">
              You have already completed the quiz today. Please come back tomorrow!
            </h2>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 text-white text-xs font-bold">
                {timeLeft}s
              </div>
              <div className="text-right text-sm font-semibold text-gray-600 mt-5">
                Question {currentQuestionIndex + 1} / {quizData.length}
              </div>
            </div>

            <h2 className="mb-8 text-[1.5rem] font-medium text-gray-700">
              {generateCustomId(currentQuestion.id - 1)}. {currentQuestion.question}
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.text)}
                  className={`flex w-full items-center justify-between rounded-lg border p-4 text-sm transition-colors ${
                    selectedOption === option.text
                      ? option.text === correctAnswer
                        ? "border-green-600 bg-green-200"
                        : "border-red-600 bg-red-50"
                      : correctAnswer === option.text
                      ? "border-green-600 bg-green-200"
                      : "border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50"
                  }`}
                >
                  <span>{option.text}</span>
                </button>
              ))}
            </div>

            {feedbackMessage && (
              <div className="text-center mb-4 text-sm text-gray-700">
                {feedbackMessage}
              </div>
            )}

            <div className="flex items-center justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-md transition-colors"
                onClick={handleSkip}
              >
                Skip
              </button>
              <button
                className={`px-4 py-2 rounded-md text-white transition-colors ${
                  currentQuestionIndex < quizData.length - 1
                    ? "bg-black hover:bg-gray-800"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                onClick={handleNext}
              >
                {currentQuestionIndex < quizData.length - 1 ? "Next" : "Submit"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
