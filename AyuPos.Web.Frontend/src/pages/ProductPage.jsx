import {
  Box,
  Typography,
} from '@mui/material';

const DashboardPage = () => {

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
          Products Page
        </Typography>
        <Typography variant="body1" color="text.secondary">
          welcome to the Products Page! Here you can manage your product inventory and view details.
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardPage;