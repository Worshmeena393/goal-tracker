import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useMemo, useEffect } from "react";
import { GoalsContext } from "../context/GoalsContext";
import { LanguageContext } from "../context/LanguageContext";
import { useNotification } from "../context/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  LinearProgress,
  Paper,
  Avatar,
  Tooltip as MuiTooltip,
  useTheme,
  alpha,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  Add as AddIcon,
  History as HistoryIcon,
  Analytics as AnalyticsIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  EmojiEvents as TrophyIcon,
  CalendarToday as CalendarIcon,
  Category as CategoryIcon,
  Flag as GoalIcon,
  Person as PersonalIcon,
  Work as WorkIcon,
  Favorite as HealthIcon,
  School as StudyIcon,
} from "@mui/icons-material";
import {
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

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

function GoalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { goals, logProgress, updateGoal, toggleGoalStatus, deleteGoal, triggerConfetti } = useContext(GoalsContext);
  const { t, formatDate } = useContext(LanguageContext);
  const { showNotification } = useNotification();

  const goal = useMemo(() => goals.find((g) => String(g.id) === String(id)), [goals, id]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [editData, setEditData] = useState({
    title: "",
    category: "Personal",
    timeUnit: "minutes",
    target: 1,
  });
  const [logAmount, setLogAmount] = useState(1);

  // Update edit state when goal is loaded
  useEffect(() => {
    if (goal) {
      setTimeout(() => {
        setEditData({
          title: goal.title || "",
          category: goal.category || "Personal",
          timeUnit: goal.timeUnit || "minutes",
          target: goal.target || 1,
        });
      }, 0);
    }
  }, [goal]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const chartData = useMemo(() => {
    try {
      if (!goal || !Array.isArray(goal.logs) || goal.logs.length === 0) return [];
      let total = 0;
      const data = goal.logs.map((log) => {
        const amount = Number(log.amount);
        if (isNaN(amount)) return null;
        total += amount;
        return {
          date: formatDate(log.date) || "—",
          progress: total,
        };
      }).filter(Boolean);
      return data;
    } catch (err) {
      console.error("Chart data error:", err);
      return [];
    }
  }, [goal, formatDate]);

  const handleUpdate = () => {
    if (!goal) return;
    updateGoal(goal.id, {
      ...goal,
      title: editData.title,
      category: editData.category,
      timeUnit: editData.timeUnit,
      target: Number(editData.target),
    });
    setIsEditDialogOpen(false);
    showNotification(t("notificationUpdated") || "Goal updated!", "success");
  };

  const handleDelete = () => {
    if (!goal) return;
    
    // First navigate, then delete to avoid rendering an undefined goal state
    navigate("/dashboard", { replace: true });
    
    // Small timeout to ensure navigation has started before state update triggers re-render
    setTimeout(() => {
      deleteGoal(goal.id);
      setOpenDeleteDialog(false);
      showNotification(t("notificationDeleted") || "Goal deleted successfully", "success");
    }, 50);
  };

  const progressPercent = useMemo(() => {
    if (!goal || !goal.target || goal.target <= 0) return 0;
    return Math.min(Math.round(((goal.progress || 0) / goal.target) * 100), 100);
  }, [goal]);

  const categoriesWithIcons = useMemo(() => [
    { id: "Personal", name: t("catPersonal") || "Personal", icon: <PersonalIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} /> },
    { id: "Work", name: t("catWork") || "Work", icon: <WorkIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.secondary.main }} /> },
    { id: "Health", name: t("catHealth") || "Health", icon: <HealthIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.success.main }} /> },
    { id: "Study", name: t("catStudy") || "Study", icon: <StudyIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.info.main }} /> },
    { id: "Other", name: t("catOther") || "Other", icon: <CategoryIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.warning.main }} /> },
  ], [t, theme.palette.primary.main, theme.palette.secondary.main, theme.palette.success.main, theme.palette.info.main, theme.palette.warning.main]);

  const allCategories = useMemo(() => {
    const existing = new Set(categoriesWithIcons.map(c => c.id));
    const fromGoals = goals
      .map(g => g.category)
      .filter(c => c && !existing.has(c));
    
    const uniqueFromGoals = [...new Set(fromGoals)].map(cat => ({
      id: cat,
      name: cat,
      icon: <CategoryIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} />
    }));

    return [...categoriesWithIcons, ...uniqueFromGoals];
  }, [goals, categoriesWithIcons, theme.palette.primary.main]);

  const handleAddCategorySubmit = () => {
    if (customCategory.trim()) {
      const newCat = customCategory.trim();
      setEditData(prev => ({ ...prev, category: newCat }));
      setCustomCategory("");
      setShowAddCategory(false);
      showNotification(t("categoryAdded") || `Category "${newCat}" added!`, "success");
    }
  };

  if (!goal) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>{t("goalNotFound")}</Typography>
        <Button variant="contained" onClick={() => navigate("/dashboard")} sx={{ mt: 2 }}>
          {t("back")}
        </Button>
      </Container>
    );
  }

  return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        {/* Header Navigation */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Button 
            variant="text"
            size="small"
            startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />} 
            onClick={() => navigate(-1)}
            sx={{ fontWeight: 800, borderRadius: 2, fontSize: '0.8rem', color: 'text.secondary' }}
          >
            {t("back") || "Back"}
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <MuiTooltip title={t("edit")}>
              <IconButton 
                onClick={() => setIsEditDialogOpen(true)} 
                sx={{ 
                  bgcolor: isDark ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.primary.main, 0.05), 
                  color: 'primary.main',
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                }}
              >
                <EditIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </MuiTooltip>
            <MuiTooltip title={t("delete")}>
              <IconButton 
                onClick={() => setOpenDeleteDialog(true)} 
                sx={{ 
                  bgcolor: isDark ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.error.main, 0.05), 
                  color: 'error.main',
                  '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) }
                  }}


              >
                <DeleteIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </MuiTooltip>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Main Goal Card */}
          <Grid item xs={12}>
            <Card component={motion.div} variants={itemVariants} sx={{ borderRadius: 6, position: 'relative', overflow: 'hidden', border: 'none', boxShadow: isDark ? "0 20px 40px rgba(0,0,0,0.3)" : "0 20px 40px rgba(0,0,0,0.05)" }}>
              {/* Decorative Accent */}
              <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 6, bgcolor: 'primary.main' }} />
              
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={12} md={7}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Chip 
                        icon={<CategoryIcon sx={{ fontSize: '14px !important' }} />}
                        label={t(`cat${goal.category}`) !== `cat${goal.category}` ? t(`cat${goal.category}`) : goal.category} 
                        sx={{ fontWeight: 800, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', borderRadius: 2, px: 1 }} 
                      />
                      <Chip 
                        label={t(goal.status).toUpperCase()} 
                        color={goal.status === "active" ? "success" : (goal.status === "completed" ? "info" : "default")} 
                        sx={{ fontWeight: 900, borderRadius: 2, fontSize: '0.65rem', letterSpacing: 1 }}
                      />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, mb: 3, letterSpacing: '-0.02em', color: 'text.primary' }}>
                      {goal.title}
                    </Typography>

                    <Box sx={{ mb: 4 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5, alignItems: 'flex-end' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.75rem' }}>
                          {t("overallProgress")}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: "primary.main" }}>
                          {progressPercent}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={progressPercent} 
                        sx={{ height: 12, borderRadius: 6, bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", "& .MuiLinearProgress-bar": { borderRadius: 6 } }}
                      />
                      <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <GoalIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                            {goal.progress} / {goal.target} {goal.type === 'time' && goal.timeUnit ? (t(goal.timeUnit) || goal.timeUnit) : (t(`unit_${goal.type}`) || t("units"))}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                            {formatDate(goal.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 5, bgcolor: isDark ? alpha(theme.palette.common.white, 0.03) : alpha(theme.palette.primary.main, 0.02), border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AddIcon sx={{ fontSize: 20, color: 'primary.main' }} /> {t("logProgress")}
                      </Typography>
                      
                      <Box sx={{ display: "flex", flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                          <TextField
                            label={t("amount")}
                            type="number"
                            value={logAmount}
                            onChange={(e) => setLogAmount(e.target.value)}
                            fullWidth
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: isDark ? alpha(theme.palette.common.white, 0.03) : 'white' } }}
                          />
                          <Button
                            variant="contained"
                            disabled={goal.status !== 'active'}
                            onClick={() => {
                              logProgress(goal.id, Number(logAmount));
                              setLogAmount(1);
                            }}
                            sx={{ borderRadius: 3, fontWeight: 800, px: 4, boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.25)}` }}
                          >
                            {t("add")}
                          </Button>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={goal.status === "active" ? <PauseIcon /> : <PlayIcon />}
                            onClick={() => toggleGoalStatus(goal.id)}
                            sx={{ 
                              borderRadius: 3, 
                              fontWeight: 800, 
                              height: 48,
                              borderColor: goal.status === "active" ? alpha(theme.palette.warning.main, 0.3) : alpha(theme.palette.success.main, 0.3),
                              color: goal.status === "active" ? 'warning.main' : 'success.main',
                              bgcolor: alpha(goal.status === "active" ? theme.palette.warning.main : theme.palette.success.main, 0.05),
                              '&:hover': {
                                bgcolor: alpha(goal.status === "active" ? theme.palette.warning.main : theme.palette.success.main, 0.1),
                                borderColor: goal.status === "active" ? 'warning.main' : 'success.main',
                                transform: 'translateY(-2px)'
                              }
                            }}
                          >
                            {goal.status === "active" ? t("pause") : (goal.status === "completed" ? t("restore") : t("resume"))}
                          </Button>
                          
                          {goal.status === 'active' && (
                            <Button
                              fullWidth
                              variant="contained"
                              color="success"
                              startIcon={<CheckIcon />}
                              onClick={() => {
                                updateGoal(goal.id, { ...goal, progress: goal.target, status: 'completed' });
                                triggerConfetti();
                                showNotification(`Goal "${goal.title}" Completed! 🎉`, "success");
                              }}
                              sx={{ 
                                borderRadius: 3, 
                                fontWeight: 800, 
                                height: 48,
                                boxShadow: `0 8px 16px ${alpha(theme.palette.success.main, 0.25)}`,
                                '&:hover': { 
                                  bgcolor: 'success.dark',
                                  transform: 'translateY(-2px)',
                                  boxShadow: `0 12px 20px ${alpha(theme.palette.success.main, 0.35)}`,
                                }
                              }}
                            >
                              {t("markAsComplete")}
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Analytics Section */}
          <Grid item xs={12} md={8}>
            <Paper component={motion.div} variants={itemVariants} sx={{ borderRadius: 6, p: { xs: 2, md: 3 }, height: "100%", border: "none", bgcolor: isDark ? alpha(theme.palette.background.paper, 0.6) : "white", boxShadow: isDark ? "0 15px 35px rgba(0,0,0,0.2)" : "0 15px 35px rgba(0,0,0,0.03)" }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AnalyticsIcon sx={{ color: 'secondary.main' }} /> {t("analytics")}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main', lineHeight: 1 }}>{goal.logs?.length || 0}</Typography>
                    <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.65rem' }}>{t("totalLogs")}</Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: 'secondary.main', lineHeight: 1 }}>{goal.progress}</Typography>
                    <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.65rem' }}>{t("totalProgress")}</Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ width: '100%', height: 300, mt: 2 }}>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.2}/>
                          <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontWeight: 700, fontSize: 11, fill: theme.palette.text.secondary }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontWeight: 700, fontSize: 11, fill: theme.palette.text.secondary }} 
                      />
                      <ChartTooltip 
                        contentStyle={{ 
                          borderRadius: 16, 
                          border: 'none', 
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
                          fontWeight: 800,
                          backgroundColor: isDark ? theme.palette.background.paper : '#fff'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="progress" 
                        stroke={theme.palette.primary.main} 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorProgress)"
                        dot={{ r: 5, fill: theme.palette.primary.main, strokeWidth: 3, stroke: isDark ? '#1e1e1e' : '#fff' }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.4 }}>
                    <InfoIcon sx={{ fontSize: 48, mb: 1.5, color: 'text.disabled' }} />
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>{t("noAnalyticsData") || "No analytics data yet"}</Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* History Section */}
          <Grid item xs={12} md={4}>
            <Paper component={motion.div} variants={itemVariants} sx={{ borderRadius: 6, p: 3, height: "100%", border: "none", bgcolor: isDark ? alpha(theme.palette.background.paper, 0.6) : "white", boxShadow: isDark ? "0 15px 35px rgba(0,0,0,0.2)" : "0 15px 35px rgba(0,0,0,0.03)" }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 900, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <HistoryIcon sx={{ color: 'primary.main' }} /> {t("history")}
              </Typography>
              
              <List sx={{ p: 0, '& .MuiListItem-root': { px: 0, py: 2 } }}>
                <AnimatePresence>
                  {Array.isArray(goal.logs) && goal.logs.length > 0 ? (
                    goal.logs.slice().reverse().map((log, index) => (
                      <ListItem 
                        key={index} 
                        component={motion.li}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        divider={index !== goal.logs.length - 1}
                      >
                        <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main', mr: 2, width: 40, height: 40, borderRadius: 2 }}>
                          <TrophyIcon sx={{ fontSize: 20 }} />
                        </Avatar>
                        <ListItemText 
                          primary={
                            <Typography sx={{ fontWeight: 900, color: 'text.primary', fontSize: '0.95rem' }}>
                              +{log.amount} {goal.type === 'time' && goal.timeUnit ? (t(goal.timeUnit) || goal.timeUnit) : (t(`unit_${goal.type}`) || t("units"))}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                              <CalendarIcon sx={{ fontSize: 12 }} /> {formatDate(log.date)}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Box sx={{ py: 6, textAlign: 'center', opacity: 0.4 }}>
                      <HistoryIcon sx={{ fontSize: 48, mb: 1.5, color: 'text.disabled' }} />
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{t("noData")}</Typography>
                    </Box>
                  )}
                </AnimatePresence>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog 
        open={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 5, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.4rem', pb: 1 }}>{t("editGoal")}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField
              label={t("goalTitle")}
              name="title"
              value={editData.title}
              onChange={handleEditChange}
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
            
            <FormControl fullWidth variant="filled" sx={{ '& .MuiFilledInput-root': { borderRadius: 3, p: 1 } }}>
              <InputLabel sx={{ fontWeight: 800, px: 1 }}>{t("category")}</InputLabel>
              <Select
                name="category"
                value={editData.category}
                onChange={handleEditChange}
                disableUnderline
                renderValue={(selected) => {
                  const cat = allCategories.find(c => c.id === selected);
                  return (
                    <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 700 }}>
                      {cat?.icon} {cat?.name}
                    </Box>
                  );
                }}
              >
                {allCategories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id} sx={{ fontWeight: 700, py: 1.5 }}>
                    {cat.icon} {cat.name}
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem 
                  onClick={() => setShowAddCategory(true)} 
                  sx={{ fontWeight: 900, py: 1.5, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <AddIcon fontSize="small" /> {t("addNewCategory") || "Add New Category"}
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              label={t("target")}
              name="target"
              type="number"
              value={editData.target}
              onChange={handleEditChange}
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />

            {goal.type === 'time' && (
              <FormControl fullWidth variant="filled" sx={{ '& .MuiFilledInput-root': { borderRadius: 3, p: 1 } }}>
                <InputLabel sx={{ fontWeight: 800, px: 1 }}>{t("unit") || "Unit"}</InputLabel>
                <Select
                  name="timeUnit"
                  value={editData.timeUnit}
                  onChange={handleEditChange}
                  disableUnderline
                >
                  <MenuItem value="seconds">{t("seconds") || "Seconds"}</MenuItem>
                  <MenuItem value="minutes">{t("minutes") || "Minutes"}</MenuItem>
                  <MenuItem value="hours">{t("hours") || "Hours"}</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setIsEditDialogOpen(false)} sx={{ fontWeight: 800, color: 'text.secondary' }}>
            {t("cancel")}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleUpdate}
            startIcon={<SaveIcon />}
            sx={{ borderRadius: 3, fontWeight: 900, px: 4 }}
          >
            {t("saveChanges") || "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{ sx: { borderRadius: 5, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.3rem' }}>{t("confirmDelete")}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            {t("confirmDeleteDesc") || "Are you sure you want to delete this goal? This action cannot be undone."}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setOpenDeleteDialog(false)} sx={{ fontWeight: 800, color: 'text.secondary' }}>
            {t("cancel")}
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained" 
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ fontWeight: 900, borderRadius: 3, px: 4 }}
          >
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog 
        open={showAddCategory} 
        onClose={() => setShowAddCategory(false)}
        PaperProps={{ sx: { borderRadius: 5, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 900 }}>{t("addNewCategory") || "Add New Category"}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
            {t("addNewCategoryDesc") || "Enter a name for your new category."}
          </Typography>
          <TextField
            fullWidth
            autoFocus
            label={t("categoryName") || "Category Name"}
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowAddCategory(false)} sx={{ fontWeight: 700, color: 'text.secondary' }}>
            {t("cancel")}
          </Button>
          <Button 
            onClick={handleAddCategorySubmit} 
            variant="contained" 
            sx={{ fontWeight: 800, borderRadius: 3, px: 3 }}
          >
            {t("add")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default GoalDetails;
