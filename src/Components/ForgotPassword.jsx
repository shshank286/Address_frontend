import React, { useState } from "react";
import { TextField } from "@mui/material";
import AuthService from "../services/authService";


const ForgotPassword = ({onBackToLogin}) => {

  const [email,setEmail] = useState();


  const forgotePassword = () => {
    try {
      const response = AuthService.forgotePassword(email); 
      return response;
    } catch (error) {
      console.log("Failed to",error);
      
    }
  }

  return (
    <div className="w-full mt-[-3rem] sm:m-[-2rem]">
      <button
        className="text-sm text-gray-500 hover:text-gray-800 mb-4"
        onClick={onBackToLogin} 
      >
        ← Back to login
      </button>

      <h1 className="text-2xl font-semibold mb-3 mt-2">Forgot your password?</h1>

      {/* Description */}
      <p className="text-gray-600 text-xs sm:text-sm mb-4">
        Don’t worry, happens to all of us. Enter your email below to recover
        your password.
      </p>

      {/* Form */}
      <div>
        <div className="mb-4">
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          onClick={forgotePassword}
          className="w-full bg-[#D6043C] text-white py-2 px-4 rounded-md  focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
