import { useContext, useMemo, useEffect, useState } from "react";
import { GoalsContext } from "../context/GoalsContext";
import { LanguageContext } from "../context/LanguageContext";
import { useNotification } from "../context/NotificationContext";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";
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
  Download as DownloadIcon,
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

  const handleExport = () => {
    const dataStr = JSON.stringify(goals, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'goals-export.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showNotification(t("goalsExported") || "Goals exported successfully!", "success");
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

          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 1.5, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                {t("categories")}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, maxWidth: 700, lineHeight: 1.6, fontSize: '1.1rem' }}>
                {t("visualSummary") || "A complete visual summary of your journey across all categories."}
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              sx={{ mt: 1, borderRadius: 3, textTransform: 'none', fontWeight: 700 }}
            >
              {t("exportGoals") || t("export")}
            </Button>
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

                <Grid container spacing={2} alignItems="stretch">
                  <Grid item xs={12} sm={3}>
                    <Paper sx={{ p: 2.5, borderRadius: 4, bgcolor: alpha(theme.palette.primary.main, 0.08), border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 140, height: '100%' }}>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', mb: 1 }}>
                          {t("totalGoals") || "Total Goals"}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main', lineHeight: 1.05 }}>
                          {categoryStats.reduce((acc, curr) => acc + curr.total, 0)}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={categoryStats.reduce((acc, curr) => acc + curr.progress, 0) / Math.max(categoryStats.reduce((acc, curr) => acc + curr.target, 0), 1) * 100}
                          sx={{ height: 8, borderRadius: 4, mt: 1, bgcolor: alpha(theme.palette.primary.main, 0.14), '& .MuiLinearProgress-bar': { borderRadius: 4, backgroundColor: theme.palette.primary.main } }}
                        />
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Paper sx={{ p: 2.5, borderRadius: 4, bgcolor: alpha(theme.palette.secondary.main, 0.08), border: `1px solid ${alpha(theme.palette.secondary.main, 0.14)}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 140, height: '100%' }}>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', mb: 1 }}>
                          {t("avgProgress") || "Avg. Progress"}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: 'secondary.main', lineHeight: 1.05, mb: 1 }}>
                          {categoryStats.filter(s => s.total > 0).length > 0 
                            ? Math.round(categoryStats.filter(s => s.total > 0).reduce((acc, curr) => acc + curr.percentage, 0) / categoryStats.filter(s => s.total > 0).length) 
                            : 0}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={categoryStats.filter(s => s.total > 0).length > 0 
                            ? Math.round(categoryStats.filter(s => s.total > 0).reduce((acc, curr) => acc + curr.percentage, 0) / categoryStats.filter(s => s.total > 0).length) 
                            : 0}
                          sx={{ height: 8, borderRadius: 4, bgcolor: alpha(theme.palette.secondary.main, 0.14), '& .MuiLinearProgress-bar': { borderRadius: 4, backgroundColor: theme.palette.secondary.main } }}
                        />
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Paper sx={{ p: 2.5, borderRadius: 4, bgcolor: alpha(theme.palette.success.main, 0.08), border: `1px solid ${alpha(theme.palette.success.main, 0.12)}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 140, height: '100%' }}>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', mb: 1 }}>
                          {t("level")}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: 'success.main', lineHeight: 1.05 }}>
                          3200
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, opacity: 0.8, mt: 0.25 }}>
                          {t("xp")}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={100}
                          sx={{ height: 8, borderRadius: 4, mt: 1, bgcolor: alpha(theme.palette.success.main, 0.14), '& .MuiLinearProgress-bar': { borderRadius: 4, backgroundColor: theme.palette.success.main } }}
                        />
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Paper sx={{ p: 2.5, borderRadius: 4, bgcolor: alpha(theme.palette.info.main, 0.08), border: `1px solid ${alpha(theme.palette.info.main, 0.12)}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 140, height: '100%', cursor: 'pointer' }} onClick={() => navigate('/goals/new')}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', mb: 1 }}>
                          {t("createNewGoal") || "Create New Goal"}
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          sx={{ mt: 1, borderRadius: 3, textTransform: 'none', fontWeight: 700 }}
                        >
                          {t("newGoal") || "New Goal"}
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
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
