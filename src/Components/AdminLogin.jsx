import React, { useState } from "react";
import loginImg from "../assets/images/loginimg.png";
import logo from "../assets/images/logo.png"; 
import { TextField } from "@mui/material";
import AuthService from "../services/authService";
import { useDispatch } from "react-redux";
import { login } from "../Context/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    try {
      const {
        userId,
        email: userEmail,
        token,
        name,
        profilePicture,
        phonenumber,
        gender,
        user_profile,
        user_role
      } = await AuthService.adminLoginApi(email, password);

      dispatch(
        login({
          userId,
          email: userEmail,
          token,
          name,
          phonenumber,
          gender,
          profilePicture,
          user_profile,
          adminToken: token
        })
      );

      localStorage.setItem("adminToken", token);
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("email", userEmail);

      // Navigate to the admin dashboard
      navigate("/admin-dashboard");

      return result;
    } catch (error) {
      toast.error(error?.response.data);
      setError(error?.response.data);
    }
  };

  const navigate = useNavigate();


  return (
    <div className="">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 overflow-y-hidden">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2">
          {/* Left Section */}
          <div className="p-8 lg:p-12">
            {/* Logo Section in Form */}
            <div className="flex justify-center mb-6">
              <img
                src={logo}
                alt="Company Logo"
              />
            </div>

            <h1 className="text-2xl mt-[5rem] text-center font-bold mb-4 text-gray-800">
              Admin Login
            </h1>

            <form className="space-y-6 mt-8">
              {/* Email Field */}
              <div>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  name="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  required
                />
              </div>
              {/* Password Field */}
              <div>
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  name="password"
                  type="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  required
                />
              </div>
              {error && (
                <div className="">
                  <span className="text-red-500">{error}</span>
                </div>
              )}

              {/* Login Button */}
              <button
                onClick={handleAdminLogin}
                type="submit"
                className="w-full py-2 px-4 bg-[#D6043C] text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Login
              </button>
            </form>
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center justify-center bg-white p-12">
            <img
              src={loginImg}
              alt="Secure login illustration"
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
