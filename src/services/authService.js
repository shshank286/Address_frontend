import toast from "react-hot-toast";
import { apiClient, apiClientUser } from "../utils/apiHelper";
import axios from "axios";

const BASE_URL_ADMIN = import.meta.env.VITE_BASE_URL_ADMIN;
// Login API call
export const login = async (email, password) => {
  try {

    const response = await apiClientUser.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        console.error(
          "Bad Request:",
          data || "Invalid input provided."
        );
        toast.error(data || "Invalid email and password or Inactive account.");
        throw new Error(data?.message || "Invalid input provided.");
      }
      else if (status === 401) {
        console.error(
          "Endpoint not found:",
          data?.message || "Resource not found."
        );

        toast.error(data || "unAuthrorized access")
        throw new Error(data?.message || "Resource not found.");
      }
      
      else if (status === 404) {
        console.error(
          "Endpoint not found:",
          data?.message || "Resource not found."
        );

        toast.error("User not found")
        throw new Error(data?.message || "Resource not found.");
      } else if (status === 500) {
        console.error(
          "Server Error:",
          data?.message || "Please try again later."
        );
        throw new Error(data?.message || "Internal server error.");
      } else {
        console.error(
          "Unexpected Error:",
          data?.message || "An unknown error occurred."
        );
        throw new Error(data?.message || "An unknown error occurred.");
      }
    } else {
      console.error("Network Error:", error.message);
      throw new Error(
        "Network error. Please check your connection and try again."
      );
    }

  }
};
// Register API
export const register = async (
  firstname,
  lastname,
  email,
  phonenumber,
  gender,
  dateOfBirth,
  password
) => {
  try {
    const response = await apiClientUser.post("/auth/register", {
      firstname,
      lastname,
      email,
      phonenumber,
      gender,
      dateOfBirth,
      password
    });


    toast.success("Registration successful! Please check your email for the OTP.");

    return response.data;
  } catch (error) {

    if (error.response) {
      const { status, data } = error.response;

      // Extract the message from the response
      let errorMessage = data || "An unknown error occurred."; // Default error message

      // Check if the message is an object and convert it to a string if necessary
      if (typeof errorMessage === 'object') {
        // If the message is an object, we stringify it to avoid the React error
        errorMessage = JSON.stringify(errorMessage);
      }

      // Show the error toast with the message string
      if (status === 400) {
        console.error("Bad Request:", errorMessage);
        toast.error(errorMessage);
      } else if (status === 404) {
        console.error("Endpoint not found:", errorMessage);
        toast.error(errorMessage);
      } else if (status === 500) {
        console.error("Server Error:", errorMessage);
        toast.error(errorMessage);
      } else {
        console.error("Unexpected Error:", errorMessage);
        toast.error(errorMessage);
      }

      throw new Error(errorMessage); // Re-throw the error to handle it further if necessary
    } else {

      console.error("Network Error:", error.message);
      toast.error("Network error. Please check your connection and try again.");
      throw new Error("Network error. Please check your connection and try again.");
    }
  }
};

export const adminLoginApi = async (email, password) => {
  const response = await apiClientUser.post(`/auth/loginAdmin`, {
    email,
    password
  });
  return response.data;
};

export const registerGoogle = async (
  oauthId,
  provider,
  email,
  firstname,
  lastname,
  profilePicture
) => {
  try {
    const response = await apiClientUser.post(`/auth/oauth`, {
      email,
      oauthId,
      provider,
      firstname,
      lastname,
      profilePicture
    });
    return response.data;
  } catch (error) {
    console.error("Google register error:", error);
    throw error;
  }
};

export const registerLogin = async (oauthId, provider, email, token) => {
  try {
    const response = await apiClientUser.get(`/auth/oauth-login`, {
      token
    });
    return response.data;
  } catch (error) {
    console.error("Google register error:", error);
    throw error;
  }
};

// OTP Verification API call
export const verifyOtp = async (email, otp) => {
  try {
    const response = await apiClientUser.post("/auth/verify-otp", { email, otp });
    toast.success("OTP verified successfully");
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        console.error(
          "Bad Request:",
          data?.message || "Invalid input provided."
        );
        toast.error("Invalid OTP");
        throw new Error(data?.message || "Invalid input provided.");
      } else if (status === 404) {
        console.error(
          "Endpoint not found:",
          data?.message || "Resource not found."
        );
        throw new Error(data?.message || "Resource not found.");
      } else if (status === 500) {
        console.error(
          "Server Error:",
          data?.message || "Please try again later."
        );
        throw new Error(data?.message || "Internal server error.");
      } else {
        console.error(
          "Unexpected Error:",
          data?.message || "An unknown error occurred."
        );
        throw new Error(data?.message || "An unknown error occurred.");
      }
    } else {
      console.error("Network Error:", error.message);
      throw new Error(
        "Network error. Please check your connection and try again."
      );
    }
  }
};


export const resetOtp = async (email) => {
  try {
    const response = await apiClientUser.post("/auth/resend-otp", { email });
    toast.success("Resend OTP in e-mail");
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        console.error(
          "Bad Request:",
          data?.message || "Invalid input provided."
        );
        toast.error("Invalid OTP");
        throw new Error(data?.message || "Invalid input provided.");
      } else if (status === 404) {
        console.error(
          "Endpoint not found:",
          data?.message || "Resource not found."
        );
        throw new Error(data?.message || "Resource not found.");
      } else if (status === 500) {
        console.error(
          "Server Error:",
          data?.message || "Please try again later."
        );
        throw new Error(data?.message || "Internal server error.");
      } else {
        console.error(
          "Unexpected Error:",
          data?.message || "An unknown error occurred."
        );
        throw new Error(data?.message || "An unknown error occurred.");
      }
    } else {
      console.error("Network Error:", error.message);
      throw new Error(
        "Network error. Please check your connection and try again."
      );
    }
  }
};

// Forgot Password API call
export const forgotePassword = async (email) => {
  try {
    const response = await apiClientUser.post("auth/forgot-password", { email });
    toast.success("Reset Password Link send to your E-mail Address");
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        console.error(
          "Bad Request:",
          data?.message || "Invalid input provided."
        );
        toast.error("Invalid OTP");
        throw new Error(data?.message || "Invalid input provided.");
      } else if (status === 404) {
        console.error(
          "Endpoint not found:",
          data?.message || "Resource not found."
        );
        throw new Error(data?.message || "Resource not found.");
      } else if (status === 500) {
        console.error(
          "Server Error:",
          data?.message || "Please try again later."
        );
        throw new Error(data?.message || "Internal server error.");
      } else {
        console.error(
          "Unexpected Error:",
          data?.message || "An unknown error occurred."
        );
        throw new Error(data?.message || "An unknown error occurred.");
      }
    } else {
      console.error("Network Error:", error.message);
      throw new Error(
        "Network error. Please check your connection and try again."
      );
    }
  }
};


export const resetPassword = async (resetToken, newPassword) => {
  try {
    const response = await apiClientUser.post("/auth/reset-password", {
      resetToken,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error("Password reset failed", error);
    throw error;
  }
};

// get all users

export const getAllUsers = async () => {
  try {
    const response = await apiClientUser.get("/users/all");
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 400) {
        console.error(
          "Bad Request:",
          data?.message || "Invalid input provided."
        );
        toast.error("users not found!");
        throw new Error(data?.message || "Invalid input provided.");
      } else if (status === 404) {
        console.error(
          "Endpoint not found:",
          data?.message || "Resource not found."
        );
        throw new Error(data?.message || "Resource not found.");
      } else if (status === 500) {
        console.error(
          "Server Error:",
          data?.message || "Please try again later."
        );
        throw new Error(data?.message || "Internal server error.");
      } else {
        console.error(
          "Unexpected Error:",
          data?.message || "An unknown error occurred."
        );
        throw new Error(data?.message || "An unknown error occurred.");
      }
    } else {
      console.error("Network Error:", error.message);
      throw new Error(
        "Network error. Please check your connection and try again."
      );
    }
  }
};


export const updateUserStatus = async (userId, isActive) => {
  try {
    const response = await apiClientUser.patch(`/users/${userId}/activate`, {
      isActive: isActive,
    });

    if (response.status !== 200) {
      throw new Error("Failed to update user status");
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        console.error("Bad Request:", data?.message || "Invalid input provided.");
        throw new Error(data?.message || "Invalid input provided.");
      } else if (status === 404) {
        console.error("Not Found:", data?.message || "User not found.");
        throw new Error(data?.message || "User not found.");
      } else if (status === 500) {
        console.error("Server Error:", data?.message || "Please try again later.");
        throw new Error(data?.message || "Internal server error.");
      } else {
        console.error("Unexpected Error:", data?.message || "An unknown error occurred.");
        throw new Error(data?.message || "An unknown error occurred.");
      }
    } else {
      console.error("Network Error:", error.message);
      throw new Error("Network error. Please check your connection and try again.");
    }
  }
};


export const updateProfile = async (formData) => {
  try {
    const response = await apiClientUser.put(`/profile`, formData);
    return response;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        console.error(
          "Bad Request:",
          data?.message || "Invalid input provided."
        );
        throw new Error(data?.message || "Invalid input provided.");
      } else if (status === 404) {
        console.error(
          "Endpoint not found:",
          data?.message || "Resource not found."
        );
        throw new Error(data?.message || "Resource not found.");
      } else if (status === 500) {
        console.error(
          "Server Error:",
          data?.message || "Please try again later."
        );
        throw new Error(data?.message || "Internal server error.");
      } else {
        console.error(
          "Unexpected Error:",
          data?.message || "An unknown error occurred."
        );
        throw new Error(data?.message || "An unknown error occurred.");
      }
    } else {
      console.error("Network Error:", error.message);
      throw new Error(
        "Network error. Please check your connection and try again."
      );
    }
  }
};

// Get Profile api
export const getProfile = async () => {
  try {
    const profile = await apiClientUser.get(`/profile`);
    return profile.data;
  } catch (error) {
    // Handle specific HTTP status codes
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        console.error(
          "Bad Request:",
          data?.message || "Invalid input provided."
        );
        throw new Error(data?.message || "Invalid input provided.");
      } else if (status === 404) {
        console.error(
          "Endpoint not found:",
          data?.message || "Resource not found."
        );
        throw new Error(data?.message || "Resource not found.");
      } else if (status === 500) {
        console.error(
          "Server Error:",
          data?.message || "Please try again later."
        );
        throw new Error(data?.message || "Internal server error.");
      } else {
        console.error(
          "Unexpected Error:",
          data?.message || "An unknown error occurred."
        );
        throw new Error(data?.message || "An unknown error occurred.");
      }
    } else {
      console.error("Network Error:", error.message);
      throw new Error(
        "Network error. Please check your connection and try again."
      );
    }
  }
};

export const recentQuiz = async () => {
  try {
    const quiz = await apiClientUser.get("/quiz/recent");
    return quiz.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        console.error(
          "Bad Request:",
          data?.message || "Invalid input provided."
        );
        throw new Error(data?.message || "Invalid input provided.");
      } else if (status === 404) {
        console.error(
          "Endpoint not found:",
          data?.message || "Resource not found."
        );
        throw new Error(data?.message || "Resource not found.");
      } else if (status === 500) {
        console.error(
          "Server Error:",
          data?.message || "Please try again later."
        );
        throw new Error(data?.message || "Internal server error.");
      } else {
        console.error(
          "Unexpected Error:",
          data?.message || "An unknown error occurred."
        );
        throw new Error(data?.message || "An unknown error occurred.");
      }
    } else {
      console.error("Network Error:", error.message);
      throw new Error(
        "Network error. Please check your connection and try again."
      );
    }
  }
};


const getUserSCore = async (userId) => {
  try {
    const score = await apiClientUser.get(`quiz/scores/user`, {
      params: { user_id: userId },
    });
    return score.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
        if (status === 400) {
          throw new Error("Bad Request: Invalid input provided.");

        }else if (status === 404) {
          throw new Error("Not Found: User not found.");
        }
    }
  }
}

export const recentQuizUser = async () => {
  try {
    const quiz = await apiClientUser.get("/quiz/recentUser");
    return quiz.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        console.error(
          "Bad Request:",
          data?.message || "Invalid input provided."
        );
        throw new Error(data?.message || "Invalid input provided.");
      } else if (status === 404) {
        console.error(
          "Endpoint not found:",
          data?.message || "Resource not found."
        );
        throw new Error(data?.message || "Resource not found.");
      } else if (status === 500) {
        console.error(
          "Server Error:",
          data?.message || "Please try again later."
        );
        throw new Error(data?.message || "Internal server error.");
      } else {
        console.error(
          "Unexpected Error:",
          data?.message || "An unknown error occurred."
        );
        throw new Error(data?.message || "An unknown error occurred.");
      }
    } else {
      console.error("Network Error:", error.message);
      throw new Error(
        "Network error. Please check your connection and try again."
      );
    }
  }
};

// quiz status
export const checkQuizStatus = async (userId, token) => {
  try {
    const response = await apiClientUser.post(`/quiz/quiz-status`, {
      userId,
      token,
    });
    console.log("QUIZSTATUS",response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error checking quiz status:', error);
    throw error; // Throw error to be handled by calling component
  }
};

export const submitAnswer = async (quizzId, questionId, answer) => {
  try {
    const answerData = await apiClientUser.post("/quiz/submit", {
      quizzId,
      questionId,
      answer
    });
    return answerData.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {

        console.error(
          "Bad Request:",
          data?.message || "You already took the quiz."
        );

        throw new Error(data?.message || "Invalid input provided.");
      } else if (status === 404) {
        console.error(
          "Endpoint not found:",
          data?.message || "Resource not found."
        );

        throw new Error(data?.message || "Resource not found.");
      }
    } else {

      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  }
};

// NEWS API
export const newsData = async (limit, page, token) => {
  try {
    const news = await apiClientUser.get(
      `/news/all?limit=${limit}&page=${page}`,
      { token }
    );

    return news.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        console.error("Bad Request:", data?.message || "bad request");

        throw new Error(data?.message || "Invalid input provided.");
      } else if (status === 404) {
        console.error(
          "Endpoint not found:",
          data?.message || "Resource not found."
        );
        throw new Error(data?.message || "Resource not found.");
      }
    }
  }
};

export const worldMap = async () => {
  try {
    const map = await apiClientUser.get("/news/worldmap");

    return map.data;
  } catch (error) {
    console.log("ERROR MAP");
  }
};

//QUIZ RANK API
export const quizRankListAPI = async (page, size, token) => {
  try {
    const rank = await apiClientUser.get(
      `/quiz/rank?page=${page}&size=${size}`,
      { token }
    );
    return rank.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        console.error("Bad Request:", data?.message || "bad request");

        throw new Error(data?.message || "Invalid input provided.");
      } else if (status === 404) {
        console.error(
          "Endpoint not found:",
          data?.message || "Resource not found."
        );
        throw new Error(data?.message || "Resource not found.");
      }
    }
  }
};

export const subscriptionsApi = async (email) => {
  try {
    const subscriptions = await apiClientUser.post("/subscriptions", { email });
    console.log("Subscribed", subscriptions);
    toast.success(subscriptions.data.message);
    return subscriptions.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        console.error("Bad Request:", data?.message || "bad request");
        toast.error("You have Already subcribed !");

        throw new Error(data?.message || "Invalid input provided.");
      } else if (status === 404) {
        console.error(
          "Endpoint not found:",
          data?.message || "Resource not found."
        );
        throw new Error(data?.message || "Resource not found.");
      }
    }
  }
};

export const categoriesApi = async () => {
  try {
    const category = await apiClientUser.get("/categories");
    console.log("categories", category);
    return category.data.categories;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        console.error("Bad Request:", data?.message || "bad request");
        toast.error("categories not found");

        throw new Error(data?.message || "Invalid input provided.");
      } else if (status === 404) {
        console.error(
          "Endpoint not found:",
          data?.message || "Resource not found."
        );
        throw new Error(data?.message || "Resource not found.");
      }
    }
  }
};

export const searchAPi = async (name) => {
  try {
    const searchNews = await apiClientUser.get(`news/search?newsName=${name}`);
    return searchNews.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        console.error("Bad Request:", data?.message || "bad request");
        toast.error("categories not found");

        throw new Error(data?.message || "Invalid input provided.");
      } else if (status === 404) {
        console.error(
          "Endpoint not found:",
          data?.message || "Resource not found."
        );
        throw new Error(data?.message || "Resource not found.");
      }
    }
  }
};

export const subscriptionAdminAPi = async () => {
  try {
    const subscription = await apiClientUser.get("/subscriptions");
    console.log(
      "SUBCRIPTION IN AUTHENTICATION",
      subscription.data.subscriptions
    );

    return subscription.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        console.error("Bad Request:", data?.message || "bad request");
        toast.error("categories not found");
        throw new Error(data?.message || "Invalid input provided.");
      } else if (status === 404) {
        console.error(
          "Endpoint not found:",
          data?.message || "Resource not found."
        );
        throw new Error(data?.message || "Resource not found.");
      }
    }
  }
};



export const getSurveyByUserId = async (id) => {
  try {
    const response = await apiClientUser.get(`survey/survey-results-count/${id}`);

    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        console.error(
          "Bad Request:",
          data?.message || "Invalid input provided."
        );
        throw new Error(data?.message || "Invalid input provided.");
      } else if (status === 404) {
        console.error(
          "Endpoint not found:",
          data?.message || "Resource not found."
        );
        throw new Error(data?.message || "Resource not found.");
      } else if (status === 500) {
        console.error(
          "Server Error:",
          data?.message || "Please try again later."
        );
        throw new Error(data?.message || "Internal server error.");
      } else {
        console.error(
          "Unexpected Error:",
          data?.message || "An unknown error occurred."
        );
        throw new Error(data?.message || "An unknown error occurred.");
      }
    } else {
      console.error("Network Error:", error.message);
      throw new Error(
        "Network error. Please check your connection and try again."
      );
    }
  }
};


export const updatePasswordAdmin = async (email, newPassword) => {
  try {
    const response = await axios.post(`${BASE_URL_ADMIN}/admin/change-password`, { email, newPassword });
    return response.data;
  } catch (error) {
    toast.error("Somthing went wrong !", error);
  }
}



// Export all functions as part of AuthService
const AuthService = {
  login,
  register,
  verifyOtp,
  registerGoogle,
  resetPassword,
  updateProfile,
  getProfile,
  recentQuiz,
  submitAnswer,
  newsData,
  worldMap,
  quizRankListAPI,
  subscriptionsApi,
  categoriesApi,
  searchAPi,
  subscriptionAdminAPi,
  adminLoginApi,
  getAllUsers,
  updateUserStatus,
  getSurveyByUserId,
  resetOtp,
  forgotePassword,
  updatePasswordAdmin,
  recentQuizUser,
  getUserSCore,
  checkQuizStatus
};

export default AuthService;
