import { useContext, useState, useMemo, useEffect } from "react";
import { GoalsContext } from "../context/GoalsContext";
import { LanguageContext } from "../context/LanguageContext";
import { useNotification } from "../context/NotificationContext";
import EmptyState from "../components/EmptyState";
import GoalCard from "../components/GoalCard";
import { SkeletonCard } from "../components/LoadingStates";
import { motion, AnimatePresence } from "framer-motion";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Button,
  Pagination,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Paper,
  Tooltip,
  Snackbar,
  Alert,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  ClearAll as ClearIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function Goals() {
  const { goals, logProgress, toggleGoalStatus, deleteGoal, loading } = useContext(GoalsContext);
  const { t } = useContext(LanguageContext);
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("category") || "all";
  });
  const [sortCriteria, setSortCriteria] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  // Get category from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    if (cat && cat !== categoryFilter) {
      setTimeout(() => setCategoryFilter(cat), 0);
    }
  }, [location.search, categoryFilter]);

  const categories = useMemo(() => {
    const cats = [...new Set(goals.map((g) => g.category || "General"))];
    return cats.sort();
  }, [goals]);

  const pageSize = 8;

  const processedGoals = useMemo(() => {
    let data = [...goals];

    if (statusFilter !== "all") {
      data = data.filter((g) => g.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      data = data.filter((g) => (g.category || "General") === categoryFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          (g.notes || "").toLowerCase().includes(q)
      );
    }

    // Sort
    data.sort((a, b) => {
      if (sortCriteria === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortCriteria === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortCriteria === "progress") return (b.progress / b.target) - (a.progress / a.target);
      if (sortCriteria === "title") return a.title.localeCompare(b.title);
      return 0;
    });

    return data;
  }, [goals, statusFilter, categoryFilter, sortCriteria, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(processedGoals.length / pageSize));
  
  // Safe page access
  const safePage = Math.min(page, totalPages);
  const paginatedGoals = processedGoals.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteGoal(deleteId);
      setDeleteId(null);
      showNotification(t("notificationDeleted") || "Goal deleted successfully", "success");
    }
  };

  const handleLogProgress = (id) => {
    logProgress(id, 1);
    showNotification(t("progressLogged") || "Progress logged! +20 XP", "success");
  };

  const handleToggleStatus = (id) => {
    toggleGoalStatus(id);
    showNotification(t("statusUpdated") || "Goal status updated", "success");
  };

  const isFiltered = statusFilter !== "all" || categoryFilter !== "all" || searchQuery !== "" || sortCriteria !== "newest";

  const clearFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("all");
    setSearchQuery("");
    setSortCriteria("newest");
    // Also clear query params
    navigate("/goals", { replace: true });
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        width: '100%',
        minHeight: '100vh',
        maxWidth: 1600,
        mx: 'auto',
        py: { xs: 3, sm: 4, md: 6 },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: { xs: 2, sm: 2.5, md: 3 }, flexWrap: "wrap", gap: { xs: 1, sm: 1.5, md: 2 } }}>
          <Box>
            <Typography variant="overline" sx={{ letterSpacing: { xs: 0.5, sm: 0.75, md: 1 }, color: "primary.main", fontWeight: 700, fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' } }}>
              {t("goals").toUpperCase()}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>{t("manageJourney")}</Typography>
          </Box>
          <Button
            component={motion.button}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            variant="contained"
            size="large"
            startIcon={<AddIcon sx={{ fontSize: '20px !important' }} />}
            onClick={() => navigate("/goals/new")}
            sx={{ 
              borderRadius: { xs: 2, sm: 2.5, md: 3 }, 
              px: { xs: 3, sm: 4, md: 5 }, 
              py: { xs: 1.2, sm: 1.5, md: 1.8 },
              fontWeight: 900, 
              fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.05rem' },
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
              }
            }}
          >
            {t("createGoal")}
          </Button>
        </Box>

        {/* CONTROLS */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
            mb: { xs: 3, sm: 4, md: 5 },
            borderRadius: { xs: 2, sm: 2.5, md: 3 },
            bgcolor: isDark ? alpha(theme.palette.background.paper, 0.6) : "white",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            backdropFilter: "blur(10px)",
            boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.2)' : '0 10px 30px rgba(0,0,0,0.05)',
          }}
        >
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} alignItems="center">
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <TextField
                fullWidth
                size="medium"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: 3,
                    bgcolor: isDark ? alpha('#fff', 0.05) : alpha('#000', 0.02)
                  } 
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={2}>
              <FormControl fullWidth>
                <InputLabel sx={{ fontWeight: 700 }}>{t("filter")}</InputLabel>
                <Select
                  value={statusFilter}
                  label={t("filter")}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ borderRadius: 3 }}
                >
                  <MenuItem value="all">{t("all")}</MenuItem>
                  <MenuItem value="active">{t("active")}</MenuItem>
                  <MenuItem value="completed">{t("completed")}</MenuItem>
                  <MenuItem value="paused">{t("paused")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={2}>
              <FormControl fullWidth>
                <InputLabel sx={{ fontWeight: 700 }}>{t("categories")}</InputLabel>
                <Select
                  value={categoryFilter}
                  label={t("categories")}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  sx={{ borderRadius: 3 }}
                >
                  <MenuItem value="all">{t("all")}</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {t(`cat${cat}`) !== `cat${cat}` ? t(`cat${cat}`) : cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
                  <SortIcon sx={{ fontSize: 20 }} /> {t("sort")}
                </InputLabel>
                <Select
                  value={sortCriteria}
                  label={t("sort")}
                  onChange={(e) => setSortCriteria(e.target.value)}
                  sx={{ borderRadius: 3 }}
                >
                  <MenuItem value="newest">{t("newest")}</MenuItem>
                  <MenuItem value="title">{t("title")}</MenuItem>
                  <MenuItem value="progress">{t("sortByProgress")}</MenuItem>
                  <MenuItem value="category">{t("sortByCategory")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={2}>
              <AnimatePresence>
                {isFiltered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Button
                      component={motion.button}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      fullWidth
                      variant="outlined"
                      color="secondary"
                      startIcon={<ClearIcon />}
                      onClick={clearFilters}
                      sx={{ 
                        borderRadius: 3, 
                        py: 1.2, 
                        fontWeight: 800,
                        borderWidth: 2,
                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          borderWidth: 2,
                          boxShadow: `0 6px 15px ${alpha(theme.palette.secondary.main, 0.2)}`
                        }
                      }}
                    >
                      {t("clear")}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Grid>
          </Grid>
        </Paper>

        {/* GOALS GRID */}
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} justifyContent="center">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={`skeleton-goal-${i}`}>
                  <SkeletonCard height={300} />
                </Grid>
              ))
            ) : paginatedGoals.length > 0 ? (
              paginatedGoals.map((goal) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={goal.id} component={motion.div} layout variants={itemVariants} exit={{ opacity: 0, scale: 0.9 }}>
                  <GoalCard
                    goal={goal}
                    onLog={handleLogProgress}
                    onToggleStatus={handleToggleStatus}
                    onDelete={setDeleteId}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <EmptyState 
                  message={t("noGoalsFound")} 
                  subMessage={t("noGoalsMatch")}
                  actionLabel={isFiltered ? t("clear") : t("newGoal")}
                  onAction={isFiltered ? clearFilters : () => navigate("/goals/new")}
                />
              </Grid>
            )}
          </AnimatePresence>
        </Grid>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 3, sm: 3.5, md: 4 } }}>
            <Pagination
              count={totalPages}
              page={safePage}
              onChange={(_, v) => setPage(v)}
              color="primary"
              sx={{
                "& .MuiPaginationItem-root": {
                  fontWeight: 700,
                  borderRadius: { xs: 1.5, sm: 1.75, md: 2 },
                },
              }}
            />
          </Box>
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

export default Goals;