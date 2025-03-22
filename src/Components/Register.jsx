import React, { useState } from 'react';
import { TextField, Typography, MenuItem, Select, InputLabel, FormControl, Link } from '@mui/material';
import SocialMediaLogin from './SocialMediaLogin';
import AuthService from '../services/authService';
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import '../Components/css/DatePicker.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from 'react-hot-toast';
import CircularProgress from '@mui/material/CircularProgress';

const Register = ({ onRegisterSuccess }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [phonenumber, setMobileNumber] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  localStorage.setItem("restEmail", email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      toast.error('Passwords do not match');
      return;
    }

    try {
      const data = await AuthService.register(firstname, lastname, email, phonenumber, gender, dateOfBirth, password);
      console.log('Register success:', data);
      localStorage.setItem('email', email);

      onRegisterSuccess();
    } catch (err) {

      if (err instanceof Error) {

        if (err.message === "OTP already sent. Please check your email.") {
          onRegisterSuccess();
        }

        setError('Registration failed. Please try again.');
      } else {

        toast.error('An unknown error occurred. Please try again.');
        setError('Registration failed. Please try again.');
      }

      console.error("Error during registration:", err);
    }finally {
      setLoading(false);
    }

  };

  const handleAgreeToTermsChange = (e) => {
    setAgreeToTerms(e.target.checked);
    setIsButtonDisabled(!e.target.checked);
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setDateOfBirth(value);


  };

  return (

    <div className="register-form">
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
        <div className="flex flex-col md:flex-row gap-4">
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            name="firstname"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "40px",
                fontSize: "0.9rem",
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.85rem",
                transform: "translate(10px, 13px)",
              },
              "& .MuiInputLabel-shrink": {
                transform: "translate(10px, -5px)",
                fontSize: "0.75rem",
              },
              "& .MuiOutlinedInput-input": {
                padding: "6px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ccc",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#000",
              },
            }}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            name="lastname"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "40px",
                fontSize: "0.9rem",
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.85rem",
                transform: "translate(10px, 13px)",
              },
              "& .MuiInputLabel-shrink": {
                transform: "translate(10px, -5px)",
                fontSize: "0.75rem",
              },
              "& .MuiOutlinedInput-input": {
                padding: "6px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ccc",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#000",
              },
            }}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "40px",
                fontSize: "0.9rem",
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.85rem",
                transform: "translate(10px, 13px)",
              },
              "& .MuiInputLabel-shrink": {
                transform: "translate(10px, -5px)",
                fontSize: "0.75rem",
              },
              "& .MuiOutlinedInput-input": {
                padding: "6px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ccc",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#000",
              },
            }}
          />
          <TextField
            label="Mobile Number"
            variant="outlined"
            fullWidth
            name="phonenumber"
            value={phonenumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required

            inputProps={{
              maxLength: 10,
              pattern: "[0-9]{10}",
            }}

            sx={{
              "& .MuiOutlinedInput-root": {
                height: "40px",
                fontSize: "0.9rem",

              },
              "& .MuiInputLabel-root": {
                fontSize: "0.85rem",
                transform: "translate(10px, 13px)",
              },
              "& .MuiInputLabel-shrink": {
                transform: "translate(10px, -5px)",
                fontSize: "0.75rem",
              },
              "& .MuiOutlinedInput-input": {
                padding: "6px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ccc",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#000",
              },
            }}
          />
        </div>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="Date of Birth"
            inputFormat="DD-MM-YYYY"
            className='font-poppins '
            value={dateOfBirth ? dayjs(dateOfBirth) : null}
            onChange={(newValue) => {
              const formattedDate = dayjs(newValue).format("YYYY-MM-DD");
              handleDateChange({ target: { name: "dateOfBirth", value: formattedDate } });
            }}
            sx={{
              '.MuiPaper-root': {
                backgroundColor: '#f0f0f0',
                padding: '10px'
              },
              '.MuiButtonBase-root': {
                color: '#007bff',
                height: '5px',
              },
              '.MuiInputBase-root': {
                height: '35px',
                paddingTop: '23px',
                paddingBottom: '23px',
              },
              '.MuiOutlinedInput-input': {
                fontSize: '0.6rem',
              },
              ".MuiOutlinedInput-input": {
                padding: "12px",
                fontSize: '.7rem',
              },
              '.MuiInputLabel-root': {
                fontSize: '0.8rem',
              },

            }}

            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                fullWidth
                required
                className="custom-textfield"
                size="small"

              />
            )}
            renderDay={(day, selectedDate, isInCurrentMonth, dayComponent) => {
              return React.cloneElement(dayComponent, {
                sx: {
                  backgroundColor: isInCurrentMonth ? "#e0e0e0" : "transparent",
                  color: isInCurrentMonth ? "black" : "#9e9e9e",
                  fontSize: "0.6rem",
                  "&:hover": {
                    backgroundColor: "#bdbdbd",
                  },
                },
              });
            }}
            disableFuture
          />

        </LocalizationProvider>

        <div className="flex gap-4">


          <FormControl fullWidth required>
            <InputLabel
              sx={{
                fontSize: "0.85rem",
              }}
            >
              Gender
            </InputLabel>
            <Select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              label="Gender"
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                  fontSize: "0.9rem",
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.85rem",
                  transform: "translate(10px, 13px)",
                },
                "& .MuiInputLabel-shrink": {
                  transform: "translate(10px, -5px)",
                  fontSize: "0.75rem",
                },
                "& .MuiOutlinedInput-input": {
                  padding: "12px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ccc",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#000",
                },
              }}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </div>


        <div className="relative">
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type={showPassword ? "text" : "password"} // Toggle type
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "40px",
                fontSize: "0.9rem",
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.85rem",
                transform: "translate(10px, 13px)",
              },
              "& .MuiInputLabel-shrink": {
                transform: "translate(10px, -5px)",
                fontSize: "0.75rem",
              },
              "& .MuiOutlinedInput-input": {
                padding: "6px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ccc",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#000",
              },
            }}
          />
          <div
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        <div className="relative">
          <TextField
            label="Confirm Password"
            variant="outlined"
            fullWidth
            type={showConfirmPassword ? "text" : "password"} // Toggle type
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError("");
            }}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "40px",
                fontSize: "0.9rem",
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.85rem",
                transform: "translate(10px, 13px)",
              },
              "& .MuiInputLabel-shrink": {
                transform: "translate(10px, -5px)",
                fontSize: "0.75rem",
              },
              "& .MuiOutlinedInput-input": {
                padding: "6px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ccc",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#000",
              },
            }}
          />
          <div
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle password visibility
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 mb-2">
          <input
            type="checkbox"
            name="chk"
            id="chk"
            checked={agreeToTerms}
            onChange={handleAgreeToTermsChange}
          />
          <p className="text-xs sm:text-sm">
            I agree to all the <span className="text-[#D6043C]">Terms</span> and{' '}
            <span className="text-[#D6043C]">Privacy Policies</span>
          </p>
        </div>

        <button
          type="submit"
          className={`bg-[#D6043C] text-white w-full py-2 rounded-sm ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isButtonDisabled || loading}  
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <SocialMediaLogin />
    </div>
  );
};

export default Register;
