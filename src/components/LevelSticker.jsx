import React, { useContext } from "react";
import { Box, Typography, Tooltip, LinearProgress, alpha, useTheme } from "@mui/material";
import { EmojiEvents as TrophyIcon, TrendingUp as XPIcon } from "@mui/icons-material";
import { LanguageContext } from "../context/LanguageContext";

function LevelSticker({ level = 1, xp = 0 }) {
  const { t } = useContext(LanguageContext);
  const theme = useTheme();
  const progress = (xp % 100);
  const isDark = theme.palette.mode === "dark";

  return (
    <Tooltip title={`${t("level")} ${level} - ${xp} ${t("xp")}`}>
      <Box 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 2,
          p: 1.5,
          px: 2,
          borderRadius: 4,
          bgcolor: isDark ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.primary.main, 0.05),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          backdropFilter: "blur(10px)",
          transition: "all 0.3s ease",
          "&:hover": {
            bgcolor: isDark ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.primary.main, 0.08),
            transform: "translateY(-2px)",
            boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.1)}`
          }
        }}
      >
        <Box sx={{ position: 'relative', display: 'flex' }}>
          <TrophyIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
          <Box 
            sx={{ 
              position: 'absolute', 
              top: -8, 
              right: -8, 
              bgcolor: theme.palette.secondary.main, 
              color: 'white', 
              fontSize: '0.65rem', 
              fontWeight: 900, 
              px: 0.8, 
              py: 0.2, 
              borderRadius: 1.5,
              boxShadow: `0 4px 8px ${alpha(theme.palette.secondary.main, 0.3)}`
            }}
          >
            {level}
          </Box>
        </Box>

        <Box sx={{ minWidth: 100 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary", textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {t("level")} {level}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 900, color: "primary.main" }}>
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              "& .MuiLinearProgress-bar": {
                borderRadius: 3,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              },
            }}
          />
        </Box>
      </Box>
    </Tooltip>
  );
}

export default LevelSticker;
