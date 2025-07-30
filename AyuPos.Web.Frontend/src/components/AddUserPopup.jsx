import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, WidthFull } from '@mui/icons-material';
import PopupLayout from '../layouts/PopupLayout';

const AddUserPopup = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    role: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  const roles = ['Inventory Manager', 'Compounder', 'Cashier'];

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\+94\s\d{2}\s\d{3}\s\d{4}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter valid mobile number (+94 XX XXX XXXX)';
    }

    if (!formData.role) newErrors.role = 'Role is required';

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const userNameId = `${formData.firstName.toLowerCase()}${Math.floor(Math.random() * 1000)}`;
      const newUser = {
        ...formData,
        userNameId,
        id: Date.now(),
        status: 'Active',
      };
      onSave(newUser);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      mobile: '',
      role: '',
      password: '',
      confirmPassword: '',
    });
    setErrors({});
    onClose();
  };

  const handleMobileChange = (event) => {
    let value = event.target.value;
    let digits = value.replace(/\D/g, '');

    if (digits.startsWith('94')) {
      digits = digits.slice(2);
    } else if (digits.startsWith('0')) {
      digits = digits.slice(1);
    }
    digits = digits.slice(0, 9);
    const formatted = `+94 ${digits}`;

    setFormData((prev) => ({ ...prev, mobile: formatted }));
  };

  const validatePasswordStrength = (password) => {
    setPasswordChecks({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handlePasswordChange = (field) => (event) => {
    const value = event.target.value;

    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === 'password') {
      validatePasswordStrength(value);
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };


  return (
    <PopupLayout open={open} onClose={handleClose} title="Add New User" maxWidth="md">
      <Box>
        <Typography variant="h5" component="h3" sx={{ fontWeight: 600, color: '#6366f1', mb: 1 }}>
          Welcome to BrandName!
        </Typography>
        <Typography variant="body2" sx={{ color: '#6b7280', mb: 4 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        </Typography>

        <Grid container spacing={2} fullWidth>

          <Grid item xs={12} sm={6} sx={{ width: '49%' }}>
            <TextField
              fullWidth
              size="small"
              label="First Name"
              variant="outlined"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName}
              InputLabelProps={{
                sx: {
                  fontSize: '0.8rem',
                  pt: 0.2,
                },
              }}
            />

            <Box mt={3}>
              <TextField
                fullWidth
                size="small"
                label="Mobile Number"
                variant="outlined"
                value={formData.mobile}
                onChange={handleMobileChange}
                placeholder="+94 XX XXX XXXX"
                error={!!errors.mobile}
                helperText={errors.mobile}
                InputLabelProps={{
                  sx: {
                    fontSize: '0.8rem',
                    pt: 0.2,
                  },
                }}
              />
            </Box>

            <Box mt={3}>
              <TextField
                fullWidth
                size="small"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={formData.password}
                onChange={handlePasswordChange('password')}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end"
                        sx={{
                          '&:focus': {
                            outline: 'none',
                          },
                          '&:active': {
                            outline: 'none',
                          },
                        }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  sx: {
                    fontSize: '0.8rem',
                    pt: 0.2,
                  },
                }}
              />
            </Box>

            <Box mt={3}>
              <TextField
                fullWidth
                size="small"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                variant="outlined"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end"
                        sx={{
                          '&:focus': {
                            outline: 'none',
                          },
                          '&:active': {
                            outline: 'none',
                          },
                        }}>
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  sx: {
                    fontSize: '0.8rem',
                    pt: 0.2,
                  },
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ width: '49%' }}>
            <TextField
              fullWidth
              size="small"
              label="Last Name"
              variant="outlined"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName}
              InputLabelProps={{
                sx: {
                  fontSize: '0.8rem',
                  pt: 0.2,
                },
              }}
            />

            <Box mt={3}>
              <FormControl fullWidth size="small" error={!!errors.role}>
                <InputLabel sx={{
                  fontSize: '0.8rem',
                  pt: 0.2,
                }}>
                  Role
                </InputLabel>
                <Select
                  value={formData.role}
                  onChange={handleInputChange('role')}
                  label="Role"
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
                {errors.role && (
                  <Typography
                    variant="caption"
                    sx={{ color: '#d32f2f', fontSize: '0.75rem', mt: 0.5 }}
                  >
                    {errors.role}
                  </Typography>
                )}
              </FormControl>
            </Box>

            <Box mt={3.5} ml={1} display="flex" flexWrap="wrap" gap={1}>
              {!passwordChecks.length && (
                <Typography variant="caption" sx={{ color: 'gray' }}>• At least 8 characters</Typography>
              )}
              {!passwordChecks.upper && (
                <Typography variant="caption" sx={{ color: 'gray' }}>• One uppercase (A–Z)</Typography>
              )}
              {!passwordChecks.lower && (
                <Typography variant="caption" sx={{ color: 'gray' }}>• One lowercase (a–z)</Typography>
              )}
              {!passwordChecks.number && (
                <Typography variant="caption" sx={{ color: 'gray' }}>• One number (0–9)</Typography>
              )}
              {!passwordChecks.special && (
                <Typography variant="caption" sx={{ color: 'gray' }}>• One special (!@#$...)</Typography>
              )}
            </Box>
            
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            gap: 2,
            mt: 4,
            pt: 3,
            pb: 6,
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <Button variant="contained" onClick={handleSave} size="small" sx={{
            bgcolor: '#6366f1', width: '9rem', '&:focus': {
              outline: 'none',
            },
            '&:active': {
              outline: 'none',
            },
          }}>
            Save
          </Button>
          <Button variant="outlined" onClick={handleClose} size="small" sx={{
            width: '9rem', '&:focus': {
              outline: 'none',
            },
            '&:active': {
              outline: 'none',
            },
          }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </PopupLayout>
  );
};

export default AddUserPopup;
