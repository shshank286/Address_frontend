import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../services/authService';

const Settings = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const email = localStorage.getItem('email');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validate new passwords match
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    try {
      await AuthService.updatePasswordAdmin(email, newPassword);

      toast.success('Password successfully updated.');
      setTimeout(() => {
        // After delay, navigate to admin dashboard
        navigate('/admin-dashboard/');
      }, 2000);

    } catch (error) {
      setError('An error occurred while updating the password.');
    }
  };

  return (
    <div className="bg-gray-50 py-4 sm:py-8">
      <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
        Change Password
      </Typography>

      <Box component="form" onSubmit={handlePasswordChange} sx={{ maxWidth: 400, margin: 'auto', padding: 3 }}>
        <Grid container spacing={2}>
          {/* Email/Username */}
          <Grid item xs={12}>
            <TextField
              label="Email or Username"
              type="text"
              fullWidth
              value={email}
              disabled
              required
              variant="outlined"
            />
          </Grid>

          {/* New Password */}
          <Grid item xs={12}>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              variant="outlined"
            />
          </Grid>

          {/* Confirm New Password */}
          <Grid item xs={12}>
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              variant="outlined"
            />
          </Grid>

          {/* Error and Success Messages */}
          {error && (
            <Grid item xs={12}>
              <Typography color="error" variant="body2" align="center">{error}</Typography>
            </Grid>
          )}
          {message && (
            <Grid item xs={12}>
              <Typography color="success" variant="body2" align="center">{message}</Typography>
            </Grid>
          )}

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#D6043C',
                '&:hover': { backgroundColor: '#a9032c' },
              }}
            >
              Change Password
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Settings;
