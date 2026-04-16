import React, { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { Card, CardContent, Typography, LinearProgress, Box, Avatar, alpha, useTheme, Tooltip } from "@mui/material";
import { 
  CheckCircle as CheckIcon, 
  PlayArrow as ActiveIcon, 
  Pause as PausedIcon,
  TrendingUp as ProgressIcon,
  Category as CategoryIcon,
  Update as UpdateIcon
} from "@mui/icons-material";

/* -------------------------------------------------------------------------- */
/* CategoryCard Component                                                     */
/* -------------------------------------------------------------------------- */

function CategoryCard({
  category = "Unknown",
  activeCount = 0,
  completedCount = 0,
  pausedCount = 0,
  progress = 0,
  lastUpdated,
  color = "#4CAF50"
}) {
  const { t, formatNumber, formatDate } = useContext(LanguageContext);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        borderRadius: 5,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        border: "1px solid",
        borderColor: isDark ? alpha(color, 0.1) : alpha(color, 0.05),
        bgcolor: isDark ? alpha(theme.palette.background.paper, 0.6) : "white",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: isDark 
            ? `0 20px 40px -12px ${alpha(color, 0.3)}` 
            : `0 20px 40px -12px ${alpha(color, 0.15)}`,
          borderColor: alpha(color, 0.3),
        },
      }}
      role="region"
      aria-label={`Category card for ${category}`}
    >
      {/* Accent Top Bar */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 6, bgcolor: color }} />

      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.secondary', letterSpacing: 1.5, fontSize: '0.65rem' }}>
              {t("category").toUpperCase()}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.01em' }}>
              {category}
            </Typography>
          </Box>
          <Avatar 
            sx={{ 
              bgcolor: alpha(color, 0.1), 
              color: color, 
              width: 48, 
              height: 48, 
              boxShadow: `0 8px 16px ${alpha(color, 0.1)}`,
              border: `1px solid ${alpha(color, 0.1)}`
            }}
          >
            <CategoryIcon />
          </Avatar>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Box sx={{ minWidth: 60 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <ActiveIcon sx={{ fontSize: 14, color: 'primary.main' }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.6rem' }}>
                {t("active")}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1 }}>
              {formatNumber(activeCount)}
            </Typography>
          </Box>
          <Box sx={{ minWidth: 60 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <CheckIcon sx={{ fontSize: 14, color: 'success.main' }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.6rem' }}>
                {t("completed")}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1 }}>
              {formatNumber(completedCount)}
            </Typography>
          </Box>
          <Box sx={{ minWidth: 60 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <PausedIcon sx={{ fontSize: 14, color: 'warning.main' }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.6rem' }}>
                {t("paused")}
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1 }}>
              {formatNumber(pausedCount)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, alignItems: 'flex-end' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ProgressIcon sx={{ fontSize: 14, color: color }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.7rem' }}>
                {t("progress")}
              </Typography>
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: color }}>
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ 
              height: 8, 
              borderRadius: 4, 
              bgcolor: isDark ? alpha(color, 0.05) : alpha(color, 0.05),
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: `linear-gradient(90deg, ${color} 0%, ${alpha(color, 0.6)} 100%)`,
              }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 2, borderTop: '1px solid', borderColor: 'divider', opacity: 0.7 }}>
          <UpdateIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled', fontSize: '0.65rem' }}>
            {t("lastUpdated")}: {formatDate(lastUpdated)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default CategoryCard;