import {
  Box,
  Typography,
} from '@mui/material';

const ReportPage = () => {

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
          Report Page
        </Typography>
        <Typography variant="body1" color="text.secondary">
          welcome to the Report Page! Here you can view and generate various reports related to your business operations.
        </Typography>
      </Box>
    </Box>
  );
};

export default ReportPage;