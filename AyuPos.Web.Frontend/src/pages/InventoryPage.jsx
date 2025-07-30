import {
  Box,
  Typography,
} from '@mui/material';

const InventoryPage = () => {

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
          Inverntory Page
        </Typography>
        <Typography variant="body1" color="text.secondary">
          welcome to the Inventory Page! Here you can manage your inventory items and view stock levels.
        </Typography>
      </Box>
    </Box>
  );
};

export default InventoryPage;