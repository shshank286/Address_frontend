import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import AuthService from '../services/authService'; 
import { useNavigate } from 'react-router-dom';

const OTPVerification = ({ handleSendOtp }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('OTP must be 6 digits.');
      return;
    }

    setLoading(true);

    try {
      const email = localStorage.getItem('email'); 
      if (!email) {
        setError('Email not found. Please register again.');
        setLoading(false);
        return;
      }

      
      const response = await AuthService.verifyOtp(email, otp);
      console.log('OTP Verified:', response);
      handleSendOtp();
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
      setLoading(false);
    }
  };

  const backToLogin = () => {
    handleSendOtp();
  }


  return (
    <div className="otp-verification-form  mt-[-2rem]">
      {/* Back to Login Button */}
      <button
        className="text-sm text-gray-500 hover:text-gray-800 mb-4"
        onClick={backToLogin}
      >
        ← Back to login
      </button>

      <h2 className='text-2xl font-poppins font-medium mt-2 mb-4'>Verify Code</h2>
      <p className='text-sm text-gray-500 mb-2 mt-2'>An authentication code has been sent to your email.</p>
      <form onSubmit={handleVerify} className="w-full h-36 flex flex-col gap-4">
        <TextField
          label="Enter Code"
          variant="outlined"
          fullWidth
          margin="normal"
          type="text"
          maxLength="6" 
          value={otp}
          className='mb-4'
          onChange={handleChange}
          required
        />

        {error && (
          <Typography color="error" variant="body2" align="center" className="mt-2">
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            backgroundColor: '#D6043C',
            '&:hover': {
              backgroundColor: '#b30330', 
            },
          }}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Button>
      </form>
    </div>
  );
};

export default OTPVerification;
