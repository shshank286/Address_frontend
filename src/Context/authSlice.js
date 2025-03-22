import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
  userId: localStorage.getItem("userId") || null,
  email: localStorage.getItem("email") || "",
  phonenumber: localStorage.getItem("phonenumber") || "",
  gender: localStorage.getItem("gender") || "",
  Address: localStorage.getItem("address" || {}),
  Occupation: localStorage.getItem("osccupation" || {}),
  isLoggedIn: !!localStorage.getItem("token"), 
  isAdminLoggedIn: !!localStorage.getItem("adminToken"),
  isPopupOpen: false, 
  isQuizPopupOpen: false,
  locationGranted: localStorage.getItem("locationGranted") === "true" || false,
  initialForm: "login",
  user_role: "user",
  profilePicture: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const {
        token,
        userId,
        email,
        name,
        profilePicture,
        user_profile,
        phonenumber,
        gender,
        user_role,
        adminToken = null,
        locationGranted
      } = action.payload;

      // Update state
      state.token = token;
      state.adminToken = adminToken;
      state.userId = userId;
      state.email = email;
      state.name = name;
      state.phonenumber = phonenumber;
      state.gender = gender;
      state.user_profile = user_profile;
      state.profilePicture = profilePicture;
      state.isLoggedIn = true;
      state.isAdminLoggedIn = !!adminToken;
      state.isPopupOpen = false;
      state.isQuizPopupOpen = false;
      state.locationGranted = true;

      // Persist to local storage
      localStorage.setItem("token", token);
      localStorage.setItem("adminToken", adminToken);
      localStorage.setItem("userId", userId);
      localStorage.setItem("email", email);
      localStorage.setItem("name", name);
      localStorage.setItem("phonenumber", phonenumber);
      localStorage.setItem("gender", gender);
      localStorage.setItem("profilePicture", profilePicture);
      localStorage.setItem("user_profile", JSON.stringify(user_profile));
      localStorage.setItem("locationGranted", state.locationGranted);
    },
    logout: (state) => {
      // Reset state
      state.token = null;
      state.adminToken = null;
      state.userId = null;
      state.email = "";
      state.name = "";
      state.phonenumber = "";
      state.gender = "";
      state.profilePicture = {};
      state.isLoggedIn = false;
      state.isAdminLoggedIn = false;
      state.isPopupOpen = true;
      state.isQuizPopupOpen = false;
      state.locationGranted = false;

      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("email");
      localStorage.removeItem("name");
      localStorage.removeItem("phonenumber");
      localStorage.removeItem("gender");
      localStorage.removeItem("profilePicture");
      localStorage.removeItem("user_profile");
      localStorage.removeItem("quizScore");
      localStorage.removeItem("latitude");
      localStorage.removeItem("longitude");
      localStorage.removeItem("locationGranted");
      localStorage.removeItem("quizCompletedDate");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("user_profile");
      localStorage.removeItem("profile_picture");
      localStorage.removeItem("QuizQuestionId");
    },

    UpdateUserProfile: (state, action) => {
      const { Address, Occupation, profile_picture } = action.payload;
      

      if (Address) {
        state.Address = Address;
      }
      if (Occupation) {
        state.Occupation = Occupation;
      }
      if (profile_picture) {
        state.profilePicture = profile_picture;
      }

      if (Address) {
        localStorage.setItem("address", Address);
      }
      if (Occupation) {
        localStorage.setItem("occupation", Occupation);
      }
    }
    ,

    openPopup: (state, action) => {
      state.isPopupOpen = true;
      state.initialForm = action.payload || "login";
    },
    closePopup: (state, action) => {
      state.isPopupOpen = false;
      state.initialForm = "login";
    },

    openQuizPopup: (state) => {
      state.isQuizPopupOpen = true; 
    },
    closeQuizPopup: (state) => {
      state.isQuizPopupOpen = false; 
    },

    setLocationGranted: (state, action) => {
      state.locationGranted = action.payload;
      localStorage.setItem("locationGranted", action.payload); 
    }

  }
});




export const {
  login,
  logout,
  openPopup,
  closePopup,
  token,
  openQuizPopup,
  closeQuizPopup,
  UpdateUserProfile
} = authSlice.actions;
export default authSlice.reducer;
