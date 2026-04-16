import React from 'react';
import { motion } from 'framer-motion';
import { Box, Skeleton, Typography, CircularProgress, useTheme } from '@mui/material';

// Premium Loading Spinner
const LoadingSpinner = ({ size = 40, color = 'primary' }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
    >
      <CircularProgress
        size={size}
        thickness={3}
        sx={{
          color: theme.palette[color].main,
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
    </motion.div>
  );
};

// Pulse Loading Dots
const PulseDots = ({ size = 8, color = 'primary' }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ display: 'flex', gap: size / 2 }}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut"
          }}
        >
          <Box
            sx={{
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: theme.palette[color].main,
            }}
          />
        </motion.div>
      ))}
    </Box>
  );
};

// Skeleton Card
const SkeletonCard = ({ height = 200, variant = 'rectangular' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Skeleton
        variant={variant}
        height={height}
        sx={{
          borderRadius: 2,
          backgroundColor: 'grey.300',
          '&::after': {
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          },
        }}
      />
    </motion.div>
  );
};

// Skeleton Stat Card
const SkeletonStatCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box
        sx={{
          p: 2,
          height: 85,
          borderRadius: 2,
          backgroundColor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Skeleton variant="circular" width={42} height={42} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width={80} height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={40} height={24} />
        </Box>
      </Box>
    </motion.div>
  );
};

// Skeleton Goal Card
const SkeletonGoalCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: 'grey.100',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="circular" width={24} height={24} />
        </Box>
        <Skeleton variant="text" width="100%" height={16} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" height={16} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={8} sx={{ borderRadius: 1 }} />
      </Box>
    </motion.div>
  );
};

// Skeleton Chart
const SkeletonChart = ({ height = 300 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
    >
      <Box sx={{ height, borderRadius: 2, backgroundColor: 'grey.100', p: 2 }}>
        <Skeleton variant="text" width={150} height={24} sx={{ mb: 2 }} />
        <Box sx={{ height: height - 60, display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          {[...Array(6)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width="100%"
              height={Math.random() * 100 + 50}
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Box>
      </Box>
    </motion.div>
  );
};

// Full Page Loading
const FullPageLoading = ({ message = "Loading..." }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        zIndex: 9999,
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      >
        <LoadingSpinner size={60} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          {message}
        </Typography>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <PulseDots size={6} />
      </motion.div>
    </Box>
  );
};

// Loading Button
const LoadingButton = ({ children, loading, ...props }) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <motion.div
        animate={loading ? { opacity: 0.7 } : { opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Box
          component="button"
          disabled={loading}
          {...props}
          sx={{
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
            ...props.sx,
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LoadingSpinner size={20} />
              <span>{children}</span>
            </Box>
          ) : (
            children
          )}
        </Box>
      </motion.div>
    </Box>
  );
};

// Loading Overlay
const LoadingOverlay = ({ loading, children }) => {
  return (
    <Box sx={{ position: 'relative' }}>
      {children}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            zIndex: 10,
          }}
        >
          <LoadingSpinner size={40} />
        </motion.div>
      )}
    </Box>
  );
};

// Animated Progress Bar
const AnimatedProgress = ({ value, color = 'primary', height = 8 }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          height,
          backgroundColor: 'grey.200',
          borderRadius: height / 2,
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          sx={{
            height: '100%',
            backgroundColor: theme.palette[color].main,
            borderRadius: height / 2,
          }}
        />
      </Box>
    </Box>
  );
};

export {
  LoadingSpinner,
  PulseDots,
  SkeletonCard,
  SkeletonStatCard,
  SkeletonGoalCard,
  SkeletonChart,
  FullPageLoading,
  LoadingButton,
  LoadingOverlay,
  AnimatedProgress,
};
