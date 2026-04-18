import { useContext, useState } from "react";
import { SettingsContext } from "../context/SettingsContext";
import { LanguageContext } from "../context/LanguageContext";
import { GoalsContext } from "../context/GoalsContext";
import { useNotification } from "../context/NotificationContext";
import { motion } from "framer-motion";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
  Paper,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
} from "@mui/material";
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Language as LanguageIcon,
  FormatSize as FormatSizeIcon,
  RestartAlt as RestartAltIcon,
  Palette as PaletteIcon,
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

function Settings() {
  const {
    fontSize,
    toggleTheme,
    increaseFontSize,
    decreaseFontSize,
    resetSettings,
  } = useContext(SettingsContext);

  const { goals, userStats } = useContext(GoalsContext);
  const { lang, toggleLang, t } = useContext(LanguageContext);
  const { showNotification } = useNotification();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [openDataResetDialog, setOpenDataResetDialog] = useState(false);

  const handleReset = () => {
    resetSettings();
    setOpenResetDialog(false);
    showNotification(t("settingsReset") || "Settings reset to default", "info");
  };

  const handleDataReset = () => {
    // Clear goals and user stats from localStorage
    localStorage.removeItem("goals");
    localStorage.removeItem("userStats");
    // Reload the page to reset the context
    window.location.reload();
  };

  const handleToggleTheme = () => {
    toggleTheme();
    showNotification(t("themeUpdated") || "Theme updated", "success");
  };

  const handleToggleLang = () => {
    toggleLang();
    showNotification(t("languageUpdated") || "Language updated", "success");
  };

  const handleFontSizeChange = (increase = true) => {
    if (increase) increaseFontSize();
    else decreaseFontSize();
    showNotification(t("fontSizeUpdated") || "Font size updated", "success");
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" sx={{ letterSpacing: 1.5, color: "primary.main", fontWeight: 800, fontSize: '0.7rem' }}>
            {t("settings").toUpperCase()}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.02em', fontSize: '1.4rem' }}>{t("settings")}</Typography>
        </Box>

        <Grid container spacing={2}>
          {/* Appearance */}
          <Grid item xs={12}>
            <Paper
              component={motion.div}
              variants={itemVariants}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 4,
                border: "1px solid",
                borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                bgcolor: isDark ? alpha(theme.palette.background.paper, 0.6) : "white",
                backdropFilter: 'blur(10px)',
                boxShadow: isDark ? "0 8px 16px rgba(0,0,0,0.4)" : "0 8px 16px rgba(0,0,0,0.03)",
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, position: 'relative' }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, width: 36, height: 36 }}>
                  <PaletteIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, fontSize: '0.9rem' }}>{t("appearance")}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>{t("customizeLook")}</Typography>
                </Box>
              </Box>
              
              <Divider sx={{ mb: 2, opacity: 0.6 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 800, mb: 0.25 }}>{t("theme")}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, maxWidth: 300, display: 'block' }}>
                    {t("themeDesc")}
                  </Typography>
                </Box>
                <ToggleButtonGroup
                  value={theme.palette.mode}
                  exclusive
                  size="small"
                  onChange={(e, val) => val && handleToggleTheme()}
                  sx={{ 
                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', 
                    borderRadius: 3,
                    p: 0.4,
                    '& .MuiToggleButton-root': {
                      border: 'none',
                      borderRadius: 2,
                      px: 2,
                      py: 0.5,
                      fontWeight: 800,
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      '&.Mui-selected': {
                        bgcolor: 'background.paper',
                        boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.05)',
                        color: 'primary.main',
                        '&:hover': { bgcolor: 'background.paper' }
                      }
                    }
                  }}
                >
                  <ToggleButton value="light">
                    <LightModeIcon sx={{ mr: 0.5, fontSize: 16 }} /> {t("light")}
                  </ToggleButton>
                  <ToggleButton value="dark">
                    <DarkModeIcon sx={{ mr: 0.5, fontSize: 16 }} /> {t("dark")}
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 800, mb: 0.25 }}>{t("fontSize")}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, maxWidth: 300, display: 'block' }}>
                    {t("fontSizeDesc")}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', p: 0.5, borderRadius: 3 }}>
                  <IconButton 
                    size="small" 
                    onClick={() => handleFontSizeChange(false)}
                    sx={{ bgcolor: 'background.paper', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', p: 0.5 }}
                    aria-label="Decrease font size"
                  >
                    <Typography variant="caption" sx={{ fontWeight: 900 }}>-</Typography>
                  </IconButton>
                  <Typography variant="caption" sx={{ minWidth: 60, textAlign: 'center', fontWeight: 900, textTransform: 'uppercase', color: 'primary.main', fontSize: '0.7rem' }}>
                    {t(fontSize)}
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => handleFontSizeChange(true)}
                    sx={{ bgcolor: 'background.paper', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', p: 0.5 }}
                    aria-label="Increase font size"
                  >
                    <Typography variant="caption" sx={{ fontWeight: 900 }}>+</Typography>
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Language */}
          <Grid item xs={12}>
            <Paper
              component={motion.div}
              variants={itemVariants}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 4,
                border: "1px solid",
                borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                bgcolor: isDark ? alpha(theme.palette.background.paper, 0.6) : "white",
                backdropFilter: 'blur(10px)',
                boxShadow: isDark ? "0 8px 16px rgba(0,0,0,0.4)" : "0 8px 16px rgba(0,0,0,0.03)",
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, position: 'relative' }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), color: theme.palette.secondary.main, width: 36, height: 36 }}>
                  <LanguageIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, fontSize: '0.9rem' }}>{t("language")}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>{t("selectLanguage")}</Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2, opacity: 0.6 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 800, mb: 0.25 }}>{t("language")}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, maxWidth: 300, display: 'block' }}>
                    {t("langDesc")}
                  </Typography>
                </Box>
                <ToggleButtonGroup
                  value={lang}
                  exclusive
                  size="small"
                  onChange={(e, val) => val && handleToggleLang()}
                  sx={{ 
                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', 
                    borderRadius: 3,
                    p: 0.4,
                    '& .MuiToggleButton-root': {
                      border: 'none',
                      borderRadius: 2,
                      px: 2,
                      py: 0.5,
                      fontWeight: 800,
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      '&.Mui-selected': {
                        bgcolor: 'background.paper',
                        boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.05)',
                        color: 'secondary.main',
                        '&:hover': { bgcolor: 'background.paper' }
                      }
                    }
                  }}
                >
                  <ToggleButton value="en">English</ToggleButton>
                  <ToggleButton value="fa">فارسی</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Paper>
          </Grid>

          {/* Data Management */}
          <Grid item xs={12}>
            <Paper
              component={motion.div}
              variants={itemVariants}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 4,
                border: "1px solid",
                borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                bgcolor: isDark ? alpha(theme.palette.background.paper, 0.6) : "white",
                backdropFilter: 'blur(10px)',
                boxShadow: isDark ? "0 8px 16px rgba(0,0,0,0.4)" : "0 8px 16px rgba(0,0,0,0.03)",
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, position: 'relative' }}>
                <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.main, width: 36, height: 36 }}>
                  <RestartAltIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, fontSize: '0.9rem' }}>Data Management</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Reset your goals and progress data</Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2, opacity: 0.6 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 800, mb: 0.25 }}>Reset All Data</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, maxWidth: 300, display: 'block' }}>
                    Clear all goals, progress, and XP data. This action cannot be undone.
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  color="warning"
                  size="small"
                  startIcon={<RestartAltIcon sx={{ fontSize: 16 }} />}
                  onClick={() => setOpenDataResetDialog(true)}
                  sx={{ 
                    borderRadius: 2, 
                    px: 2, 
                    py: 0.75, 
                    fontWeight: 800, 
                    fontSize: '0.75rem',
                    borderWidth: 1,
                    '&:hover': { borderWidth: 1, bgcolor: alpha(theme.palette.warning.main, 0.05) } 
                  }}
                >
                  Reset Data
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Danger Zone */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<RestartAltIcon sx={{ fontSize: 16 }} />}
                onClick={() => setOpenResetDialog(true)}
                sx={{ 
                  borderRadius: 2, 
                  px: 3, 
                  py: 0.75, 
                  fontWeight: 800, 
                  fontSize: '0.75rem',
                  borderWidth: 1,
                  '&:hover': { borderWidth: 1, bgcolor: alpha(theme.palette.error.main, 0.05) } 
                }}
              >
                {t("resetSettings")}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </motion.div>

      {/* Reset Confirmation Dialog */}
      <Dialog
        open={openResetDialog}
        onClose={() => setOpenResetDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1,
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.2rem', pb: 1 }}>
          {t("confirmReset") || "Are you sure?"}
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {t("confirmResetDesc") || "This will reset all your settings (theme, font size, language) to default values. This action cannot be undone."}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button 
            onClick={() => setOpenResetDialog(false)}
            sx={{ fontWeight: 700, color: 'text.secondary' }}
          >
            {t("cancel") || "Cancel"}
          </Button>
          <Button 
            onClick={handleReset} 
            variant="contained" 
            color="error"
            sx={{ 
              fontWeight: 800, 
              borderRadius: 2, 
              px: 3,
              boxShadow: `0 8px 16px ${alpha(theme.palette.error.main, 0.2)}`
            }}
          >
            {t("confirm") || "Reset Now"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Settings;