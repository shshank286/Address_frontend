import React, { useState } from "react";
import { TextField } from "@mui/material";
import SocialMediaLogin from "./SocialMediaLogin";
import { useDispatch } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "../Context/authSlice";
import AuthService from "../services/authService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      // API call to login
      const {
        userId,
        email: userEmail,
        token,
        name,
        profilePicture,
        phonenumber,
        gender,
        user_profile,
      } = await AuthService.login(email, password);

      // Dispatch Redux action
      dispatch(
        login({
          email: userEmail,
          userId,
          token,
          name,
          phonenumber,
          gender,
          profilePicture,
          user_profile,
          isLoggedIn: true,
        })
      );

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("email", userEmail);

      navigate("/"); 
    } catch (error) {
      console.log("Error: " + error);
      
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit} className="w-full flex gap-2 flex-col">
        {/* Email Input */}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          required
        />

        {/* Password Input with Show/Hide Icon */}
        <div className="relative">
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            required
          />
          <div
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex gap-3">
          <input type="checkbox" name="chk" id="chk" />
          <p className="text-sm">Remember me</p>
        </div>

        {/* Error Message */}
        {error && (
          <div>
            <span className="text-red-500">{error}</span>
          </div>
        )}

        {/* Login Button */}
        <button
          type="submit"
          className={`bg-[#D6043C] text-white w-full py-2 rounded-sm mt-4 flex items-center justify-center ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent border-t-2 rounded-full animate-spin"></div>
          ) : (
            "Login"
          )}
        </button>
      </form>
      <SocialMediaLogin />
    </div>
  );
};

export default Login;
