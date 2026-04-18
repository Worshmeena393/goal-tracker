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
          overflow: "hidden",
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
            background:
              goal.status === "active"
                ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
                : goal.status === "completed"
                ? `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`
                : `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`,
          }}
        />

        <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
            <Chip
              label={t(`cat${goal.category}`) !== `cat${goal.category}` ? t(`cat${goal.category}`) : goal.category}
              size="small"
              sx={{
                fontWeight: 900,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
                fontSize: "0.65rem",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            />
            <Chip
              label={t(goal.status)}
              size="small"
              variant="outlined"
              color={
                goal.status === "active"
                  ? "success"
                  : goal.status === "completed"
                  ? "secondary"
                  : "default"
              }
              sx={{ fontWeight: 800, fontSize: "0.65rem" }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              mb: 1.5,
              fontSize: "1.1rem",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: 48,
            }}
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
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: 1.6,
              }}
            >
              {goal.notes}
            </Typography>
          )}

          {/* Progress Section */}
          <Box sx={{ mt: "auto", mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5, alignItems: 'center' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {t("progress")}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 900, color: "primary.main", fontSize: '0.85rem' }}>
                  {progressPercent}%
                </Typography>
              </Box>
            </Box>
            <Box sx={{ position: 'relative' }}>
              <LinearProgress
                variant="determinate"
                value={progressPercent}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: isDark ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.primary.main, 0.05),
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 5,
                    background: goal.status === 'active' 
                      ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
                      : goal.status === 'completed'
                      ? `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`
                      : theme.palette.grey[400],
                  },
                }}
              />
              {goal.status === 'active' && progressPercent < 100 && (
                <Box
                  component={motion.div}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${progressPercent}%`,
                    height: '100%',
                    borderRadius: 5,
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  }}
                />
              )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.2 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                <Box component="span" sx={{ color: 'primary.main', fontWeight: 900 }}>{goal.progress}</Box>
                / {goal.target} {t(`unit_${goal.type}`) || t("units")}
              </Typography>
              {goal.endDate && (
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled', fontSize: '0.7rem' }}>
                  {new Date(goal.endDate).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Actions - responsive goal controls */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              pt: 2.5,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              width: '100%',
              mt: "auto",
            }}
          >
            <Button
              component={motion.button}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              fullWidth
              size="medium"
              variant="contained"
              disabled={goal.status !== "active"}
              onClick={() => onLog(goal.id)}
              startIcon={<CheckCircleIcon />}
              sx={{
                flex: 1,
                height: 44,
                textTransform: "none",
                fontWeight: 800,
                borderRadius: 2.5,
                boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: `0 12px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                },
              }}
            >
              {t("log") || "Log"}
            </Button>

            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title={goal.status === "active" ? t("pause") : t("resume")} arrow>
                <IconButton
                  size="medium"
                  onClick={() => onToggleStatus(goal.id)}
                  sx={{
                    color: goal.status === "active" ? theme.palette.warning.main : theme.palette.success.main,
                    bgcolor: alpha(goal.status === "active" ? theme.palette.warning.main : theme.palette.success.main, 0.08),
                    borderRadius: 2.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: alpha(goal.status === "active" ? theme.palette.warning.main : theme.palette.success.main, 0.15),
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  {goal.status === "active" ? <PauseIcon /> : <PlayIcon />}
                </IconButton>
              </Tooltip>

              <Tooltip title={t("edit")} arrow>
                <IconButton
                  size="medium"
                  onClick={() => navigate(`/goals/edit/${goal.id}`)}
                  sx={{
                    color: theme.palette.info.main,
                    bgcolor: alpha(theme.palette.info.main, 0.08),
                    borderRadius: 2.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.info.main, 0.15),
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title={t("delete")} arrow>
                <IconButton
                  size="medium"
                  onClick={() => onDelete(goal.id)}
                  sx={{
                    color: theme.palette.error.main,
                    bgcolor: alpha(theme.palette.error.main, 0.08),
                    borderRadius: 2.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.error.main, 0.15),
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GoalCard;
