import { Link } from "react-router-dom";
import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { Container, Typography, Box, Button, Paper, Grid } from "@mui/material";
import { motion } from "framer-motion";
import {
  Dashboard as DashboardIcon,
  List as GoalsIcon,
  Settings as SettingsIcon,
  SentimentVeryDissatisfied as SadIcon,
} from "@mui/icons-material";

function NotFound() {
  const { t } = useContext(LanguageContext);

  return (
    <Container maxWidth="md" sx={{ py: 12 }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <SadIcon sx={{ fontSize: 100, color: "error.main", mb: 4, opacity: 0.8 }} />
        
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "6rem", md: "10rem" },
            fontWeight: 900,
            lineHeight: 1,
            mb: 2,
            background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </Typography>

        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
          {t("notFound")}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: 500 }}>
          {t("notFoundDesc")}
        </Typography>

        <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 600 }}>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              component={Link}
              to="/"
              variant="contained"
              startIcon={<DashboardIcon />}
              sx={{ borderRadius: 3, py: 1.5, fontWeight: 700 }}
            >
              {t("dashboard")}
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              component={Link}
              to="/goals"
              variant="outlined"
              startIcon={<GoalsIcon />}
              sx={{ borderRadius: 3, py: 1.5, fontWeight: 700 }}
            >
              {t("goals")}
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              component={Link}
              to="/settings"
              variant="outlined"
              color="inherit"
              startIcon={<SettingsIcon />}
              sx={{ borderRadius: 3, py: 1.5, fontWeight: 700, borderColor: "rgba(0,0,0,0.12)" }}
            >
              {t("settings")}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default NotFound;