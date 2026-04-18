import { useContext } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  LinearProgress,
  useTheme,
  alpha,
  Tooltip,
  Button,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { LanguageContext } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";

const GoalCard = ({
  goal,
  onLog,
  onToggleStatus,
  onDelete,
}) => {
  const { t } = useContext(LanguageContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";

  const progressPercent = Math.min(
    Math.round((goal.progress / goal.target) * 100),
    100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94],
        hover: { duration: 0.2 }
      }}
    >
      <Card
        sx={{
          height: "100%",
          borderRadius: { xs: 3, sm: 4 },
          position: "relative",
          overflow: "hidden", // Reverting to hidden as we won't have floating buttons anymore
          display: "flex",
          flexDirection: "column",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          border: "1px solid",
          borderColor: isDark ? alpha(theme.palette.divider, 0.2) : alpha(theme.palette.divider, 0.1),
          bgcolor: isDark ? alpha(theme.palette.background.paper, 0.9) : "white",
          boxShadow: isDark 
            ? '0 8px 25px rgba(0,0,0,0.15)' 
            : '0 8px 25px rgba(0,0,0,0.08)',
          "&:hover": {
            boxShadow: isDark
              ? `0 25px 50px -12px rgba(0,0,0,0.4)`
              : `0 25px 50px -12px ${alpha(theme.palette.primary.main, 0.15)}`,
            borderColor: alpha(theme.palette.primary.main, 0.2),
            transform: 'translateY(-4px)',
          },
        }}
      >
        {/* Top Accent Line */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 5,
            borderRadius: "4px 4px 0 0",
            background:
              goal.status === "active"
                ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
                : goal.status === "completed"
                ? `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`
                : `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`,
          }}
        />

        <CardContent sx={{ p: { xs: 2.5, sm: 3 }, flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={t(`cat${goal.category}`) !== `cat${goal.category}` ? t(`cat${goal.category}`) : goal.category}
                size="small"
                sx={{
                  fontWeight: 900,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                  fontSize: "0.6rem",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  height: 20
                }}
              />
              <Chip
                label={t(goal.status).toUpperCase()}
                size="small"
                sx={{ 
                  fontWeight: 900, 
                  fontSize: "0.6rem",
                  height: 20,
                  bgcolor: goal.status === "active" ? alpha(theme.palette.success.main, 0.1) : (goal.status === "completed" ? alpha(theme.palette.info.main, 0.1) : alpha(theme.palette.warning.main, 0.1)),
                  color: goal.status === "active" ? theme.palette.success.main : (goal.status === "completed" ? theme.palette.info.main : theme.palette.warning.main),
                  letterSpacing: 0.5
                }}
              />
            </Box>
          </Box>

          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              mb: 1,
              fontSize: "1.05rem",
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: 42,
              cursor: 'pointer',
              color: 'text.primary',
              transition: 'color 0.2s ease',
              '&:hover': { color: 'primary.main' }
            }}
            onClick={() => navigate(`/goals/${goal.id}`)}
          >
            {goal.title}
          </Typography>

          {goal.notes && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: 1.4,
                fontSize: '0.8rem',
                opacity: 0.8
              }}
            >
              {goal.notes}
            </Typography>
          )}

          {/* Progress Section */}
          <Box sx={{ mt: "auto", mb: 2.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, alignItems: 'center' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.65rem' }}>
                {t("progress")}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 900, color: "primary.main", fontSize: '0.75rem' }}>
                {progressPercent}%
              </Typography>
            </Box>
            <Box sx={{ position: 'relative', mb: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progressPercent}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: isDark ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.primary.main, 0.05),
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                    background: goal.status === 'active' 
                      ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
                      : goal.status === 'completed'
                      ? `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`
                      : theme.palette.warning.main,
                  },
                }}
              />
              {goal.status === 'active' && progressPercent < 100 && (
                <Box
                  component={motion.div}
                  animate={{ opacity: [0.1, 0.4, 0.1], x: ['-100%', '100%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '40%',
                    height: '100%',
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    pointerEvents: 'none'
                  }}
                />
              )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 800,
                  fontSize: "0.7rem",
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.4
                }}
              >
                <Box component="span" sx={{ color: 'primary.main', fontWeight: 900 }}>{goal.progress}</Box>
                / {goal.target} {t(`unit_${goal.type}`) || t("units")}
              </Typography>
              {goal.endDate && (
                <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.65rem', color: 'text.disabled' }}>
                  {new Date(goal.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Actions - Single professional row at bottom */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              pt: 2,
              mt: "auto",
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              width: '100%',
            }}
          >
            <Button
              component={motion.button}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              variant="contained"
              disabled={goal.status !== "active"}
              onClick={() => onLog(goal.id)}
              startIcon={<CheckCircleIcon sx={{ fontSize: '18px !important' }} />}
              sx={{
                flex: 2, // Takes more space
                height: 42,
                textTransform: "none",
                fontWeight: 900,
                borderRadius: 2.5,
                fontSize: '0.85rem',
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 6px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                  bgcolor: 'primary.dark'
                },
              }}
            >
              {t("log") || "Log"}
            </Button>

            <Tooltip title={goal.status === "active" ? t("pause") : t("resume")} arrow>
              <IconButton
                onClick={() => onToggleStatus(goal.id)}
                sx={{
                  flex: 1,
                  height: 42,
                  width: 42,
                  color: goal.status === "active" ? 'warning.main' : 'success.main',
                  bgcolor: alpha(goal.status === "active" ? theme.palette.warning.main : theme.palette.success.main, 0.1),
                  borderRadius: 2.5,
                  border: '1px solid',
                  borderColor: alpha(goal.status === "active" ? theme.palette.warning.main : theme.palette.success.main, 0.2),
                  '&:hover': {
                    bgcolor: alpha(goal.status === "active" ? theme.palette.warning.main : theme.palette.success.main, 0.2),
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {goal.status === "active" ? <PauseIcon /> : <PlayIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title={t("edit")} arrow>
              <IconButton
                onClick={() => navigate(`/goals/edit/${goal.id}`)}
                sx={{
                  flex: 1,
                  height: 42,
                  width: 42,
                  color: 'info.main',
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  borderRadius: 2.5,
                  border: '1px solid',
                  borderColor: alpha(theme.palette.info.main, 0.2),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.info.main, 0.2),
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={t("delete")} arrow>
              <IconButton
                onClick={() => onDelete(goal.id)}
                sx={{
                  flex: 1,
                  height: 42,
                  width: 42,
                  color: 'white',
                  bgcolor: theme.palette.error.main,
                  borderRadius: 2.5,
                  boxShadow: `0 4px 10px ${alpha(theme.palette.error.main, 0.3)}`,
                  '&:hover': {
                    bgcolor: theme.palette.error.dark,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 15px ${alpha(theme.palette.error.main, 0.4)}`
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GoalCard;
