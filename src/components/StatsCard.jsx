import React, { useContext, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import ProgressBar from "./ProgressBar";
import { LanguageContext } from "../context/LanguageContext";
import { SettingsContext } from "../context/SettingsContext";

/* -------------------------------------------------------------------------- */
/* Utilities                                                                  */
/* -------------------------------------------------------------------------- */

const formatNumber = (num = 0, lang = "en") =>
  new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US").format(num);

const formatDate = (iso, lang = "en") => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString(lang === "fa" ? "fa-IR" : "en-US");
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

function StateCard({ title, value, icon, progress, color, updatedAt }) {
  const langCtx = useContext(LanguageContext) || {};
  const settingsCtx = useContext(SettingsContext) || {};

  const t = langCtx.t || ((key) => key);
  const lang = langCtx.lang || "en";
  const theme = settingsCtx.theme || "light";

  const isDark = theme === "dark";

  const [animatedValue, setAnimatedValue] = useState(Number(value) || 0);
  const rafRef = useRef(null);

  /* ------------------------ Animate Value --------------------------------- */

  useEffect(() => {
    const target = Number(value) || 0;

    const animate = () => {
      setAnimatedValue((prev) => {
        if (prev === target) return prev;

        const diff = target - prev;
        const step = diff * 0.1;

        const next =
          Math.abs(diff) < 0.5 ? target : prev + step;

        return next;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  /* ------------------------------ Styles ---------------------------------- */

  const styles = {
    card: {
      background: isDark ? "#1e1e1e" : "#fff",
      color: isDark ? "#fff" : "#000",
      borderRadius: "12px",
      boxShadow: isDark
        ? "0 2px 8px rgba(0,0,0,0.5)"
        : "0 2px 8px rgba(0,0,0,0.1)",
      padding: "1rem",
      flex: "1 1 200px",
      minWidth: "180px",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    value: {
      fontSize: "1.6rem",
      fontWeight: "bold",
      color: color || (isDark ? "#4caf50" : "#333"),
    },
    updated: {
      fontSize: "0.75rem",
      color: "#888",
    },
  };

  /* -------------------------------------------------------------------------- */

  return (
    <div
      className="state-card"
      role="region"
      aria-label={t(title)}
      style={styles.card}
    >
      {/* Header */}
      <div style={styles.header}>
        {icon && (
          <span aria-hidden="true" style={{ fontSize: "1.5rem" }}>
            {icon}
          </span>
        )}

        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>
          {t(title)}
        </h3>
      </div>

      {/* Value */}
      <div
        aria-live="polite"
        style={styles.value}
        title={`Value: ${formatNumber(animatedValue, lang)}`}
      >
        {formatNumber(Math.round(animatedValue), lang)}
      </div>

      {/* Progress */}
      {progress !== undefined && (
        <div>
          <ProgressBar value={progress} size="small" color={color} />
        </div>
      )}

      {/* Updated */}
      {updatedAt && (
        <small style={styles.updated}>
          {t("lastUpdated")}: {formatDate(updatedAt, lang)}
        </small>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PropTypes                                                                  */
/* -------------------------------------------------------------------------- */

StateCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon: PropTypes.node,
  progress: PropTypes.number,
  color: PropTypes.string,
  updatedAt: PropTypes.string,
};

export default StateCard;