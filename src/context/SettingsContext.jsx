import { createContext, useState, useEffect, useMemo, useContext } from "react";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import { LanguageContext } from "./LanguageContext";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

export const SettingsContext = createContext();

/* -------------------------------------------------------------------------- */
/* RTL Cache setup                                                            */
/* -------------------------------------------------------------------------- */

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const cacheLtr = createCache({
  key: "mui",
});

/* -------------------------------------------------------------------------- */
/* Storage Helpers                                                            */
/* -------------------------------------------------------------------------- */

const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn("Settings save failed:", err);
  }
};

/* -------------------------------------------------------------------------- */
/* Style Apply Functions                                                      */
/* -------------------------------------------------------------------------- */

const applyAllStyles = ({
  theme,
  fontSize,
  highContrast,
  reducedMotion,
  underlineLinks,
}) => {
  const root = document.documentElement;

  /* ---------- Theme ---------- */
  if (highContrast) {
    root.style.setProperty("--bg-color", "#000");
    root.style.setProperty("--text-color", "#FFD700");
  } else {
    if (theme === "light") {
      root.style.setProperty("--bg-color", "#f9f9f9");
      root.style.setProperty("--text-color", "#000");
    } else if (theme === "dark") {
      root.style.setProperty("--bg-color", "#121212");
      root.style.setProperty("--text-color", "#fff");
    } else {
      root.style.setProperty("--bg-color", "#fdf6e3");
      root.style.setProperty("--text-color", "#657b83");
    }
  }

  /* ---------- Font Size ---------- */
  const fontMap = {
    small: "14px",
    medium: "16px",
    large: "18px",
  };
  root.style.setProperty("--font-size", fontMap[fontSize]);

  /* ---------- Motion ---------- */
  root.classList.toggle("reduced-motion", reducedMotion);

  /* ---------- Links ---------- */
  root.style.setProperty(
    "--link-decoration",
    underlineLinks ? "underline" : "none"
  );
};

/* -------------------------------------------------------------------------- */
/* Provider                                                                   */
/* -------------------------------------------------------------------------- */

export const SettingsProvider = ({ children }) => {
  const { direction } = useContext(LanguageContext);

  const [settings, setSettings] = useState(() => ({
    theme: load("theme", "light"),
    fontSize: load("fontSize", "medium"),
    highContrast: load("hc", false),
    reducedMotion: load("rm", false),
    underlineLinks: load("ul", false),
  }));

  const { theme, fontSize, highContrast, reducedMotion, underlineLinks } =
    settings;

  const muiTheme = useMemo(
    () =>
      createTheme({
        direction: direction,
        palette: {
          mode: theme === "solarized" ? "light" : theme,
          primary: {
            main: "#6366f1", // Indigo 500
            light: "#818cf8",
            dark: "#4f46e5",
          },
          secondary: {
            main: "#f43f5e", // Rose 500
            light: "#fb7185",
            dark: "#e11d48",
          },
          success: {
            main: "#10b981", // Emerald 500
            light: "#34d399",
            dark: "#059669",
          },
          background: {
            default: theme === "dark" ? "#0b0f1a" : "#f8fafc", // Deeper dark / Slate 50
            paper: theme === "dark" ? "#151b2b" : "#ffffff", // Deeper paper / White
          },
          text: {
            primary: theme === "dark" ? "#f1f5f9" : "#0f172a",
            secondary: theme === "dark" ? "#94a3b8" : "#64748b",
          },
          divider: theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
        },
        shape: {
          borderRadius: 12,
        },
        typography: {
          fontSize: fontSize === "small" ? 14 : fontSize === "large" ? 18 : 16,
          fontFamily: direction === "rtl" ? "'Vazirmatn', sans-serif" : "'Plus Jakarta Sans', 'Inter', sans-serif",
          h1: { fontWeight: 800, letterSpacing: '-0.025em' },
          h2: { fontWeight: 800, letterSpacing: '-0.025em' },
          h3: { fontWeight: 700, letterSpacing: '-0.02em' },
          h4: { fontWeight: 700, letterSpacing: '-0.01em' },
          h5: { fontWeight: 700 },
          h6: { fontWeight: 700 },
          button: { fontWeight: 700, letterSpacing: '0.02em' },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 10,
                padding: '10px 24px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  transform: 'translateY(-1px)',
                },
              },
              containedPrimary: {
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                '&:hover': {
                  boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: theme === 'dark' 
                  ? '0 10px 30px rgba(0,0,0,0.4)' 
                  : '0 10px 30px rgba(0,0,0,0.04)',
                border: theme === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                backgroundColor: theme === 'dark' 
                  ? '#151b2b' 
                  : '#ffffff',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme === 'dark'
                    ? '0 20px 40px rgba(0,0,0,0.6)'
                    : '0 20px 40px rgba(0,0,0,0.08)',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                borderRadius: 16,
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 12,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: alpha('#6366f1', 0.02),
                  },
                },
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                fontWeight: 800,
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: alpha('#6366f1', 0.1),
                  transform: 'scale(1.05)',
                },
              },
            },
          },
        },
      }),
    [theme, fontSize, direction]
  );

  /* -------------------------- Apply + Save -------------------------------- */

  useEffect(() => {
    applyAllStyles(settings);

    save("theme", theme);
    save("fontSize", fontSize);
    save("hc", highContrast);
    save("rm", reducedMotion);
    save("ul", underlineLinks);
  }, [settings, theme, fontSize, highContrast, reducedMotion, underlineLinks]);

  /* ------------------------------------------------------------------------ */
  /* Actions                                                                  */
  /* ------------------------------------------------------------------------ */

  const toggleTheme = () => {
    const list = ["light", "dark"];
    setSettings((prev) => ({
      ...prev,
      theme: list[(list.indexOf(prev.theme) + 1) % list.length],
    }));
  };

  /* ... rest of the actions ... */

  return (
    <CacheProvider value={direction === "rtl" ? cacheRtl : cacheLtr}>
      <ThemeProvider theme={muiTheme}>
        <SettingsContext.Provider
          value={{
            ...settings,
            muiTheme,
            toggleTheme,
            increaseFontSize: () => setSettings(p => ({ 
              ...p, 
              fontSize: p.fontSize === 'small' ? 'medium' : p.fontSize === 'medium' ? 'large' : 'small' 
            })),
            decreaseFontSize: () => setSettings(p => ({ 
              ...p, 
              fontSize: p.fontSize === 'large' ? 'medium' : p.fontSize === 'medium' ? 'small' : 'large' 
            })),
            toggleHighContrast: () => setSettings(p => ({ ...p, highContrast: !p.highContrast })),
            toggleReducedMotion: () => setSettings(p => ({ ...p, reducedMotion: !p.reducedMotion })),
            toggleUnderlineLinks: () => setSettings(p => ({ ...p, underlineLinks: !p.underlineLinks })),
            resetSettings: () => setSettings({ theme: "light", fontSize: "medium", highContrast: false, reducedMotion: false, underlineLinks: false }),
          }}
        >
          {children}
        </SettingsContext.Provider>
      </ThemeProvider>
    </CacheProvider>
  );
};