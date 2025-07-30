import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  TrendingUp as SalesIcon,
  Inventory as ProductsIcon,
  Category as InventoryIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess,
  ExpandMore,
  People as PeopleIcon,
  Store as StoreIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Add as AddIcon,
  List as ListIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const drawerWidthExpanded = 280;
const drawerWidthCollapsed = 80;

const menuItems = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
  },
  {
    text: 'Sales',
    icon: <SalesIcon />,
    path: '/sales',
  },
  {
    text: 'Products',
    icon: <ProductsIcon />,
    path: '/products',
    hasSubItems: true,
    subItems: [
      {
        text: 'Add Product',
        icon: <AddIcon />,
        path: '/products',
      },
      {
        text: 'Product List',
        icon: <ListIcon />,
        path: '/products',
      },
    ],
  },
  {
    text: 'Inventory',
    icon: <InventoryIcon />,
    path: '/inventory',
  },
  {
    text: 'Reports',
    icon: <ReportsIcon />,
    path: '/reports',
  },
  {
    text: 'Settings',
    icon: <SettingsIcon />,
    path: '/settings',
    hasSubItems: true,
    subItems: [
      {
        text: 'User Management',
        icon: <PeopleIcon />,
        path: '/settings/users',
      },
      {
        text: 'Store Information',
        icon: <StoreIcon />,
        path: '/settings/store',
      },
    ],
  },
];

const DashboardLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [productsExpanded, setProductsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const currentDrawerWidth = sidebarExpanded ? drawerWidthExpanded : drawerWidthCollapsed;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleProfileMenuClose();
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleSettingsToggle = () => {
    if (sidebarExpanded) {
      setSettingsExpanded(!settingsExpanded);
    } else {
      setSidebarExpanded(true);
      setSettingsExpanded(true);
    }
  };

  const handleProductsToggle = () => {
    if (sidebarExpanded) {
      setProductsExpanded(!productsExpanded);
    } else {
      setSidebarExpanded(true);
      setProductsExpanded(true);
    }
  };

  const isSettingsActive = location.pathname.startsWith('/settings');
  const isProductsActive = location.pathname.startsWith('/products');

  const SidebarContent = ({ isTemporary = false }) => (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden', 
    }}>
      {/* Sidebar Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          p: 2,
          top: 50,
          zIndex: 1,
          bgcolor: 'white',
          color: 'primary.main',
          minHeight: 64,
          maxHeight: 64,
          overflow: 'hidden',
        }}
      >
        {/* Avatar */}
        <Avatar
          sx={{
            width: 50,
            height: 50,
            bgcolor: 'primary.main',
            fontSize: '1.6rem',
            fontWeight: 'bold',
            flexShrink: 0,
            position: sidebarExpanded ? 'static' : 'absolute',
            left: sidebarExpanded ? 'auto' : '50%',
            transform: sidebarExpanded ? 'none' : 'translateX(-50%)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 1,
          }}
        >
          B
        </Avatar>

        {/* Brand Name */}
        <Typography 
          variant="h6" 
          component="div" 
          fontWeight={600} 
          fontSize="1.5rem"
          sx={{
            ml: sidebarExpanded ? 2 : 0,
            opacity: sidebarExpanded ? 1 : 0,
            transform: sidebarExpanded ? 'translateX(0)' : 'translateX(-20px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            visibility: sidebarExpanded ? 'visible' : 'hidden',
          }}
        >
          BrandName
        </Typography>

        {/* Toggle Button */}
        {!isTemporary && !isMobile && (
          <IconButton
            onClick={handleSidebarToggle}
            sx={{
              position: 'absolute',
              right: sidebarExpanded ? 10 : -10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'primary.main',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              width: 32,
              height: 32,
              opacity: sidebarExpanded ? 1 : 0.8,
              '&:hover': {
                bgcolor: 'rgba(99, 102, 241, 0.08)',
                opacity: 1,
              },
              '&:focus': {
                outline: 'none',
              },
              '&:active': {
                outline: 'none',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {sidebarExpanded ? 
              <ChevronLeftIcon fontSize="small" /> : 
              <ChevronRightIcon fontSize="small" />
            }
          </IconButton>
        )}
      </Box>

      {/* Navigation Menu */}
      <List sx={{ 
        px: sidebarExpanded ? 2 : 2, 
        py: 2, 
        flexGrow: 1, 
        pt: 20,
        transition: 'padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
      }}>
        {menuItems.map((item) => {
          const isActive = item.hasSubItems ? 
            (item.text === 'Settings' ? isSettingsActive : isProductsActive) : 
            location.pathname === item.path;
          const isExpanded = item.text === 'Settings' ? settingsExpanded : productsExpanded;
          
          return (
            <Box key={item.text}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <Tooltip title={!sidebarExpanded ? item.text : ''} placement="right">
                  <ListItemButton
                    onClick={item.hasSubItems ? 
                      (item.text === 'Settings' ? handleSettingsToggle : handleProductsToggle) : 
                      () => handleNavigation(item.path)
                    }
                    selected={isActive}
                    sx={{
                      borderRadius: 2,
                      minHeight: 48,
                      justifyContent: sidebarExpanded ? 'initial' : 'center',
                      px: sidebarExpanded ? 2 : 2,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      overflow: 'hidden',
                      '&.Mui-selected': {
                        bgcolor: '#6366f1',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#5855eb',
                        },
                        '& .MuiListItemIcon-root': {
                          color: 'white',
                        },
                      },
                      '&:hover': {
                        bgcolor: 'rgba(99, 102, 241, 0.08)',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: sidebarExpanded ? 2 : 'auto',
                        justifyContent: 'center',
                        color: isActive ? 'white' : '#6b7280',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 600 : 500,
                      }}
                      sx={{
                        opacity: sidebarExpanded ? 1 : 0,
                        transform: sidebarExpanded ? 'translateX(0)' : 'translateX(-20px)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '& .MuiTypography-root': {
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                        },
                      }}
                    />
                    {item.hasSubItems && sidebarExpanded && (
                      <Box
                        sx={{
                          opacity: sidebarExpanded ? 1 : 0,
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ExpandMore />
                      </Box>
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
              
              {/* Sub-items */}
              {item.hasSubItems && sidebarExpanded && (
                <Collapse 
                  in={isExpanded} 
                  timeout={300}
                  unmountOnExit
                  sx={{
                    '& .MuiCollapse-wrapper': {
                      transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                    '& .MuiCollapse-wrapperInner': {
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isExpanded ? 'translateY(0)' : 'translateY(-10px)',
                      opacity: isExpanded ? 1 : 0,
                    },
                  }}
                >
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItem key={subItem.text} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                          onClick={() => handleNavigation(subItem.path)}
                          selected={location.pathname === subItem.path}
                          sx={{
                            borderRadius: 2,
                            minHeight: 40,
                            pl: 2,
                            pr: 2,
                            ml: 4,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            overflow: 'hidden',
                            '&.Mui-selected': {
                              bgcolor: 'rgba(99, 101, 241, 0.16)',
                              '&:hover': {
                                bgcolor: '#5855eb41',
                              },
                              '& .MuiListItemIcon-root': {
                                color: '#6366f1',
                              },
                              '& .MuiListItemText-primary': {
                                color: '#6366f1',
                                fontWeight: 600,
                              },
                            },
                            '&:hover': {
                              bgcolor: 'rgba(99, 102, 241, 0.08)',
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: 2,
                              justifyContent: 'center',
                              color: location.pathname === subItem.path ? '#6366f1' : '#6b7280',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              flexShrink: 0,
                              '& svg': {
                                fontSize: '1.2rem',
                              },
                            }}
                          >
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={subItem.text}
                            primaryTypographyProps={{
                              fontSize: '0.8rem',
                              fontWeight: location.pathname === subItem.path ? 600 : 500,
                            }}
                            sx={{
                              '& .MuiTypography-root': {
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                              },
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          );
        })}
      </List>

      {/* Profile Section */}
      <Box sx={{ 
        mt: 'auto', 
        p: sidebarExpanded ? 2 : 1,
        transition: 'padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
      }}>
        <Divider sx={{ mb: 2 }} />
        <ListItem disablePadding>
          <Tooltip title={!sidebarExpanded ? 'Profile' : ''} placement="right">
            <ListItemButton
              onClick={handleProfileMenuOpen}
              sx={{
                borderRadius: 2,
                minHeight: 56,
                justifyContent: 'center',
                px: sidebarExpanded ? 2 : 1.5,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                position: 'relative',
                '&:hover': {
                  bgcolor: 'rgba(99, 102, 241, 0.08)',
                },
              }}
            >
              {/* Avatar */}
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'primary.main',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  position: sidebarExpanded ? 'static' : 'absolute',
                  left: sidebarExpanded ? 'auto' : '50%',
                  transform: sidebarExpanded ? 'none' : 'translateX(-50%)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  flexShrink: 0,
                  zIndex: 1,
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>

              {/* User Info */}
              <Box
                sx={{
                  ml: sidebarExpanded ? 2 : 0,
                  opacity: sidebarExpanded ? 1 : 0,
                  transform: sidebarExpanded ? 'translateX(0)' : 'translateX(-20px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  overflow: 'hidden',
                  visibility: sidebarExpanded ? 'visible' : 'hidden',
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'text.primary',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1.2,
                  }}
                >
                  {user?.name || 'User Name'}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1.2,
                    display: 'block',
                  }}
                >
                  {user?.email || 'user@example.com'}
                </Typography>
              </Box>
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { md: `${currentDrawerWidth}px` },
          bgcolor: 'white',
          color: 'primary.main',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: 'none',
          borderBottom: 'none',
        }}
      >
        <Toolbar sx={{ minHeight: '64px !important' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Top Right Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
            <Tooltip title="Search">
              <IconButton
                size="medium"
                sx={{
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'rgba(99, 102, 241, 0.08)',
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
                <SearchIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Notifications">
              <IconButton
                size="medium"
                sx={{
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'rgba(99, 102, 241, 0.08)',
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
                <NotificationsIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: sidebarExpanded ? 'right' : 'center',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: sidebarExpanded ? 'right' : 'center',
            }}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            PaperProps={{
              sx: {
                minWidth: 248,
                borderRadius: 1,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                mt: 85,
                ml: sidebarExpanded ? 0 : 6,
                transform: 'translateY(-8px)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: sidebarExpanded ? 'calc(100% - 40px)' : '50%',
                  transform: sidebarExpanded ? 'none' : 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '8px solid white',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                },
              }
            }}
            TransitionProps={{
              timeout: 300,
            }}
            sx={{
              '& .MuiMenu-paper': {
                animation: 'slideUpFade 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              },
              '@keyframes slideUpFade': {
                from: {
                  opacity: 0,
                  transform: 'translateY(20px) scale(0.95)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0) scale(1)',
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {user?.name || 'User Name'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email || 'user@example.com'}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleProfileMenuClose} sx={{ py: 1 }}>
              <ListItemIcon>
                <AccountIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ py: 1 }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation */}
      <Box
        component="nav"
        sx={{ 
          width: { md: currentDrawerWidth }, 
          flexShrink: { md: 0 },
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidthExpanded,
              border: 'none',
            },
          }}
        >
          <SidebarContent isTemporary />
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: currentDrawerWidth,
              border: 'none',
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              overflowX: 'hidden',
            },
          }}
          open
        >
          <SidebarContent />
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100vw - ${currentDrawerWidth}px)` },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        {/* Content Area */}
        <Box
          sx={{
            mt: 8,
            p: 3,
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Outlet />
        </Box>

        {/* Fixed Bottom Bar */}
        <Box
          sx={{
            width: '100%',
            height: 50,
            position: 'fixed',
            bottom: 0,
            left: { md: `${currentDrawerWidth}px`, xs: 0 },
            bgcolor: 'white',
            textAlign: 'left',
            py: 2,
            pl: 4,
            fontSize: '0.85rem',
            zIndex: (theme) => theme.zIndex.appBar,
            transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Typography variant="caption" color="#6b7280" fontSize="0.75rem">
              Powered by Felcomm Software Solutions
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;