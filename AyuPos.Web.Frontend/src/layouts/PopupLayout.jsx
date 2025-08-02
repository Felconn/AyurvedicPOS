import {
  Box,
  Dialog,
  DialogContent,
  Avatar,
  Typography,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const PopupLayout = ({
  open = false,
  onClose,
  children,
  maxWidth = 'sm',
  fullWidth = true,
  showHeader = true,
  showFooter = true,
  title = '',
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 1,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          position: 'relative',
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        },
      }}
      disableEscapeKeyDown={false}
      aria-labelledby="popup-dialog-title"
    >
      {/* Header Section */}
      {showHeader && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 3,
            pb: 2,
            bgcolor: 'white',
            position: 'relative',
          }}
        >
          {/* Centered Avatar (absolute positioning) */}
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              pt: 5,
            }}
          >
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: 'primary.main',
                fontSize: '1.2rem',
                fontWeight: 'bold',
              }}
            >
              B
            </Avatar>
          </Box>

          {/* Close Button (pushed to right with margin-left: auto) */}
          <IconButton
            onClick={onClose}
            sx={{
              marginLeft: 'auto', // This pushes it to the right
              color: '#6b7280',
              bgcolor: 'transparent',
              width: 32,
              height: 32,
              '&:hover': {
                bgcolor: '#f3f4f6',
                color: '#374151',
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
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Content Section */}
      <DialogContent
        sx={{
          mt: 5,
          p: 0,
          bgcolor: '#ffffffff',
          minHeight: showHeader || showFooter ? 'auto' : 400,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: 6,
            minHeight: 300,
            bgcolor: '#ffffffff',
          }}
        >
          {children}
        </Box>
      </DialogContent>

      {/* Footer Section */}
      {showFooter && (
        <Box
          sx={{
            p: 2,
            textAlign: 'center',
            bgcolor: 'white',
            mt: 'auto',
            pb: 3,
          }}
        >
          <Box
            component="hr"
            sx={{
              width: '92%', 
              border: 'none',
              height: '1px',
              backgroundColor: '#e5e7eb',
              my: 2, 
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: '#6b7280',
              fontSize: '0.75rem',
            }}
          >
            Powered by Felcomm Software Solutions
          </Typography>
        </Box>
      )}
    </Dialog>
  );
};

export default PopupLayout;