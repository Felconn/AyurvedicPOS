import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Pagination,
  InputAdornment,
  Switch,
  Tooltip,
  Avatar,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  LockReset as PasswordResetIcon,
} from '@mui/icons-material';
import { userAPI } from '../api/index';
import AddUserPopup from '../components/AddUserPopup';

// Mock data - replace with actual API calls
const mockUsers = [
  {
    id: 1,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    nic: '12345678912V',
    mobile: '+94 76 844 0179',
    role: 'Inventory Manager',
    status: 'Active',
  },
  {
    id: 2,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    nic: '987654321V',
    mobile: '+94 76 844 0179',
    role: 'Compounder',
    status: 'Inactive',
  },
  {
    id: 3,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    nic: '123456789V',
    mobile: '+94 76 844 0179',
    role: 'Inventory Manager',
    status: 'Active',
  },
  {
    id: 4,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    nic: '987654321V',
    mobile: '+94 76 844 0179',
    role: 'Compounder',
    status: 'Inactive',
  },
  {
    id: 5,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    nic: '12345678912V',
    mobile: '+94 76 844 0179',
    role: 'Inventory Manager',
    status: 'Active',
  },
  {
    id: 6,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    nic: '987654321V',
    mobile: '+94 76 844 0179',
    role: 'Compounder',
    status: 'Inactive',
  },
  {
    id: 7,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    nic: '123456789V',
    mobile: '+94 76 844 0179',
    role: 'Inventory Manager',
    status: 'Active',
  },
  {
    id: 8,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    nic: '987654321V',
    mobile: '+94 76 844 0179',
    role: 'Compounder',
    status: 'Inactive',
  },
];

const ROLE_OPTIONS = ['Inventory Manager', 'Compounder', 'Cashier'];

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [editingUsers, setEditingUsers] = useState({});
  const [editFormData, setEditFormData] = useState({});
  const [addUserPopupOpen, setAddUserPopupOpen] = useState(false);
  const usersPerPage = 7;

  // API call
  useEffect(() => {
    setTimeout(() => {
      // setUsers(mockUsers);
      setLoading(false);

      userAPI.getUsers()
        .then((res) => setUsers(res.data))
        .catch((err) => console.error(err));
    }, 1000);
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleStatusToggle = async (userId) => {
    try {
      // Find the current user
      const user = users.find(u => u.id === userId);
      if (!user) return;

      // Prepare the toggle data
      const toggleData = {
        isDeactivate: !user.deactivationStatus // Toggle the current status
      };

      // Call the API
      await userAPI.updateUserStatus(userId, toggleData);

      // Update the local state
      setUsers(prev => prev.map(u =>
        u.id === userId
          ? { ...u, deactivationStatus: toggleData.isDeactivate }
          : u
      ));

      console.log('User status updated successfully');
    } catch (error) {
      console.error('Error updating user status:', error);
      // You might want to show a toast notification here
    }
  };

  const handleEditUser = (user) => {
    setEditingUsers(prev => ({ ...prev, [user.id]: true }));
    setEditFormData(prev => ({
      ...prev,
      [user.id]: {
        firstName: user.personalData?.firstName || user.firstName,
        lastName: user.personalData?.lastName || user.lastName,
        mobile: user.personalData?.phoneNumber || user.mobile,
        nic: user.personalData?.nic || user.nic,
        role: user.roles?.[0] || user.role,
      }
    }));
  };

  const handleCancelEdit = (userId) => {
    setEditingUsers(prev => {
      const updated = { ...prev };
      delete updated[userId];
      return updated;
    });
    setEditFormData(prev => {
      const updated = { ...prev };
      delete updated[userId];
      return updated;
    });
  };

  const handleSaveEdit = async (userId) => {
    try {
      const formData = editFormData[userId];

      // Prepare the update data in the correct format
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        nic: formData.nic,
        phoneNumber: formData.mobile,
        // Note: The role update might need to be handled separately if it's not part of this endpoint
      };

      // Call the API to update user details
      await userAPI.updateUser(userId, updateData);

      // Update the local state
      setUsers(prev => prev.map(user =>
        user.id === userId
          ? {
            ...user,
            personalData: {
              ...user.personalData,
              firstName: formData.firstName,
              lastName: formData.lastName,
              phoneNumber: formData.mobile,
              nic: formData.nic,
            },
            // For backward compatibility with mock data
            firstName: formData.firstName,
            lastName: formData.lastName,
            mobile: formData.mobile,
            nic: formData.nic,
          }
          : user
      ));

      handleCancelEdit(userId);
      console.log('User details updated successfully');
    } catch (error) {
      console.error('Error updating user details:', error);
      // You might want to show a toast notification here
    }
  };

  const handleFieldChange = (userId, field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value
      }
    }));
  };

  const handlePasswordReset = (userId) => {
    // Handle password reset logic here
    console.log('Password reset for user:', userId);
    // You can show a confirmation dialog or directly call an API
  };

  const handleAddUser = () => {
    setAddUserPopupOpen(true);
  };

  const handleCloseAddUserPopup = () => {
    setAddUserPopupOpen(false);
  };

const handleSaveNewUser = async (newUserData) => {
  try {
    // Make API call to create the new user
    const response = await userAPI.createUser(newUserData);

    console.log('New user data:', newUserData);
    
    // If the API call is successful, add the new user to the local state
    // Use response.data if the API returns the created user object
    setUsers(prev => [newUserData, ...prev]);
    userAPI.getUsers();
    
    // Close the popup
    setAddUserPopupOpen(false);
    
    // Optional: Show success message
    console.log('New user created successfully:', response.data);
    
    // You might want to add a toast notification here:
    // toast.success('User created successfully');
    
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Optional: Show error message
    // toast.error('Failed to create user');
    
    // You might want to keep the popup open if creation fails
    // setAddUserPopupOpen(true);
  }
};

  const filteredUsers = users.filter(user => {
    const firstName = user.personalData?.firstName || user.firstName || '';
    const lastName = user.personalData?.lastName || user.lastName || '';
    const userId = user.userId || user.userNameId || '';
    const phoneNumber = user.personalData?.phoneNumber || user.mobile || '';
    const role = user.roles?.[0] || user.role || '';
    const nic = user.personalData?.nic || user.nic || '';

    return `${firstName} ${lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phoneNumber.includes(searchTerm) ||
      role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nic.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * usersPerPage,
    page * usersPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getRoleColor = (role) => {
    switch (role) {
      case 'Inventory Manager':
        return '#6366f1';
      case 'Compounder':
        return '#8b5cf6';
      case 'Cashier':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Page Header */}
      <Box sx={{ mb: 3, width: '100%' }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: '#1f2937',
            fontSize: { xs: '1.5rem', sm: '2rem' },
          }}
        >
          User List
        </Typography>
      </Box>

      {/* Search and Add Button Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          mb: 4,
        }}
      >
        <TextField
          placeholder="Search user name, user id, NIC..."

          size="small"
          value={searchTerm}
          onChange={handleSearch}
          sx={{
            border: 'none',
            minWidth: { xs: '100%', sm: 300, md: 400 },
            height: 45,
            '& .MuiOutlinedInput-root': {
              borderRadius: 0.5,
              bgcolor: 'white',
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                border: 'none'
              },
              '&.Mui-focused fieldset': {
                border: 'none',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#6b7280' }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
          onClick={handleAddUser}
          sx={{
            height: 43,
            bgcolor: '#6366f1',
            color: 'white',
            borderRadius: 0.5,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            whiteSpace: 'nowrap',
            '&:hover': {
              bgcolor: '#5855eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
            '&:focus': {
              outline: 'none',
            },
            '&:active': {
              outline: 'none',
            },
          }}
        >
          Add New User
        </Button>
      </Box>

      {/* Table Header Card */}
      <Card
        sx={{
          borderRadius: 0.5,
          overflow: 'hidden',
          width: '100%',
          mb: 2,
          boxShadow: 'none',
        }}
      >
        <TableContainer sx={{ width: '100%', overflowX: 'auto', mb: -0.1 }}>
          <Table sx={{
            minWidth: 800,
            tableLayout: 'fixed',
            width: '100%',
          }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#ffffffff' }}>
                <TableCell sx={{
                  fontWeight: 600,
                  color: '#374151',
                  width: '180px',
                  minWidth: '180px',
                  maxWidth: '180px',
                }}>
                  User Name
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: '#374151',
                  width: '120px',
                  minWidth: '120px',
                  maxWidth: '120px',
                }}>
                  User ID
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: '#374151',
                  width: '140px',
                  minWidth: '140px',
                  maxWidth: '140px',
                }}>
                  NIC
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: '#374151',
                  width: '140px',
                  minWidth: '140px',
                  maxWidth: '140px',
                }}>
                  Mobile
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: '#374151',
                  width: '160px',
                  minWidth: '160px',
                  maxWidth: '160px',
                }}>
                  Role
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: '#374151',
                  width: '120px',
                  minWidth: '120px',
                  maxWidth: '120px',
                }}>
                  Status
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: '#374151',
                  width: '120px',
                  minWidth: '120px',
                  maxWidth: '120px',
                  textAlign: 'center',
                }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </Card>

      {/* Table Body Card */}
      <Card
        sx={{
          borderRadius: 0.5,
          overflow: 'hidden',
          width: '100%',
          boxShadow: 'none',
          mb: -1,
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
            <Table sx={{
              minWidth: 800,
              tableLayout: 'fixed',
              width: '100%',
            }}>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user, index) => (
                    <TableRow
                      key={user.id}
                      hover
                      sx={{
                        '&:hover': {
                          bgcolor: '#f9fafb',
                        },
                        '& .MuiTableCell-root': {
                          borderBottom: index === paginatedUsers.length - 1 ? 'none' : '1px solid #f3f4f6',
                          px: 2,
                        },
                      }}
                    >
                      <TableCell sx={{
                        py: 2,
                        width: '180px',
                        minWidth: '180px',
                        maxWidth: '180px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {editingUsers[user.id] ? (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                              size="small"
                              value={editFormData[user.id]?.firstName || ''}
                              onChange={(e) => handleFieldChange(user.id, 'firstName', e.target.value)}
                              sx={{ width: '130px' }}
                            />
                            <TextField
                              size="small"
                              value={editFormData[user.id]?.lastName || ''}
                              onChange={(e) => handleFieldChange(user.id, 'lastName', e.target.value)}
                              sx={{ width: '130px' }}
                            />
                          </Box>
                        ) : (
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            color="#374151"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {user.personalData?.firstName || user.firstName} {user.personalData?.lastName || user.lastName}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{
                        py: 2,
                        width: '120px',
                        minWidth: '120px',
                        maxWidth: '120px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        <Typography
                          variant="body2"
                          color="#6b7280"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {user.userId || user.userNameId}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{
                        py: 2,
                        width: '140px',
                        minWidth: '140px',
                        maxWidth: '140px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {editingUsers[user.id] ? (
                          <TextField
                            size="small"
                            value={editFormData[user.id]?.nic || ''}
                            onChange={(e) => handleFieldChange(user.id, 'nic', e.target.value)}
                            sx={{ width: '140px' }}
                          />
                        ) : (
                          <Typography
                            variant="body2"
                            color="#374151"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {user.personalData?.nic || user.nic}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{
                        py: 2,
                        width: '140px',
                        minWidth: '140px',
                        maxWidth: '140px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {editingUsers[user.id] ? (
                          <TextField
                            size="small"
                            value={editFormData[user.id]?.mobile || ''}
                            onChange={(e) => handleFieldChange(user.id, 'mobile', e.target.value)}
                            sx={{ width: '150px' }}
                          />
                        ) : (
                          <Typography
                            variant="body2"
                            color="#374151"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {user.personalData?.phoneNumber || user.mobile}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{
                        py: 2,
                        width: '160px',
                        minWidth: '160px',
                        maxWidth: '160px',
                      }}>
                        {editingUsers[user.id] ? (
                          <FormControl size="small" sx={{ width: '180px' }}>
                            <Select
                              value={editFormData[user.id]?.role || ''}
                              onChange={(e) => handleFieldChange(user.id, 'role', e.target.value)}
                            >
                              {ROLE_OPTIONS.map((role) => (
                                <MenuItem key={role} value={role}>
                                  {role}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : (
                          <Box
                            sx={{
                              display: 'inline-flex',
                              px: 2,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              bgcolor: `${getRoleColor(user.roles?.[0] || user.role)}15`,
                              color: getRoleColor(user.roles?.[0] || user.role),
                              border: `1px solid ${getRoleColor(user.roles?.[0] || user.role)}30`,
                              maxWidth: '100%',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {user.roles?.[0] || user.role}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell sx={{
                        py: 2,
                        width: '120px',
                        minWidth: '120px',
                        maxWidth: '120px',
                      }}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          overflow: 'hidden',
                        }}>
                          <Switch
                            checked={!user.deactivationStatus}
                            onChange={() => handleStatusToggle(user.id)}
                            size="small"
                            disabled={editingUsers[user.id]}
                            sx={{
                              flexShrink: 0,
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#6366f1',
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#6366f1',
                              },
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: user.deactivationStatus ? '#6b7280' : '#059669',
                              fontWeight: 500,
                              fontSize: '0.875rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              minWidth: 0,
                            }}
                          >
                            {user.deactivationStatus ? 'Inactive' : 'Active'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{
                        py: 2,
                        width: '120px',
                        minWidth: '120px',
                        maxWidth: '120px',
                        textAlign: 'center',
                      }}>
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          {editingUsers[user.id] ? (
                            <>
                              <Tooltip title="Save changes">
                                <IconButton
                                  size="small"
                                  onClick={() => handleSaveEdit(user.id)}
                                  sx={{
                                    color: '#059669',
                                    bgcolor: '#ecfdf5',
                                    width: 28,
                                    height: 28,
                                    '&:hover': {
                                      bgcolor: '#d1fae5',
                                    },
                                  }}
                                >
                                  <SaveIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Cancel">
                                <IconButton
                                  size="small"
                                  onClick={() => handleCancelEdit(user.id)}
                                  sx={{
                                    color: '#dc2626',
                                    bgcolor: '#fef2f2',
                                    width: 28,
                                    height: 28,
                                    '&:hover': {
                                      bgcolor: '#fee2e2',
                                    },
                                  }}
                                >
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            <>
                              <Tooltip title="Edit user">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditUser(user)}
                                  sx={{
                                    color: '#6366f1',
                                    bgcolor: '#f0f0ff',
                                    width: 28,
                                    height: 28,
                                    '&:hover': {
                                      bgcolor: '#e0e0ff',
                                    },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reset password">
                                <IconButton
                                  size="small"
                                  onClick={() => handlePasswordReset(user.id)}
                                  sx={{
                                    color: '#f59e0b',
                                    bgcolor: '#fffbeb',
                                    width: 28,
                                    height: 28,
                                    '&:hover': {
                                      bgcolor: '#fef3c7',
                                    },
                                  }}
                                >
                                  <PasswordResetIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Pagination */}
      {!loading && filteredUsers.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center',
            py: 3,
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            size="small"
            showFirstButton
            showLastButton
            siblingCount={0}
            boundaryCount={1}
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#6b7280',
                '&.Mui-selected': {
                  bgcolor: '#6366f1',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#5855eb',
                  },
                },
                '&:hover': {
                  bgcolor: '#f3f4f6',
                },
                '&:focus': {
                  outline: 'none',
                  boxShadow: 'none',
                },
                '&:active': {
                  outline: 'none',
                  boxShadow: 'none',
                },
              },
              bgcolor: 'white',
              borderRadius: 0.5,
              p: 0.6,
            }}
          />
        </Box>
      )}

      {/* Add User Popup */}
      <AddUserPopup
        open={addUserPopupOpen}
        onClose={handleCloseAddUserPopup}
        onSave={handleSaveNewUser}
        existingUsers={users} // Add this line
      />
    </Box>
  );
};

export default UserManagementPage;