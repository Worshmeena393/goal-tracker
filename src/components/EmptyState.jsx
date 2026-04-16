import React from "react";
import { motion } from 'framer-motion';
import { Box, Typography, Button, useTheme, alpha } from "@mui/material";
import { 
  EmojiEvents as TrophyIcon,
  RocketLaunch as RocketIcon,
  Add as AddIcon 
} from "@mui/icons-material";

function EmptyState({ message, subMessage, actionLabel, onAction }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Box sx={{ 
        textAlign: "center", 
        py: { xs: 4, sm: 5, md: 6 }, 
        px: { xs: 2, sm: 3, md: 4 },
        background: isDark 
          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.04)} 100%)`
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
        borderRadius: { xs: 2, sm: 3, md: 4 },
        border: '2px dashed',
        borderColor: alpha(theme.palette.primary.main, 0.2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 2, sm: 2.5, md: 3 },
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          borderColor: alpha(theme.palette.primary.main, 0.4),
          transform: 'translateY(-2px)',
          boxShadow: isDark 
            ? `0 10px 30px rgba(0,0,0,0.2), inset 0 0 0 1px ${alpha(theme.palette.primary.main, 0.1)}`
            : `0 15px 40px rgba(0,0,0,0.08)`,
        }
      }}>
        {/* Animated background elements */}
        <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <TrophyIcon sx={{ fontSize: 120, color: 'primary.main' }} />
          </motion.div>
        </Box>
        
        <Box sx={{ position: 'absolute', bottom: -15, left: -15, opacity: 0.08 }}>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <RocketIcon sx={{ fontSize: 100, color: 'secondary.main' }} />
          </motion.div>
        </Box>

        {/* Main content */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <Box sx={{ 
            width: { xs: 60, sm: 70, md: 80 }, 
            height: { xs: 60, sm: 70, md: 80 }, 
            borderRadius: '50%', 
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
            border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
          }}>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <RocketIcon sx={{ fontSize: { xs: 30, sm: 35, md: 40 }, color: 'primary.main', opacity: 0.8 }} />
            </motion.div>
          </Box>
        </motion.div>
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <Typography variant="h6" sx={{ 
              fontWeight: 900, 
              color: 'text.primary', 
              mb: 1.5,
              fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {message} 
              <Box component="span" sx={{ ml: 1 }}>{" "} </Box>
            </Typography>
          </motion.div>
          
          {subMessage && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            >
              <Typography variant="body2" sx={{ 
                color: 'text.secondary', 
                fontWeight: 600, 
                maxWidth: { xs: 280, sm: 320, md: 360 }, 
                mx: 'auto',
                lineHeight: 1.6,
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' }
              }}>
                {subMessage}
              </Typography>
            </motion.div>
          )}
        </Box>

        {actionLabel && onAction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          >
            <Button 
              component={motion.button}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              variant="contained" 
              size="large" 
              onClick={onAction}
              startIcon={<AddIcon sx={{ fontSize: 20 }} />}
              sx={{ 
                borderRadius: { xs: 2, sm: 2.5, md: 3 }, 
                fontWeight: 800, 
                textTransform: 'none',
                px: { xs: 3, sm: 3.5, md: 4 },
                py: 1.5,
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                '&:hover': { 
                  boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.4)}`,
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                }
              }}
            >
              {actionLabel}
            </Button>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
}

export default EmptyState;
