import {
  Box,
  Typography,
} from '@mui/material';

const DashboardPage = () => {

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your system today.
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardPage;