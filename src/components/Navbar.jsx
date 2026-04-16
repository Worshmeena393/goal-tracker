import { useState, useContext, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Drawer, List, ListItem, ListItemText, ListItemIcon, useMediaQuery, useTheme, Container, Avatar, Divider, Tooltip, alpha, Chip } from "@mui/material";
import { Menu as MenuIcon, Dashboard as DashboardIcon, List as ListIcon, AddCircle as AddIcon, Category as CategoryIcon, Settings as SettingsIcon, EmojiEvents as TrophyIcon, Notifications as NotificationIcon } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import { GoalsContext } from "../context/GoalsContext";
import { useNotification } from "../context/NotificationContext";
import NotificationSticker from "./NotificationSticker";
import { motion, AnimatePresence } from "framer-motion";

const NavButton = ({ item, isActive }) => {
  const theme = useTheme();
  return (
    <Box sx={{ position: "relative" }}>
      <Button
        component={Link}
        to={item.path}
        startIcon={item.icon}
        sx={{
          borderRadius: 2,
          px: 1.5,
          py: 0.6,
          color: isActive ? "primary.main" : "text.secondary",
          fontWeight: 700,
          textTransform: "none",
          fontSize: "0.85rem",
          transition: "all 0.2s",
          "&:hover": {
            color: "primary.main",
            bgcolor: alpha(theme.palette.primary.main, 0.06),
          },
          '& .MuiButton-startIcon': { mr: 0.75, '& > *:nth-of-type(1)': { fontSize: 18 } }
        }}
      >
        {item.text}
      </Button>
      
      {isActive && (
        <motion.div
          layoutId="nav-underline"
          style={{
            position: "absolute",
            bottom: -2,
            left: '20%',
            right: '20%',
            height: 3,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 3,
            zIndex: 1,
          }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Box>
  );
};

function Navbar() {
  const { t, direction } = useContext(LanguageContext);
  const { userStats } = useContext(GoalsContext);
  const { notification } = useNotification();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { text: t("dashboard"), icon: <DashboardIcon />, path: "/" },
    { text: t("goals"), icon: <ListIcon />, path: "/goals" },
    { text: t("newGoal"), icon: <AddIcon />, path: "/goals/new" },
    { text: t("categories"), icon: <CategoryIcon />, path: "/categories" },
    { text: t("settings"), icon: <SettingsIcon />, path: "/settings" },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ textAlign: "center", p: 2, height: "100%", display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle1" sx={{ my: 2, fontWeight: 900, color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '1rem' }}>🎯</Avatar>
        {t("goals").toUpperCase()}
      </Typography>
      <Divider sx={{ mb: 2, opacity: 0.5 }} />
      <List sx={{ flexGrow: 1, py: 0 }}>
        {menuItems.map((item, index) => (
          <motion.div
            key={item.text}
            initial={{ x: direction === 'rtl' ? 50 : -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <ListItem 
              component={Link} 
              to={item.path} 
              onClick={handleDrawerToggle}
              sx={{ 
                borderRadius: 2, 
                mb: 0.5, 
                bgcolor: location.pathname === item.path ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                py: 0.75
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontWeight: 700, fontSize: '0.85rem' }} 
              />
            </ListItem>
          </motion.div>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: scrolled ? alpha(theme.palette.background.paper, 0.8) : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          borderBottom: scrolled ? '1px solid' : 'none',
          borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
          color: 'text.primary',
          transition: 'all 0.3s ease',
          top: 0,
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", py: 0.5, px: { xs: 1, sm: 2 }, minHeight: { xs: 56, sm: 64 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 0.5, bgcolor: alpha(theme.palette.primary.main, 0.05) }}
                >
                  <MenuIcon fontSize="small" />
                </IconButton>
              )}
              
              <Box 
                component={Link} 
                to="/" 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 1, 
                  textDecoration: "none", 
                  color: "inherit" 
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.main', 
                    width: 32, 
                    height: 32, 
                    boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
                    fontSize: '1rem'
                  }}
                  role="img"
                  aria-label="Logo"
                >
                  🎯
                </Avatar>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 900,
                    letterSpacing: "-0.02em",
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    display: { xs: "none", sm: "block" },
                    fontSize: '1.1rem'
                  }}
                >
                  GOALTRACKER
                </Typography>
              </Box>
            </Box>

            {!isMobile && (
              <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                {menuItems.map((item) => (
                  <NavButton
                    key={item.text}
                    item={item}
                    isActive={location.pathname === item.path}
                  />
                ))}
              </Box>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Tooltip title={t("xp")}>
                <Chip
                  icon={<TrophyIcon sx={{ fontSize: '14px !important', color: '#ff9800 !important' }} />}
                  label={`${userStats?.xpTotal || 0} XP`}
                  size="small"
                  sx={{ 
                    fontWeight: 800, 
                    bgcolor: alpha('#ff9800', 0.1), 
                    color: '#e65100', 
                    borderRadius: 1.5,
                    border: '1px solid',
                    borderColor: alpha('#ff9800', 0.2),
                    height: 24,
                    '& .MuiChip-label': { px: 1, fontSize: '0.7rem' }
                  }}
                />
              </Tooltip>
              
              <Divider orientation="vertical" flexItem sx={{ height: 20, my: 'auto', mx: 0.5, opacity: 0.5 }} />
              
              <AnimatePresence mode="wait">
                {notification?.open ? (
                  <NotificationSticker 
                    key="navbar-notif"
                    message={notification.message} 
                    severity={notification.severity} 
                    direction={direction} 
                  />
                ) : (
                  <IconButton 
                    key="navbar-icon"
                    component={motion.button}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    size="small" 
                    sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), p: 0.5 }}
                  >
                    <NotificationIcon fontSize="small" />
                  </IconButton>
                )}
              </AnimatePresence>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor={direction === 'rtl' ? 'right' : 'left'}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: 240,
            bgcolor: theme.palette.background.default,
            backgroundImage: 'none',
          }
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default Navbar;