import { useContext } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  useTheme,
  alpha,
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          height: "100%",
          borderRadius: 4,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease",
          border: "1px solid",
          borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
          bgcolor: isDark ? alpha(theme.palette.background.paper, 0.8) : "white",
          "&:hover": {
            boxShadow: isDark
              ? `0 20px 40px -12px rgba(0,0,0,0.6)`
              : `0 20px 40px -12px ${alpha(theme.palette.primary.main, 0.2)}`,
            borderColor: alpha(theme.palette.primary.main, 0.3),
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
            height: 4,
            background:
              goal.status === "active"
                ? `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
                : goal.status === "completed"
                ? `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`
                : `linear-gradient(90deg, ${theme.palette.grey[400]}, ${theme.palette.grey[600]})`,
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
              mb: 3,
              fontSize: "1.1rem",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              height: 48,
            }}
          >
            {goal.title}
          </Typography>

          {/* Progress Section */}
          <Box sx={{ mt: "auto", mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                {t("progress")}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 900, color: "primary.main" }}>
                {progressPercent}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 1,
                color: "text.secondary",
                fontWeight: 800,
                fontSize: "0.75rem",
              }}
            >
              {goal.progress} / {goal.target} {t(`unit_${goal.type}`) || t("units")}
            </Typography>
          </Box>

          {/* Actions - Redesigned as requested */}
          <Box
            sx={{
              display: "flex",
              pt: 2,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Tooltip title={t("logProgress")}>
              <IconButton
                size="small"
                onClick={() => onLog(goal.id)}
                disabled={goal.status !== "active"}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                  borderRadius: 2,
                  p: 1,
                  "&:hover": {
                    bgcolor: "primary.main",
                    color: "white",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title={goal.status === "active" ? t("pause") : t("resume")}>
              <IconButton
                size="small"
                onClick={() => onToggleStatus(goal.id)}
                sx={{
                  bgcolor: alpha(theme.palette.grey[500], 0.1),
                  borderRadius: 2,
                  p: 1,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.grey[500], 0.2),
                    transform: "scale(1.1)",
                  },
                }}
              >
                {goal.status === "active" ? (
                  <PauseIcon fontSize="small" />
                ) : (
                  <PlayIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title={t("edit")}>
              <IconButton
                size="small"
                onClick={() => navigate(`/goals/edit/${goal.id}`)}
                sx={{
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  color: "info.main",
                  borderRadius: 2,
                  p: 1,
                  "&:hover": {
                    bgcolor: "info.main",
                    color: "white",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title={t("delete")}>
              <IconButton
                size="small"
                onClick={() => onDelete(goal.id)}
                sx={{
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  color: "error.main",
                  borderRadius: 2,
                  p: 1,
                  "&:hover": {
                    bgcolor: "error.main",
                    color: "white",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GoalCard;
