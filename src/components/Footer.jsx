import { Box, Container, Typography, Link, Divider, useTheme, alpha } from "@mui/material";

import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

function Footer() {
  const { t } = useContext(LanguageContext);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3, 
        bgcolor: isDark ? alpha(theme.palette.background.paper, 0.5) : alpha(theme.palette.background.default, 0.8), 
        mt: 'auto', 
        borderTop: '1px solid', 
        borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 3 }}>
          <Box sx={{ maxWidth: 300 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.6, display: 'block', mb: 2, fontSize: '0.85rem' }}>
              {t("footerDesc")}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, mb: 1, color: 'text.primary', display: 'block', textTransform: 'uppercase' }}>
              {t("quickLinks")}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Link href="/" color="inherit" underline="none" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' }, transition: '0.2s', fontSize: '0.75rem' }}>{t("dashboard")}</Link>
              <Link href="/goals" color="inherit" underline="none" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' }, transition: '0.2s', fontSize: '0.75rem' }}>{t("goals")}</Link>
              <Link href="/categories" color="inherit" underline="none" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' }, transition: '0.2s', fontSize: '0.75rem' }}>{t("categories")}</Link>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2, opacity: 0.5 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {t("allRights").replace("{{year}}", new Date().getFullYear())}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;