import React, { useEffect, useState } from "react";
import AuthService from "../services/authService";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPassword = ({onBackToLogin}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {token} = useParams();
  const navigate = useNavigate();

  console.log("token", token);

  const handleSubmit = (e) => {
    if (password === confirmPassword) {
      console.log("Password successfully reset!");
    } else {
      toast.error("Password");
      console.error("Passwords do not match!");
    }
  };

  const handleResetPassword = async(e) => {
    e.preventDefault();
    try {
      handleSubmit();
      const result = await AuthService.resetPassword(token,password);
      console.log("RESULT",result);
      toast.success("Password successfully reset!");
      navigate("/")
      
    } catch (error) {
      console.log("ERROR",error);
      
    }
    
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Reset Password
        </h2>
        <form onSubmit={handleResetPassword} className="space-y-6">
          {/* New Password Field */}
          <div>
            <label htmlFor="password" className="block text-gray-600 mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D6043C]"
              placeholder="Enter new password"
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-600 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D6043C]"
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#D6043C] text-white py-2 px-4 rounded-lg focus:outline-none"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
