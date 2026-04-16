import { Box, Typography, alpha, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const NotificationSticker = ({ message, severity = 'info', direction = 'ltr' }) => {
  const theme = useTheme();

  const getSeverityColor = (sev) => {
    switch (sev) {
      case 'success': return theme.palette.success.main;
      case 'error': return theme.palette.error.main;
      case 'warning': return theme.palette.warning.main;
      case 'info': return theme.palette.info.main;
      default: return theme.palette.primary.main;
    }
  };

  const color = getSeverityColor(severity);

  return (
    <Box
      component={motion.div}
      initial={{ scale: 0.8, opacity: 0, x: direction === 'rtl' ? 20 : -20 }}
      animate={{ scale: 1, opacity: 1, x: 0 }}
      exit={{ scale: 0.8, opacity: 0, x: direction === 'rtl' ? -20 : 20 }}
      sx={{ 
        bgcolor: color, 
        px: 2, 
        py: 0.75, 
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        boxShadow: `0 8px 24px ${alpha(color, 0.5)}`,
        border: '1px solid rgba(255,255,255,0.4)',
        zIndex: 10,
        whiteSpace: 'nowrap'
      }}
    >
      <Box sx={{ 
        width: 6, 
        height: 6, 
        bgcolor: 'white', 
        borderRadius: '50%', 
        animation: 'pulse 1.5s infinite',
        '@keyframes pulse': {
          '0%': { transform: 'scale(0.95)', opacity: 0.7 },
          '50%': { transform: 'scale(1.2)', opacity: 1 },
          '100%': { transform: 'scale(0.95)', opacity: 0.7 },
        }
      }} />
      <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, color: 'white', fontSize: '0.7rem' }}>
        {message}
      </Typography>
    </Box>
  );
};

export default NotificationSticker;
