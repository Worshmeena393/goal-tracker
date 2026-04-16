import { useContext, useMemo, useEffect, useState } from "react";
import { GoalsContext } from "../context/GoalsContext";
import { LanguageContext } from "../context/LanguageContext";
import { useNotification } from "../context/NotificationContext";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";
import AdvancedChart from "../components/AdvancedChart";
import EmptyState from "../components/EmptyState";
import {
  Container,
  Typography,
  Grid,
  Card as MuiCard,
  CardContent,
  Box,
  LinearProgress,
  Paper,
  Avatar,
  Tooltip as MuiTooltip,
  useTheme,
  alpha,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Category as CategoryIcon,
  CheckCircle as CheckIcon,
  Schedule as ActiveIcon,
  Assessment as StatsIcon,
  HealthAndSafety as HealthIcon,
  Work as WorkIcon,
  School as StudyIcon,
  Person as PersonalIcon,
  Star as StarIcon,
  Info as InfoIcon,
  ArrowForward as ArrowIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@mui/icons-material";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function Categories() {
  const { goals, renameCategory } = useContext(GoalsContext);
  const { t } = useContext(LanguageContext);
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleOpenRename = (e, name) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    // Don't allow renaming predefined categories
    const isPredefined = ["Personal", "Work", "Health", "Study", "Other"].includes(name);
    if (isPredefined) {
      showNotification(t("cannotRenamePredefined") || "Cannot rename system categories", "warning");
      return;
    }
    setSelectedCategory(name);
    setNewCategoryName(name);
    setRenameDialogOpen(true);
  };

  const handleRenameSubmit = () => {
    if (newCategoryName.trim() && newCategoryName !== selectedCategory) {
      renameCategory(selectedCategory, newCategoryName);
    }
    setRenameDialogOpen(false);
  };

  const lastUpdatedForCategory = (categoryName) => {
    const categoryGoals = goals.filter(g => (g.category || "General") === categoryName);
    if (categoryGoals.length === 0) return null;
    const dates = categoryGoals.map(g => new Date(g.updatedAt || g.createdAt).getTime());
    return new Date(Math.max(...dates)).toISOString();
  };

  useEffect(() => {
    showNotification(t("categoryOverview") || "Viewing Category Overview", "info");
  }, [showNotification, t]);

  const CHART_COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning?.main || "#f59e0b",
    theme.palette.info?.main || "#3b82f6",
    "#8b5cf6",
    "#ec4899",
  ];

  const categoryStats = useMemo(() => {
    const stats = {};
    
    // Initialize with predefined categories to ensure "0" counts are visible
    ["Personal", "Work", "Health", "Study", "Other"].forEach(cat => {
      stats[cat] = { name: cat, total: 0, completed: 0, active: 0, paused: 0, progress: 0, target: 0 };
    });

    goals.forEach((goal) => {
      const cat = goal.category || "General";
      if (!stats[cat]) {
        stats[cat] = { name: cat, total: 0, completed: 0, active: 0, paused: 0, progress: 0, target: 0 };
      }
      stats[cat].total += 1;
      stats[cat].progress += goal.progress;
      stats[cat].target += goal.target;
      if (goal.status === "completed") stats[cat].completed += 1;
      else if (goal.status === "active") stats[cat].active += 1;
      else if (goal.status === "paused") stats[cat].paused += 1;
    });

    return Object.values(stats).map(s => ({
      ...s,
      percentage: s.target > 0 ? Math.round((s.progress / s.target) * 100) : 0
    }));
  }, [goals]);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        {/* Page Header with Gradient Background */}
        <Box 
          sx={{ 
            mb: 4, 
            p: { xs: 3, md: 4 }, 
            borderRadius: 6, 
            position: 'relative',
            overflow: 'hidden',
            background: isDark 
              ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.4)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`
              : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.background.paper, 0.5)} 100%)`,
            border: '1px solid',
            borderColor: isDark ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.primary.main, 0.1),
            boxShadow: isDark ? "0 20px 40px rgba(0,0,0,0.3)" : "0 20px 40px rgba(0,0,0,0.05)",
          }}
        >
          {/* Decorative background shape */}
          <Box sx={{ 
            position: 'absolute', 
            top: -20, 
            right: -20, 
            width: 140, 
            height: 140, 
            borderRadius: '50%', 
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            filter: 'blur(40px)',
            zIndex: 0
          }} />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="overline" sx={{ letterSpacing: 3, color: "primary.main", fontWeight: 900, fontSize: '0.75rem', display: 'block', mb: 1 }}>
              {t("categories").toUpperCase()}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 1.5, fontSize: { xs: '2rem', md: '2.5rem' } }}>
              {t("performanceByCategory")}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, maxWidth: 700, lineHeight: 1.6, fontSize: '1.1rem' }}>
              {t("categoryDesc")}
            </Typography>
          </Box>
        </Box>

        {goals.length === 0 ? (
          <Box sx={{ mt: 4 }}>
            <EmptyState 
              message={t("noGoalsFound")} 
              subMessage={t("startNewJourney")}
              actionLabel={t("createNewGoal")}
              onAction={() => navigate("/goals/new")}
            />
          </Box>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {/* Summary Chart Section */}
            <Grid item xs={12} lg={8}>
              <Paper
                component={motion.div}
                variants={itemVariants}
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3, md: 4 },
                  height: '100%',
                  borderRadius: 6,
                  bgcolor: isDark ? alpha(theme.palette.background.paper, 0.4) : "white",
                  backdropFilter: 'blur(10px)',
                  border: "1px solid",
                  borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                  boxShadow: isDark ? "0 15px 35px rgba(0,0,0,0.2)" : "0 15px 35px rgba(0,0,0,0.02)",
                }}
              >
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', width: 48, height: 48 }}>
                    <StatsIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>{t("overallDistribution")}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{t("categoryBreakdown")}</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ height: { xs: 250, sm: 300, md: 350 }, width: "100%" }}>
                  {categoryStats.some(s => s.total > 0) ? (
                    <AdvancedChart
                      type="bar"
                      data={categoryStats.filter(s => s.total > 0).map(s => ({ 
                        name: t(`cat${s.name}`) !== `cat${s.name}` ? t(`cat${s.name}`) : s.name, 
                        value: s.total 
                      }))}
                      colors={CHART_COLORS}
                      height="100%"
                      showGrid={false}
                      margin={{ top: 10, right: 10, left: -20, bottom: 30 }}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5 }}>
                      <StatsIcon sx={{ fontSize: 60, mb: 2, color: 'text.disabled' }} />
                      <Typography color="text.secondary" variant="h6" sx={{ fontWeight: 800 }}>{t("noGoalsFound")}</Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* New Stats Summary Grid */}
            <Grid item xs={12} lg={4}>
               <Paper
                component={motion.div}
                variants={itemVariants}
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 6,
                  bgcolor: isDark ? alpha(theme.palette.background.paper, 0.4) : "white",
                  border: "1px solid",
                  borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1 }}>{t("quickStats") || "Quick Stats"}</Typography>
                
                <Box sx={{ p: 2, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.05), border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 0.5 }}>{t("totalCategories") || "Total Categories"}</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main' }}>{categoryStats.length}</Typography>
                </Box>

                <Box sx={{ p: 2, borderRadius: 4, bgcolor: alpha(theme.palette.success.main, 0.05), border: `1px solid ${alpha(theme.palette.success.main, 0.1)}` }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 0.5 }}>{t("totalCompleted") || "Total Completed"}</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: 'success.main' }}>{categoryStats.reduce((acc, curr) => acc + curr.completed, 0)}</Typography>
                </Box>

                <Box sx={{ p: 2, borderRadius: 4, bgcolor: alpha(theme.palette.info.main, 0.05), border: `1px solid ${alpha(theme.palette.info.main, 0.1)}` }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 0.5 }}>{t("avgProgress") || "Avg. Progress"}</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: 'info.main' }}>
                  {categoryStats.filter(s => s.total > 0).length > 0 
                    ? Math.round(categoryStats.filter(s => s.total > 0).reduce((acc, curr) => acc + curr.percentage, 0) / categoryStats.filter(s => s.total > 0).length) 
                    : 0}%
                </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Category Cards with Enhanced Design */}
            {categoryStats.map((cat, index) => {
              const cardColor = CHART_COLORS[index % CHART_COLORS.length];
              return (
                <Grid item xs={12} sm={6} md={4} key={cat.name}>
                  <motion.div
                    variants={itemVariants}
                    style={{ height: '100%', position: 'relative' }}
                  >
                    <Box 
                      component={Link} 
                      to={`/goals?category=${encodeURIComponent(cat.name)}`}
                      sx={{ textDecoration: 'none', height: '100%', display: 'block' }}
                    >
                      <CategoryCard 
                        category={t(`cat${cat.name}`) !== `cat${cat.name}` ? t(`cat${cat.name}`) : cat.name}
                        activeCount={cat.active}
                        completedCount={cat.completed}
                        pausedCount={cat.paused}
                        progress={cat.percentage}
                        lastUpdated={lastUpdatedForCategory(cat.name)}
                        color={cardColor}
                      />
                    </Box>
                    
                    <Box sx={{ position: 'absolute', top: 15, right: 15, display: 'flex', gap: 1, zIndex: 2 }}>
                      <MuiTooltip title={t("createNewGoal") || "Add Goal"}>
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`/goals/new?category=${encodeURIComponent(cat.name)}`);
                          }}
                          sx={{ 
                            bgcolor: alpha(cardColor, 0.1), 
                            color: cardColor, 
                            '&:hover': { bgcolor: alpha(cardColor, 0.2), transform: 'scale(1.1)' },
                            transition: 'all 0.2s'
                          }}
                        >
                          <AddIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </MuiTooltip>

                      {!["Personal", "Work", "Health", "Study", "Other"].includes(cat.name) && (
                        <MuiTooltip title={t("rename")}>
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.preventDefault();
                              handleOpenRename(e, cat.name);
                            }}
                            sx={{ 
                              bgcolor: alpha(cardColor, 0.1), 
                              color: cardColor, 
                              '&:hover': { bgcolor: alpha(cardColor, 0.2), transform: 'scale(1.1)' },
                              transition: 'all 0.2s'
                            }}
                          >
                            <EditIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </MuiTooltip>
                      )}
                    </Box>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        )}
      </motion.div>

      {/* Rename Dialog */}
      <Dialog 
        open={renameDialogOpen} 
        onClose={() => setRenameDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 5, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 900 }}>{t("renameCategory")}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
            {t("renameCategoryDesc")}
          </Typography>
          <TextField
            fullWidth
            autoFocus
            label={t("newCategoryName")}
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setRenameDialogOpen(false)} sx={{ fontWeight: 700, color: 'text.secondary' }}>
            {t("cancel")}
          </Button>
          <Button 
            onClick={handleRenameSubmit} 
            variant="contained" 
            sx={{ fontWeight: 800, borderRadius: 3, px: 3 }}
          >
            {t("rename")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Categories;
