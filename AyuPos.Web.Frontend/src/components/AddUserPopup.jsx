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

const AddUserPopup = ({ open, onClose, onSave, existingUsers = [] }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nic: '',
    mobile: '',
    role: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const roles = ['Inventory Manager', 'Compounder', 'Cashier'];

  // Generate next user ID in E001, E002 format
  const generateNextUserId = () => {
    if (!existingUsers || existingUsers.length === 0) {
      return 'E001';
    }

    // Extract numeric parts from existing user IDs
    const existingNumbers = existingUsers
      .map(user => {
        const userId = user.userId || user.userNameId || '';
        const match = userId.match(/^E(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(num => num > 0);

    // Find the highest number and add 1
    const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    const nextNumber = maxNumber + 1;

    // Format with leading zeros (E001, E002, etc.)
    return `E${nextNumber.toString().padStart(3, '0')}`;
  };

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

    if (!formData.nic.trim()) {
      newErrors.nic = 'NIC is required';
    } else if (!/^(\d{9}[VXvx]|\d{12})$/.test(formData.nic.replace(/\s/g, ''))) {
      newErrors.nic = 'Please enter a valid NIC (9 digits + V/X or 12 digits)';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\+94\s\d{9}$/.test(formData.mobile)) {
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
      const userId = generateNextUserId();
      const newUser = {
        id: Date.now(),
        userId: userId,
        personalData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          nic: formData.nic,
          phoneNumber: formData.mobile,
        },
        roles: [formData.role],
        deactivationStatus: false,
        password: formData.password,
        // For backward compatibility
        firstName: formData.firstName,
        lastName: formData.lastName,
        nic: formData.nic,
        phoneNumber: formData.mobile,
        role: formData.role,
        userNameId: userId,
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
      nic: '',
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

  const handleNicChange = (event) => {
    let value = event.target.value.toUpperCase();
    // Remove any spaces and limit to appropriate length
    value = value.replace(/\s/g, '');

    // Limit length based on format (9+1 for old format, 12 for new format)
    if (value.length <= 10 && /^\d{0,9}[VX]?$/.test(value)) {
      // Old format: 9 digits + V/X
      setFormData((prev) => ({ ...prev, nic: value }));
    } else if (value.length <= 12 && /^\d{0,12}$/.test(value)) {
      // New format: 12 digits
      setFormData((prev) => ({ ...prev, nic: value }));
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
                label="NIC"
                variant="outlined"
                value={formData.nic}
                onChange={handleNicChange}
                placeholder="123456789V or 123456789012"
                error={!!errors.nic}
                helperText={errors.nic}
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
              <TextField
                fullWidth
                size="small"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={formData.password}
                onChange={handleInputChange('password')}
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

            {/* <Box mt={0} ml={1}>
              <Typography variant="caption" sx={{ color: 'gray' }}>
                Password must be at least 8 characters long
              </Typography>
            </Box> */}

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
        </Grid>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            gap: 2,
            py: 3,
          }}
        >
          <Button variant="contained" onClick={handleSave} size="small" sx={{
            bgcolor: '#6366f1', width: '9rem', borderRadius: 0.5, '&:focus': {
              outline: 'none',
            },
            '&:active': {
              outline: 'none',
            },
          }}>
            Save
          </Button>
          <Button variant="contained" onClick={handleClose} size="small" sx={{
            bgcolor: '#aa0003',
            width: '9rem', borderRadius: 0.5, '&:focus': {
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