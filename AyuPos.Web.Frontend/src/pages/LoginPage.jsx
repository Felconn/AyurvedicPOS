import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  Avatar,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(userId, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          padding: 3,
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'primary.main',
                mb: 2,
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }}
            >
              nn
            </Avatar>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                mb: 1,
              }}
            >
              Welcome to BrandName!
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              size="small"
              label="User ID"
              variant="outlined"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              sx={{ mb: 2 }}
              InputLabelProps={{
                sx: {
                  fontSize: '0.9rem',
                  pt: 0.2,
                },
              }}
              disabled={loading}
            />
            <TextField
              fullWidth
              size="small"
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 3 }}
              InputLabelProps={{
                sx: {
                  fontSize: '0.9rem',
                  pt: 0.2,
                },
              }}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mb: 2,
                height: 48,
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Log in'}
            </Button>
            <Box textAlign="center">
              <Link
                href="#"
                variant="body2"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Forgot Password?
              </Link>
            </Box>
          </Box>
        </CardContent>
        <Box
          sx={{
            textAlign: 'center',
            py: 2,
            borderTop: '1px solid',
            borderColor: 'grey.200',
            mt: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Powered by Felcomm Software Solutions
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default LoginPage;