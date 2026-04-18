import { useContext, useState, useMemo } from "react";
import { GoalsContext } from "../context/GoalsContext";
import { LanguageContext } from "../context/LanguageContext";
import { useNotification } from "../context/NotificationContext";
import LevelSticker from "../components/LevelSticker";
import EmptyState from "../components/EmptyState";
import AdvancedChart from "../components/AdvancedChart";
import GoalCard from "../components/GoalCard";
import { SkeletonStatCard, SkeletonCard } from "../components/LoadingStates";
import { motion, AnimatePresence } from "framer-motion";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Avatar,
  Paper,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingUp as XPIcon,
  EmojiEvents as TrophyIcon,
  DateRange as CalendarIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

/* =========================
   Animations
========================= */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      duration: 0.6
    }
  },
};

const statCardVariants = {
  hidden: { y: 40, opacity: 0, rotateX: -15 },
  visible: { 
    y: 0, 
    opacity: 1, 
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      duration: 0.8
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 20
    }
  }
};

const chartVariants = {
  hidden: { scale: 0.8, opacity: 0, rotateY: -10 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    rotateY: 0,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 25,
      duration: 0.9,
      delay: 0.3
    }
  }
};

const heroTextVariants = {
  hidden: { x: -30, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
};

const heroButtonVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.9 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
};

const floatVariants = {
  initial: { y: 0 },
  animate: { 
    y: [0, -10, 0],
    transition: { 
      duration: 4, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }
  },
};

/* =========================
   Utils
========================= */

const getCategoryData = (goals = [], t) => {
  const map = {};
  const categories = ["Personal", "Work", "Health", "Study", "Other"];
  
  // Initialize with predefined categories to ensure a balanced look
  categories.forEach(cat => {
    map[cat] = { count: 0, progress: 0 };
  });

  (goals || []).forEach((g) => {
    const category = g.category || "Other";
    if (!map[category]) {
      map[category] = { count: 0, progress: 0 };
    }
    map[category].count += 1;
    const progressPercent = Math.min(Math.round((g.progress / g.target) * 100), 100);
    map[category].progress += progressPercent;
  });

  return Object.entries(map)
    .map(([category, data]) => ({
      name: t(`cat${category}`) !== `cat${category}` ? t(`cat${category}`) : category,
      count: data.count,
      progress: data.count > 0 ? Math.round(data.progress / data.count) : 0,
      fullMark: 100
    }))
    .filter(d => d.count > 0 || categories.includes(d.name)); // Keep predefined or those with goals
};

const getStatusData = (goals = [], t) => [
  { name: t("active"), value: (goals || []).filter((g) => g.status === "active").length },
  { name: t("completed"), value: (goals || []).filter((g) => g.status === "completed").length },
  { name: t("paused"), value: (goals || []).filter((g) => g.status === "paused").length },
];

/* ========================= */

function StatCard({ title, value, color, icon }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const IconComponent = icon;

  return (
    <motion.div variants={statCardVariants} style={{ height: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          height: "100%",
          borderRadius: { xs: 2.5, sm: 3, md: 4 },
          background: isDark 
            ? `linear-gradient(135deg, ${alpha(color, 0.18)} 0%, ${alpha(color, 0.06)} 100%)`
            : `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.85)} 100%)`,
          color: isDark ? theme.palette.text.primary : "white",
          display: "flex",
          flexDirection: { xs: 'row', sm: 'column', md: 'row' },
          alignItems: { xs: 'center', sm: 'flex-start', md: 'center' },
          gap: { xs: 2, sm: 1.5, md: 2.5 },
          boxShadow: isDark 
            ? `0 10px 25px -5px rgba(0,0,0,0.4)` 
            : `0 10px 25px -5px ${alpha(color, 0.3)}`,
          border: isDark ? `1px solid ${alpha(color, 0.2)}` : 'none',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: isDark 
              ? `0 15px 35px -5px rgba(0,0,0,0.5)` 
              : `0 15px 35px -5px ${alpha(color, 0.45)}`,
            '& .stat-icon-bg': {
              transform: 'scale(1.1) rotate(10deg)',
              opacity: 0.2
            }
          }
        }}
      >
        {/* Background Decorative Icon */}
        <IconComponent className="stat-icon-bg" sx={{ 
          position: 'absolute', 
          right: -10, 
          bottom: -10, 
          fontSize: 80, 
          opacity: 0.1, 
          transition: 'all 0.4s ease',
          display: { xs: 'none', sm: 'block' }
        }} />

        {/* Avatar with icon */}
        <Avatar
          sx={{
            bgcolor: isDark ? alpha(color, 0.25) : "rgba(255,255,255,0.3)",
            color: isDark ? color : "inherit",
            width: { xs: 42, sm: 48, md: 54 },
            height: { xs: 42, sm: 48, md: 54 },
            flexShrink: 0,
            boxShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <IconComponent sx={{ fontSize: { xs: 22, sm: 26, md: 30 } }} />
        </Avatar>
        
        {/* Text content */}
        <Box sx={{ flex: 1, minWidth: 0, zIndex: 1 }}>
          <Typography variant="body2" sx={{ 
            opacity: isDark ? 0.7 : 0.9, 
            fontWeight: 800, 
            letterSpacing: 0.8, 
            mb: 0.5, 
            fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
            textTransform: 'uppercase'
          }}>
            {title}
          </Typography>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Typography sx={{ 
              fontWeight: 900, 
              lineHeight: 1, 
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.8rem' }, 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis' 
            }}>
              {value}
            </Typography>
          </motion.div>
        </Box>
      </Paper>
    </motion.div>
  );
}


/* ========================= */

function Dashboard() {
  const { goals, userStats, completionRate, totalHours, deleteGoal, toggleGoalStatus, logProgress, exportGoals, loading } = useContext(GoalsContext);
  const { t } = useContext(LanguageContext);
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const CHART_COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning?.main || "#f59e0b",
  ];

  const [deleteId, setDeleteId] = useState(null);

  /* ========================= */

  const activeGoals = useMemo(() => 
    goals.filter(g => g.status === "active").slice(0, 6),
  [goals]);

  const categoryData = useMemo(() => getCategoryData(goals, t), [goals, t]);
  const statusData = useMemo(() => getStatusData(goals, t), [goals, t]);
  const hasStatusData = statusData.some((s) => s.value > 0);

  const activeCount = (goals || []).filter((g) => g.status === "active").length;
  const completedCount = (goals || []).filter((g) => g.status === "completed").length;
  const pausedCount = (goals || []).filter((g) => g.status === "paused").length;
  const totalGoals = goals?.length || 0;

  const completionRateValue = completionRate || 0;

  /* ========================= */

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteGoal(deleteId);
      setDeleteId(null);
      showNotification(t("notificationDeleted") || "Goal deleted successfully", "success");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4, md: 6 } }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header / Hero */}
        <Box
          component={motion.div}
          variants={itemVariants}
          sx={{
            p: { xs: 3, sm: 4, md: 5, lg: 6 },
            borderRadius: { xs: 3, sm: 4, md: 5 },
            mb: { xs: 3, sm: 4, md: 6 },
            background: isDark 
              ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.background.paper} 100%)`
              : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: "white",
            position: "relative",
            overflow: "hidden",
            boxShadow: isDark 
              ? "0 15px 40px -15px rgba(0, 0, 0, 0.6)"
              : `0 20px 50px -15px ${alpha(theme.palette.primary.main, 0.3)}`,
            border: isDark ? `1px solid ${alpha(theme.palette.primary.main, 0.25)}` : 'none',
            '@keyframes shimmer': {
              '0%': { transform: 'translateX(-100%) rotate(25deg)' },
              '100%': { transform: 'translateX(200%) rotate(25deg)' }
            },
          }}
        >
          {/* Animated floating orbs */}
          <Box component={motion.div} variants={floatVariants} initial="initial" animate="animate" sx={{ position: "absolute", top: -100, right: -100, width: { xs: 250, md: 400 }, height: { xs: 250, md: 400 }, borderRadius: "50%", background: `radial-gradient(circle, ${alpha(theme.palette.secondary.light, 0.3)} 0%, transparent 70%)`, filter: "blur(50px)" }} />
          <Box component={motion.div} animate={{ y: [0, 15, 0], x: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} sx={{ position: "absolute", bottom: -150, left: -150, width: { xs: 300, md: 500 }, height: { xs: 300, md: 500 }, borderRadius: "50%", background: `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.25)} 0%, transparent 70%)`, filter: "blur(70px)" }} />
          
          {/* Shimmer effect */}
          <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)", animation: "shimmer 5s infinite", pointerEvents: "none" }} />

          <Grid container spacing={{ xs: 3, sm: 4, md: 5 }} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
            <Grid item xs={12} md={7} lg={8}>
              <Typography component={motion.div} variants={heroTextVariants} variant="h2" gutterBottom sx={{ fontWeight: 900, mb: { xs: 2, sm: 2.5, md: 3 }, lineHeight: 1.1, fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem', lg: '3.5rem' }, letterSpacing: '-0.03em' }}>
                {t("welcomeBack")} ✨
              </Typography>
              <Box component={motion.div} variants={heroTextVariants} sx={{ mb: { xs: 3, sm: 4, md: 5 }, maxWidth: 550 }}>
                <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 600, lineHeight: 1.6, fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }, mb: 1.5 }}>
                  {t("completionSummary")} <Box component="span" sx={{ color: "#fff", fontWeight: 900 }}>{completionRateValue}%</Box> {t("targetsSummary")}
                </Typography>
                <Box sx={{ width: '100%', height: 6, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRateValue}%` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    style={{
                      height: '100%',
                      background: 'white',
                      borderRadius: 3,
                      boxShadow: '0 0 15px rgba(255,255,255,0.5)'
                    }}
                  />
                </Box>
              </Box>
              
              <Box component={motion.div} variants={heroTextVariants} sx={{ mb: 4, display: { xs: 'flex', md: 'none' } }}>
                <LevelSticker level={userStats?.level || 1} xp={userStats?.xpTotal || 0} />
              </Box>
              
              <Box component={motion.div} variants={heroButtonVariants} sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 1.5, sm: 2, md: 2.5 } }}>
                <Button
                  component={motion.button}
                  whileHover={{ scale: 1.05, y: -4, boxShadow: '0 15px 30px rgba(0,0,0,0.2)' }}
                  whileTap={{ scale: 0.96 }}
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon sx={{ fontSize: '24px !important' }} />}
                  onClick={() => navigate("/goals/new")}
                  sx={{ 
                    borderRadius: { xs: 2, sm: 2.5, md: 3 }, 
                    px: { xs: 3, sm: 4, md: 5 }, 
                    py: { xs: 1, sm: 1.5, md: 2 }, 
                    fontWeight: 900, 
                    bgcolor: "white", 
                    color: theme.palette.primary.main,
                    fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.05rem' },
                    boxShadow: '0 12px 25px rgba(0,0,0,0.15)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.95)',
                    }
                  }}
                  aria-label={t("createNewGoal")}
                >
                  {t("createNewGoal")}
                </Button>
                <Button
                  component={motion.button}
                  whileHover={{ scale: 1.05, y: -4, bgcolor: 'rgba(255,255,255,0.15)', borderColor: 'white' }}
                  whileTap={{ scale: 0.96 }}
                  variant="outlined"
                  size="large"
                  startIcon={<DownloadIcon sx={{ fontSize: '24px !important' }} />}
                  onClick={exportGoals}
                  sx={{ 
                    borderRadius: { xs: 2, sm: 2.5, md: 3 }, 
                    px: { xs: 3, sm: 4, md: 5 }, 
                    py: { xs: 1, sm: 1.5, md: 2 }, 
                    fontWeight: 900, 
                    borderColor: "rgba(255,255,255,0.4)", 
                    color: "white",
                    fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.05rem' },
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                    }
                  }}
                  aria-label={t("exportData")}
                >
                  {t("exportData")}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} lg={4} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar sx={{ 
                  width: { md: 200, lg: 240 }, 
                  height: { md: 200, lg: 240 }, 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  backdropFilter: 'blur(30px)', 
                  border: '2px solid rgba(255,255,255,0.3)', 
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                  animation: 'float 6s infinite ease-in-out',
                  '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                    '50%': { transform: 'translateY(-20px) rotate(5deg)' }
                  }
                }}>
                  <TrophyIcon sx={{ fontSize: { md: 100, lg: 120 }, color: 'white' }} />
                </Avatar>
                <Box sx={{ 
                  position: 'absolute', 
                  top: -15, 
                  right: -15, 
                  bgcolor: theme.palette.secondary.main, 
                  color: 'white', 
                  px: 3, 
                  py: 1.5, 
                  borderRadius: 4, 
                  fontWeight: 900, 
                  boxShadow: '0 12px 25px rgba(0,0,0,0.3)', 
                  fontSize: '1.1rem', 
                  border: '2px solid rgba(255,255,255,0.3)',
                  zIndex: 2
                }}>
                  {t("level")} {userStats?.level || 1}
                </Box>
                <Box sx={{ 
                  position: 'absolute', 
                  bottom: -10, 
                  left: -10, 
                  bgcolor: 'white', 
                  color: theme.palette.primary.main, 
                  px: 2, 
                  py: 1, 
                  borderRadius: 3, 
                  fontWeight: 800, 
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)', 
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  zIndex: 2
                }}>
                  <XPIcon sx={{ fontSize: 18 }} />
                  {userStats?.xpTotal || 0} {t("xp")}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: { xs: 4, sm: 6, md: 8 } }}>
          {loading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={`skeleton-stat-${i}`}>
                <SkeletonStatCard />
              </Grid>
            ))
          ) : (
            <>
              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <StatCard title={t("totalGoals")} value={totalGoals} color={theme.palette.primary.main} icon={TrendingUpIcon} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <StatCard title={t("totalHours")} value={totalHours.toFixed(1)} color={theme.palette.info.main} icon={CalendarIcon} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <StatCard title={t("active")} value={activeCount} color={theme.palette.secondary.main} icon={PlayIcon} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <StatCard title={t("completed")} value={completedCount} color={theme.palette.success.main} icon={CheckCircleIcon} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2.4}>
                <StatCard title={t("paused")} value={pausedCount} color={theme.palette.warning?.main || "#f59e0b"} icon={PauseIcon} />
              </Grid>
            </>
          )}
        </Grid>

        {goals.length === 0 && !loading ? (
          <Box sx={{ mt: 4 }}>
            <EmptyState 
              message={t("noGoalsFound")} 
              subMessage={t("startNewJourney")}
              actionLabel={t("createNewGoal")}
              onAction={() => navigate("/goals/new")}
            />
          </Box>
        ) : (
          <>
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {/* Charts Section */}
              <Grid item xs={12} md={6}>
                {loading ? (
                  <SkeletonCard height={350} />
                ) : (
                  <motion.div variants={chartVariants} style={{ height: '100%' }}>
                    <Card 
                      className="hover-lift"
                      sx={{ 
                        height: "100%", 
                        borderRadius: { xs: 2, sm: 2.5, md: 3 }, 
                        border: 'none', 
                        boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.2)' : '0 10px 30px rgba(0,0,0,0.05)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', width: 40, height: 40 }}>
                            <CalendarIcon sx={{ fontSize: 22 }} />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 900, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' } }}>
                              {t("categoryPerformance") || "Category Performance"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                              {t("balanceAndProgress") || "Balance and Progress Overview"}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ flexGrow: 1, height: { xs: 250, sm: 280, md: 300 }, width: "100%" }}>
                          {categoryData.length > 0 ? (
                            <AdvancedChart
                              type="radar"
                              data={categoryData.map(d => ({ 
                                subject: d.name,
                                value: d.progress 
                              }))}
                              colors={[theme.palette.primary.main]}
                              height={280}
                              name={t("avgProgress") || "Avg. Progress"}
                            />
                          ) : (
                            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography variant="body2" color="text.secondary">{t("noData")}</Typography>
                            </Box>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                {loading ? (
                  <SkeletonCard height={350} />
                ) : (
                  <motion.div variants={chartVariants} style={{ height: '100%' }}>
                    <Card 
                      className="hover-lift"
                      sx={{ 
                        height: "100%", 
                        borderRadius: { xs: 2, sm: 2.5, md: 3 }, 
                        border: 'none', 
                        boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.2)' : '0 10px 30px rgba(0,0,0,0.05)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), color: 'secondary.main', width: 40, height: 40 }}>
                            <TrophyIcon sx={{ fontSize: 22 }} />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 900, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' } }}>
                              {t("statusOverview")}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                              {t("progressBreakdown")}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ flexGrow: 1, height: { xs: 250, sm: 280, md: 300 }, width: "100%" }}>
                          {hasStatusData ? (
                            <AdvancedChart
                              type="pie"
                              data={statusData}
                              colors={[theme.palette.secondary.main, theme.palette.success.main, theme.palette.warning?.main || "#f59e0b"]}
                              height={280}
                            />
                          ) : (
                            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography variant="body2" color="text.secondary">{t("noData")}</Typography>
                            </Box>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </Grid>
            </Grid>

            {/* Active Goals Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Box sx={{ 
                mt: { xs: 6, sm: 8, md: 10 }, 
                mb: { xs: 3, sm: 4 }, 
                display: "flex", 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: "space-between", 
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 2
              }}>
                <Box>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 900, 
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
                    lineHeight: 1.2
                  }}>
                    {t("activeGoals")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mt: 0.5, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                    {t("manageJourney")}
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate("/goals")} 
                  sx={{ 
                    fontWeight: 800,
                    borderRadius: 3,
                    px: { xs: 2, sm: 3 },
                    py: { xs: 0.8, sm: 1 },
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      bgcolor: 'primary.main',
                      color: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`
                    }
                  }}
                >
                  {t("viewAll")} 
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ marginLeft: '8px', display: 'inline-block' }}
                  >
                    &rarr;
                  </motion.span>
                </Button>
              </Box>

              <Grid container spacing={{ xs: 4, sm: 5, md: 6 }}>
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    [1, 2, 3, 4, 5].map((i) => (
                      <Grid item xs={12} sm={12} md={6} lg={6} xl={4} key={`skeleton-goal-${i}`} sx={{ display: 'flex' }}>
                        <SkeletonCard height={280} />
                      </Grid>
                    ))
                  ) : activeGoals.length > 0 ? (
                    activeGoals.map((goal) => (
                      <Grid item xs={12} sm={12} md={6} lg={6} xl={4} key={goal.id} sx={{ display: 'flex' }}>
                        <Box 
                          component={motion.div}
                          layout
                          variants={itemVariants}
                          sx={{ width: '100%', height: '100%', display: 'flex' }}
                        >
                          <GoalCard
                            goal={goal}
                            onLog={logProgress}
                            onToggleStatus={toggleGoalStatus}
                            onDelete={setDeleteId}
                          />
                        </Box>
                      </Grid>
                    ))
                  ) : (
                  <Grid item xs={12}>
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4, fontWeight: 600 }}>
                      {t("noActiveGoals")}
                    </Typography>
                  </Grid>
                )}
                </AnimatePresence>
              </Grid>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Delete Confirmation */}
      <Dialog 
        open={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        PaperProps={{ 
          sx: { 
            borderRadius: { xs: 4, sm: 5 }, 
            p: { xs: 1, sm: 1.5 },
            maxWidth: 400
          } 
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: { xs: '1.2rem', sm: '1.4rem' }, pb: 1 }}>
          {t("confirmDelete")}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontWeight: 600, color: 'text.secondary', lineHeight: 1.6 }}>
            {t("confirmDeleteDesc") || "Are you sure you want to delete this goal? This action cannot be undone."}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 }, pt: 1, gap: 1.5 }}>
          <Button 
            onClick={() => setDeleteId(null)} 
            sx={{ fontWeight: 800, color: 'text.secondary', borderRadius: 3, px: 3 }}
          >
            {t("cancel")}
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained" 
            startIcon={<DeleteIcon />}
            sx={{ 
              borderRadius: 3, 
              fontWeight: 900, 
              px: 4,
              boxShadow: `0 8px 20px ${alpha(theme.palette.error.main, 0.25)}`,
              '&:hover': {
                bgcolor: 'error.dark',
                boxShadow: `0 12px 25px ${alpha(theme.palette.error.main, 0.35)}`,
              }
            }}
          >
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Dashboard;