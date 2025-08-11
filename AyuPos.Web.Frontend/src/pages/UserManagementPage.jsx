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

const ROLE_OPTIONS = ['Inventory Manager', 'Compounder', 'Cashier'];

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [editingUsers, setEditingUsers] = useState({});
  const [editFormData, setEditFormData] = useState({});
  const [addUserPopupOpen, setAddUserPopupOpen] = useState(false);
  const [roleUpdatingUsers, setRoleUpdatingUsers] = useState({}); 
  const usersPerPage = 7;

  useEffect(() => {
    setTimeout(() => {
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
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const toggleData = {
        isDeactivate: !user.deactivationStatus 
      };

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
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setRoleUpdatingUsers(prev => ({ ...prev, [userId]: true }));

      const roleUpdateData = {
        roles: [newRole]
      };

      await userAPI.updateUserRole(userId, roleUpdateData);

      // Update the local state
      setUsers(prev => prev.map(user =>
        user.id === userId
          ? {
            ...user,
            roles: [newRole], 
            role: newRole, 
          }
          : user
      ));

      console.log('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setRoleUpdatingUsers(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
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

      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        nic: formData.nic,
        phoneNumber: formData.mobile,
      };

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
      toast.success('Error updating user details');
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
    console.log('Password reset for user:', userId);
  };

  const handleAddUser = () => {
    setAddUserPopupOpen(true);
  };

  const handleCloseAddUserPopup = () => {
    setAddUserPopupOpen(false);
  };

const handleSaveNewUser = async (newUserData) => {
  try {
    const response = await userAPI.createUser(newUserData);
    setUsers(prev => [newUserData, ...prev]);
    userAPI.getUsers();
    setAddUserPopupOpen(false);
    
    console.log('New user created successfully:', response.data);
    toast.success('User created successfully');
    
  } catch (error) {
    console.error('Error creating user:', error);
    toast.error('Failed to create user');
    setAddUserPopupOpen(true);
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
                        {/* Role is now always a dropdown, independent of edit mode */}
                        <FormControl size="small" sx={{ width: '150px' }}>
                          <Select
                            value={user.roles?.[0] || user.role || ''}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            disabled={roleUpdatingUsers[user.id]} // Disable while updating
                            sx={{
                              fontSize: '0.875rem',
                              '& .MuiSelect-select': {
                                py: 1,
                                bgcolor: `${getRoleColor(user.roles?.[0] || user.role)}08`,
                                color: getRoleColor(user.roles?.[0] || user.role),
                                fontWeight: 500,
                                border: `1px solid ${getRoleColor(user.roles?.[0] || user.role)}30`,
                                borderRadius: 1,
                              },
                              '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                border: `1px solid ${getRoleColor(user.roles?.[0] || user.role)}`,
                              },
                            }}
                          >
                            {ROLE_OPTIONS.map((role) => (
                              <MenuItem key={role} value={role}>
                                {role}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
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