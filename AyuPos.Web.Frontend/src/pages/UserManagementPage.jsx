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
  Checkbox,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  VisibilityOff as HideIcon,
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
    password: 'realPassword1',
    mobile: '+94 76 844 0179',
    role: 'Inventory Manager',
    status: 'Active',
  },
  {
    id: 2,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    password: 'realPassword1',
    mobile: '+94 76 844 0179',
    role: 'Compounder',
    status: 'Inactive',
  },
  {
    id: 3,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    password: 'realPassword1',
    mobile: '+94 76 844 0179',
    role: 'Compounder',
    status: 'Active',
  },
  {
    id: 4,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    password: 'realPassword1',
    mobile: '+94 76 844 0179',
    role: 'Cashier',
    status: 'Inactive',
  },
  {
    id: 5,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    password: 'realPassword1',
    mobile: '+94 76 844 0179',
    role: 'Inventory Manager',
    status: 'Active',
  },
  {
    id: 6,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    password: 'realPassword1',
    mobile: '+94 76 844 0179',
    role: 'Inventory Manager',
    status: 'Active',
  },
  {
    id: 7,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    password: 'realPassword1',
    mobile: '+94 76 844 0179',
    role: 'Compounder',
    status: 'Inactive',
  },
  {
    id: 8,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    password: 'realPassword1',
    mobile: '+94 76 844 0179',
    role: 'Compounder',
    status: 'Active',
  },
  {
    id: 9,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    password: 'realPassword1',
    mobile: '+94 76 844 0179',
    role: 'Cashier',
    status: 'Inactive',
  },
  {
    id: 10,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    password: 'realPassword1',
    mobile: '+94 76 844 0179',
    role: 'Inventory Manager',
    status: 'Active',
  },
  {
    id: 11,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    password: 'realPassword1',
    mobile: '+94 76 844 0179',
    role: 'Inventory Manager',
    status: 'Active',
  },
  {
    id: 12,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    password: 'realPassword1',
    mobile: '+94 76 844 0179',
    role: 'Compounder',
    status: 'Inactive',
  },
  {
    id: 13,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    password: 'realPassword1',
    mobile: '+94 76 844 0179',
    role: 'Compounder',
    status: 'Active',
  },
  {
    id: 14,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    password: 'realPassword1',
    mobile: '+94 76 844 0179',
    role: 'Cashier',
    status: 'Inactive',
  },
  {
    id: 15,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    password: 'realPassword1',
    mobile: '+94 76 844 0179',
    role: 'Inventory Manager',
    status: 'Active',
  },
  {
    id: 16,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    password: 'realPassword1',
    mobile: '+94 76 844 0179',
    role: 'Inventory Manager',
    status: 'Active',
  },
  {
    id: 17,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    password: 'realPassword1',
    mobile: '+94 76 844 0179',
    role: 'Compounder',
    status: 'Inactive',
  },
  {
    id: 18,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    password: 'realPassword1',
    mobile: '+94 76 844 0179',
    role: 'Compounder',
    status: 'Active',
  },
  {
    id: 19,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    password: 'realPassword1',
    mobile: '+94 76 844 0179',
    role: 'Cashier',
    status: 'Inactive',
  },
  {
    id: 20,
    firstName: 'First Name',
    lastName: 'Last Name',
    userNameId: 'Name+Num',
    password: 'realPassword1',
    mobile: '+94 76 844 0179',
    role: 'Inventory Manager',
    status: 'Active',
  },
];

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [showPasswords, setShowPasswords] = useState({});
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [addUserPopupOpen, setAddUserPopupOpen] = useState(false);
  const usersPerPage = 6;

  // API call
  useEffect(() => {
    setTimeout(() => {

      setUsers(mockUsers);
      setLoading(false);

      // userAPI.getUsers()
      //   .then((res) => setUsers(res.data))
      //   .catch((err) => console.error(err));

    }, 1000);
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const togglePasswordVisibility = (userId) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleStatusToggle = (userId) => {
    setUsers(prev => prev.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    ));
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleAddUser = () => {
    setAddUserPopupOpen(true);
  };

  const handleCloseAddUserPopup = () => {
    setAddUserPopupOpen(false);
  };

  const handleSaveNewUser = (newUserData) => {
    // Add the new user to the users list
    setUsers(prev => [newUserData, ...prev]);

    // You can also make an API call here to save to backend
    console.log('New user added:', newUserData);

    // Close the popup
    setAddUserPopupOpen(false);
  };

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userNameId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile.includes(searchTerm) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          mb: 3,
        }}
      >
        <TextField
          placeholder="Search user name, user id..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          sx={{
            minWidth: { xs: '100%', sm: 300, md: 400 },
            height: 45,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
              bgcolor: 'white',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              border: '1px solid #e5e7eb',
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover': {
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              },
              '&:hover fieldset': {
                borderColor: '#6366f1',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#6366f1',
                boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
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
            borderRadius: 1,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            whiteSpace: 'nowrap',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
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

      {/* Main Table Card */}
      <Card
        sx={{
          borderRadius: 1,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          width: '100%',
        }}
      >

        {/* Table Section */}
        <CardContent sx={{ p: 0 }}>
          <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
            <Table sx={{
              minWidth: 800,
              tableLayout: 'fixed',
              width: '100%'
            }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell
                    padding="checkbox"
                    sx={{
                      borderBottom: '1px solid #e5e7eb',
                      py: 2,
                      width: '60px',
                      minWidth: '60px',
                      maxWidth: '60px',
                    }}
                  >
                    <Checkbox
                      indeterminate={selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length}
                      checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                      onChange={handleSelectAll}
                      sx={{
                        color: '#6366f1',
                        '&.Mui-checked': {
                          color: '#6366f1',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb',
                    py: 2,
                    width: '180px',
                    minWidth: '180px',
                    maxWidth: '180px',
                  }}>
                    User Name
                  </TableCell>
                  <TableCell sx={{
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb',
                    py: 2,
                    width: '120px',
                    minWidth: '120px',
                    maxWidth: '120px',
                  }}>
                    User ID
                  </TableCell>
                  <TableCell sx={{
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb',
                    py: 2,
                    width: '140px',
                    minWidth: '140px',
                    maxWidth: '140px',
                  }}>
                    Password
                  </TableCell>
                  <TableCell sx={{
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb',
                    py: 2,
                    width: '140px',
                    minWidth: '140px',
                    maxWidth: '140px',
                  }}>
                    Mobile
                  </TableCell>
                  <TableCell sx={{
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb',
                    py: 2,
                    width: '160px',
                    minWidth: '160px',
                    maxWidth: '160px',
                  }}>
                    Role
                  </TableCell>
                  <TableCell sx={{
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb',
                    py: 2,
                    width: '120px',
                    minWidth: '120px',
                    maxWidth: '120px',
                  }}>
                    Status
                  </TableCell>
                  <TableCell sx={{
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb',
                    py: 2,
                    width: '80px',
                    minWidth: '80px',
                    maxWidth: '80px',
                    textAlign: 'center',
                  }}>
                    Edit
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
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
                        borderBottom: index === paginatedUsers.length - 1 ? 'none' : '1px solid #f3f4f6',
                      }}
                    >
                      <TableCell
                        padding="checkbox"
                        sx={{
                          py: 2,
                          width: '60px',
                          minWidth: '60px',
                          maxWidth: '60px',
                        }}
                      >
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          sx={{
                            color: '#6366f1',
                            '&.Mui-checked': {
                              color: '#6366f1',
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{
                        py: 2,
                        width: '180px',
                        minWidth: '180px',
                        maxWidth: '180px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
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
                          {user.firstName} {user.lastName}
                        </Typography>
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
                          {user.userNameId}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{
                        py: 2,
                        width: '140px',
                        minWidth: '140px',
                        maxWidth: '140px',
                      }}>
                        <Box sx={{
                          width: '140px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          overflow: 'hidden',
                        }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: 'monospace',
                              color: '#374151',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              flex: 1,
                              minWidth: 0,
                            }}
                          >
                            {showPasswords[user.id] ? user.password : '••••••••••'}
                          </Typography>
                          <Tooltip title={showPasswords[user.id] ? 'Hide password' : 'Show password'}>
                            <IconButton
                              size="small"
                              onClick={() => togglePasswordVisibility(user.id)}
                              sx={{
                                color: '#6b7280',
                                flexShrink: 0,
                                width: 24,
                                height: 24,
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
                              }}
                            >
                              {showPasswords[user.id] ? <HideIcon fontSize="small" /> : <ViewIcon fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                        </Box>
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
                        <Typography
                          variant="body2"
                          color="#374151"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {user.mobile}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{
                        py: 2,
                        width: '160px',
                        minWidth: '160px',
                        maxWidth: '160px',
                      }}>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            bgcolor: `${getRoleColor(user.role)}15`,
                            color: getRoleColor(user.role),
                            border: `1px solid ${getRoleColor(user.role)}30`,
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {user.role}
                        </Box>
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
                            checked={user.status === 'Active'}
                            onChange={() => handleStatusToggle(user.id)}
                            size="small"
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
                              color: user.status === 'Active' ? '#059669' : '#6b7280',
                              fontWeight: 500,
                              fontSize: '0.875rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              minWidth: 0,
                            }}
                          >
                            {user.status}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{
                        py: 2,
                        width: '80px',
                        minWidth: '80px',
                        maxWidth: '80px',
                        textAlign: 'center',
                      }}>
                        <Tooltip title="Edit user">
                          <IconButton
                            size="small"
                            sx={{
                              color: '#6366f1',
                              bgcolor: '#f0f0ff',
                              width: 32,
                              height: 32,
                              '&:hover': {
                                bgcolor: '#e0e0ff',
                              },
                              '&:focus': {
                                outline: 'none',
                                boxShadow: 'none',
                              },
                              '&:active': {
                                outline: 'none',
                                boxShadow: 'none',
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
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
              borderRadius: 1,
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              border: '1px solid #e5e7eb',
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
      />
    </Box>
  );
};

export default UserManagementPage;