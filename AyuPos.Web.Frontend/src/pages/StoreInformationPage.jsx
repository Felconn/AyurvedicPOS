import {
  Box,
  Typography,
} from '@mui/material';

const StoreInforPage = () => {

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
          Store Information Page
        </Typography>
        <Typography variant="body1" color="text.secondary">
          welcome to the Store Information Page! Here you can manage your store details and view information.
        </Typography>
      </Box>
    </Box>
  );
};

export default StoreInforPage;