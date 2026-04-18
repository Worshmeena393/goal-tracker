import { useContext, useState, useEffect, useMemo } from "react";
import { GoalsContext } from "../context/GoalsContext";
import { LanguageContext } from "../context/LanguageContext";
import { useNotification } from "../context/NotificationContext";
import {
  Container,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CardContent,
  Grid,
  Paper,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Flag as GoalIcon,
  Category as CategoryIcon,
  Timeline as TimelineIcon,
  Notes as NotesIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  Add as AddIcon,
  Person as PersonalIcon,
  Work as WorkIcon,
  Favorite as HealthIcon,
  School as StudyIcon,
} from "@mui/icons-material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion } from 'framer-motion';

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

function NewGoal() {
  const { id } = useParams();
  const isEdit = !!id;
  const { addGoal, goals, updateGoal, renameCategory } = useContext(GoalsContext);
  const { t } = useContext(LanguageContext);
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [formData, setFormData] = useState({
    title: "",
    category: "Personal",
    type: "count",
    target: 10,
    notes: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });

  const [errors, setErrors] = useState({});
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");

  const location = useLocation();
  const categoryParam = useMemo(() => new URLSearchParams(location.search).get("category"), [location.search]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    // Check if category is passed via URL query params
    if (categoryParam) {
      setFormData(prev => ({ ...prev, category: categoryParam }));
    }

    if (isEdit && goals.length > 0) {
      const goal = goals.find(g => String(g.id) === String(id));
      if (goal) {
        setFormData({
          title: goal.title || "",
          category: goal.category || "Personal",
          type: goal.type || "count",
          target: goal.target || 10,
          notes: goal.notes || "",
          startDate: goal.startDate || new Date().toISOString().split("T")[0],
          endDate: goal.endDate || "",
        });
      }
    }
  }, [isEdit, id, goals, categoryParam]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const categoriesWithIcons = useMemo(() => [
    { id: "Personal", name: t("catPersonal") || "Personal", icon: <PersonalIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} /> },
    { id: "Work", name: t("catWork") || "Work", icon: <WorkIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.secondary.main }} /> },
    { id: "Health", name: t("catHealth") || "Health", icon: <HealthIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.success.main }} /> },
    { id: "Study", name: t("catStudy") || "Study", icon: <StudyIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.info.main }} /> },
    { id: "Other", name: t("catOther") || "Other", icon: <CategoryIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.warning.main }} /> },
  ], [t, theme.palette.primary.main, theme.palette.secondary.main, theme.palette.success.main, theme.palette.info.main, theme.palette.warning.main]);

  // Add all existing categories from goals to the list
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

  const typesWithIcons = useMemo(() => [
    { id: "count", name: t("count") || "Count-based", icon: <TimelineIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.primary.main }} /> },
    { id: "time", name: t("time") || "Time-based", icon: <TimelineIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.info.main }} /> },
    { id: "daily", name: t("daily") || "Daily", icon: <CalendarIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.success.main }} /> },
  ], [t, theme.palette.primary.main, theme.palette.info.main, theme.palette.success.main]);

  const handleOpenRename = (e, name) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    // Don't allow renaming predefined categories if you want to keep them stable
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
      
      // Also update the local form state if the current goal is in that category
      if (formData.category === selectedCategory) {
        setFormData(prev => ({ ...prev, category: newCategoryName.trim() }));
      }
    }
    setRenameDialogOpen(false);
  };

  const handleAddCategorySubmit = () => {
    if (customCategory.trim()) {
      const newCat = customCategory.trim();
      setFormData(prev => ({ ...prev, category: newCat }));
      setCustomCategory("");
      setShowAddCategory(false);
      showNotification(t("categoryAdded") || `Category "${newCat}" added!`, "success");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = t("errorRequired") || "Title is required";
    if (formData.title.trim().length < 3) newErrors.title = t("errorMinLength") || "Title must be at least 3 characters";
    if (!formData.target || formData.target <= 0) newErrors.target = t("errorInvalid") || "Target must be greater than 0";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const goalData = {
      ...formData,
      title: formData.title.trim(),
      target: Number(formData.target),
      notes: (formData.notes || "").trim(),
    };

    if (isEdit) {
      updateGoal(id, goalData);
      showNotification(t("notificationUpdated") || "Goal updated!", "success");
    } else {
      addGoal(goalData);
      showNotification(t("goalAdded") || "Goal added!", "success");
    }
    navigate("/goals");
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={CONTAINER_VARIANTS}>
      <Container maxWidth="md" sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
        <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 2.5 }}>
          <Button 
            onClick={() => navigate(-1)} 
            sx={{ 
              bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              p: 1.5,
              minWidth: 0,
              borderRadius: 3,
              color: 'text.primary',
              '&:hover': { transform: 'translateX(-4px)', bgcolor: alpha(theme.palette.primary.main, 0.1) }
            }}
          >
            <ArrowBackIcon />
          </Button>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.02em', mb: 0.5 }}>
              {isEdit ? t("editGoal") : t("createNewGoal")}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
              {isEdit ? t("updateYourProgress") : t("startNewJourney")}
            </Typography>
          </Box>
        </Box>

        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, sm: 4, md: 5 }, 
            borderRadius: { xs: 3, sm: 4, md: 5 }, 
            bgcolor: isDark ? alpha(theme.palette.background.paper, 0.6) : "white",
            backdropFilter: "blur(20px)",
            border: "1px solid",
            borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
            boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.3)' : '0 20px 50px rgba(0,0,0,0.08)',
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label={t("goalTitle")}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={!!errors.title}
                  helperText={errors.title}
                  variant="filled"
                  InputProps={{ 
                    disableUnderline: true, 
                    sx: { borderRadius: 3, fontWeight: 700, p: 1 },
                    startAdornment: <GoalIcon sx={{ mr: 1, color: 'primary.main', opacity: 0.7 }} />
                  }}
                  InputLabelProps={{ sx: { fontWeight: 800, px: 1 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CategoryIcon sx={{ fontSize: 18, color: 'primary.main' }} /> {t("category")?.toUpperCase() || "CATEGORY"}
                  </Typography>
                  <Grid container spacing={1.5}>
                    {allCategories.map((cat) => {
                      const isPredefined = ["Personal", "Work", "Health", "Study", "Other"].includes(cat.id);
                      const isSelected = formData.category === cat.id;
                      return (
                        <Grid item key={cat.id}>
                          <Box
                            component={motion.div}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleChange({ target: { name: 'category', value: cat.id } })}
                            sx={{
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              px: 2,
                              py: 1.2,
                              borderRadius: 3,
                              border: '2px solid',
                              borderColor: isSelected ? 'primary.main' : 'divider',
                              bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                              transition: 'all 0.2s ease',
                              position: 'relative',
                              '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: alpha(theme.palette.primary.main, 0.04)
                              }
                            }}
                          >
                            <Box sx={{ color: isSelected ? 'primary.main' : 'text.secondary', display: 'flex' }}>
                              {cat.icon}
                            </Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: isSelected ? 'primary.main' : 'text.primary' }}>
                              {cat.name}
                            </Typography>
                            {!isPredefined && (
                              <IconButton 
                                size="small" 
                                onClick={(e) => handleOpenRename(e, cat.id)}
                                sx={{ 
                                  ml: 1, 
                                  p: 0.5,
                                  opacity: 0.5, 
                                  '&:hover': { opacity: 1, bgcolor: alpha(theme.palette.primary.main, 0.1) } 
                                }}
                              >
                                <EditIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            )}
                            {isSelected && (
                              <Box sx={{ 
                                position: 'absolute', 
                                top: -6, 
                                right: -6, 
                                width: 16, 
                                height: 16, 
                                borderRadius: '50%', 
                                bgcolor: 'primary.main',
                                border: '2px solid white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                              }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'white' }} />
                              </Box>
                            )}
                          </Box>
                        </Grid>
                      );
                    })}
                    <Grid item>
                      <Box
                        component={motion.div}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddCategory(true)}
                        sx={{
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          px: 2,
                          py: 1.2,
                          borderRadius: 3,
                          border: '2px dashed',
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          bgcolor: alpha(theme.palette.primary.main, 0.02),
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.06),
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`
                          }
                        }}
                      >
                        <AddIcon sx={{ fontSize: 18 }} />
                        <Typography sx={{ fontWeight: 900, fontSize: '0.85rem' }}>
                          {t("add") || "Add"}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimelineIcon sx={{ fontSize: 18, color: 'primary.main' }} /> {t("goalType")?.toUpperCase() || "GOAL TYPE"}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {typesWithIcons.map((type) => (
                      <Box
                        key={type.id}
                        component={motion.div}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleChange({ target: { name: 'type', value: type.id } })}
                        sx={{
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          px: 2.5,
                          py: 1.5,
                          borderRadius: 3,
                          border: '2px solid',
                          borderColor: formData.type === type.id ? 'primary.main' : 'divider',
                          bgcolor: formData.type === type.id ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: alpha(theme.palette.primary.main, 0.04)
                          }
                        }}
                      >
                        {type.icon}
                        <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: formData.type === type.id ? 'primary.main' : 'text.primary' }}>
                          {type.name}
                        </Typography>
                        {formData.type === type.id && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
                          </motion.div>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label={t("target")}
                  name="target"
                  value={formData.target}
                  onChange={handleChange}
                  error={!!errors.target}
                  helperText={errors.target}
                  variant="filled"
                  InputProps={{ 
                    disableUnderline: true, 
                    sx: { borderRadius: 3, fontWeight: 700, p: 1 },
                    startAdornment: <EditIcon sx={{ mr: 1, color: 'primary.main', opacity: 0.7 }} />
                  }}
                  InputLabelProps={{ sx: { fontWeight: 800, px: 1 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label={t("endDate")}
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  variant="filled"
                  InputProps={{ 
                    disableUnderline: true, 
                    sx: { borderRadius: 3, fontWeight: 700, p: 1 },
                    startAdornment: <CalendarIcon sx={{ mr: 1, color: 'primary.main', opacity: 0.7 }} />
                  }}
                  InputLabelProps={{ shrink: true, sx: { fontWeight: 800, px: 1 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label={t("notes") || "Notes"}
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder={t("notesPlaceholder") || "Enter goal description or notes..."}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 4,
                      fontWeight: 600,
                      bgcolor: isDark ? alpha(theme.palette.background.paper, 0.4) : alpha(theme.palette.primary.main, 0.02),
                      '& fieldset': { borderColor: 'divider' },
                      '&:hover fieldset': { borderColor: 'primary.main' },
                      '&.Mui-focused fieldset': { borderWidth: '2px' }
                    }
                  }}
                  InputProps={{ 
                    startAdornment: <NotesIcon sx={{ mr: 1.5, mt: 1, alignSelf: 'flex-start', color: 'primary.main', opacity: 0.8 }} />
                  }}
                  InputLabelProps={{ sx: { fontWeight: 800 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<SaveIcon />}
                    sx={{ 
                      py: 2, 
                      borderRadius: 4, 
                      fontWeight: 900, 
                      fontSize: '1rem',
                      boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 15px 30px ${alpha(theme.palette.primary.main, 0.4)}` }
                    }}
                  >
                    {isEdit ? t("saveChanges") || "Save Changes" : t("createGoal") || "Create Goal"}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate(-1)}
                    sx={{ 
                      py: 2, 
                      px: 4, 
                      borderRadius: 4, 
                      fontWeight: 900,
                      borderColor: 'divider',
                      color: 'text.secondary',
                      '&:hover': { bgcolor: 'action.hover', transform: 'translateY(-2px)' }
                    }}
                  >
                    {t("cancel")}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>

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
    </motion.div>
  );
}

export default NewGoal;