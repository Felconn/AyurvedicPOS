import {
  Box,
  Typography,
} from '@mui/material';

const SalesPage = () => {

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
          Sales Page
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to the Sales Page! Here you can manage your sales transactions and view reports.
        </Typography>
      </Box>
    </Box>
  );
};

export default SalesPage;