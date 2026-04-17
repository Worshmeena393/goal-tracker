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
  Divider,
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
              {t("performanceOverview") || "Performance Overview"}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, maxWidth: 700, lineHeight: 1.6, fontSize: '1.1rem' }}>
              {t("visualSummary") || "A complete visual summary of your journey across all categories."}
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
            <Grid item xs={12}>
              <Paper
                component={motion.div}
                variants={itemVariants}
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4, md: 5 },
                  borderRadius: 8,
                  bgcolor: isDark ? alpha(theme.palette.background.paper, 0.4) : "white",
                  backdropFilter: 'blur(20px)',
                  border: "1px solid",
                  borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
                  boxShadow: isDark ? "0 30px 60px rgba(0,0,0,0.4)" : "0 30px 60px rgba(0,0,0,0.05)",
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Subtle background decoration */}
                <Box sx={{ position: 'absolute', top: 0, right: 0, width: '30%', height: '100%', background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.03)})`, pointerEvents: 'none' }} />

                <Box sx={{ mb: 5, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.1), 
                        color: 'primary.main', 
                        width: 56, 
                        height: 56,
                        boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                      }}
                    >
                      <StatsIcon sx={{ fontSize: 28 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
                        {t("analyticalBreakdown") || "Analytical Breakdown"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, opacity: 0.8 }}>
                        {t("balanceAndProgress") || "Balance and Progress Overview"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                        {t("totalGoals") || "Total Goals"}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', lineHeight: 1 }}>
                        {categoryStats.reduce((acc, curr) => acc + curr.total, 0)}
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ mx: 1, opacity: 0.5 }} />
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                        {t("avgProgress") || "Avg. Progress"}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 900, color: 'secondary.main', lineHeight: 1 }}>
                        {categoryStats.filter(s => s.total > 0).length > 0 
                          ? Math.round(categoryStats.filter(s => s.total > 0).reduce((acc, curr) => acc + curr.percentage, 0) / categoryStats.filter(s => s.total > 0).length) 
                          : 0}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Box sx={{ height: { xs: 300, sm: 350, md: 450 }, width: "100%", position: 'relative', zIndex: 1 }}>
                  {categoryStats.some(s => s.total > 0) ? (
                    <AdvancedChart
                      type="composed"
                      data={categoryStats.filter(s => s.total > 0).map(s => ({ 
                        name: t(`cat${s.name}`) !== `cat${s.name}` ? t(`cat${s.name}`) : s.name, 
                        count: s.total,
                        progress: s.percentage
                      }))}
                      colors={[theme.palette.primary.main, theme.palette.secondary.main]}
                      height="100%"
                      showGrid={true}
                      barName={t("totalGoals") || "Total Goals"}
                      lineName={t("avgProgress") || "Avg. Progress"}
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

            {/* Quick Stats Grid - Moving this below or removing if redundant */}
            <Grid item xs={12}>
               <Grid container spacing={3}>
                 <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 3, borderRadius: 5, bgcolor: alpha(theme.palette.primary.main, 0.05), border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`, textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1 }}>{t("totalCategories") || "Total Categories"}</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main' }}>{categoryStats.length}</Typography>
                    </Paper>
                 </Grid>
                 <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 3, borderRadius: 5, bgcolor: alpha(theme.palette.success.main, 0.05), border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`, textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1 }}>{t("totalCompleted") || "Total Completed"}</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 900, color: 'success.main' }}>{categoryStats.reduce((acc, curr) => acc + curr.completed, 0)}</Typography>
                    </Paper>
                 </Grid>
                 <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 3, borderRadius: 5, bgcolor: alpha(theme.palette.info.main, 0.05), border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`, textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1 }}>{t("activeGoals") || "Active Goals"}</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 900, color: 'info.main' }}>{categoryStats.reduce((acc, curr) => acc + curr.active, 0)}</Typography>
                    </Paper>
                 </Grid>
               </Grid>
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
