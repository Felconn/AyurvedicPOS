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
            justifyContent: 'space-between',
            p: 3,
            pb: 2,
            bgcolor: 'white',
            borderBottom: '1px solid #f3f4f6',
            position: 'relative',
          }}
        >
          {/* Logo and Title Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'primary.main',
                fontSize: '1.2rem',
                fontWeight: 'bold',
              }}
            >
              B
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                component="h2"
                id="popup-dialog-title"
                sx={{
                  fontWeight: 600,
                  color: '#1f2937',
                  fontSize: '1.25rem',
                  lineHeight: 1.2,
                }}
              >
                {title || 'BrandName'}
              </Typography>
              {title && (
                <Typography
                  variant="caption"
                  sx={{
                    color: '#6b7280',
                    fontSize: '0.75rem',
                  }}
                >
                  POS System
                </Typography>
              )}
            </Box>
          </Box>

          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{
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
          p: 0,
          bgcolor: '#f9fafb',
          minHeight: showHeader || showFooter ? 'auto' : 400,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: 3,
            minHeight: 300,
            bgcolor: '#f9fafb',
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
            borderTop: '1px solid #f3f4f6',
            mt: 'auto',
          }}
        >
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