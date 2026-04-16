import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

/* -------------------------------------------------------------------------- */
/* Utilities                                                                  */
/* -------------------------------------------------------------------------- */

const getButtonLabel = (lang) =>
  lang === "en" ? "Switch to فارسی" : "Switch to English";

const getTooltip = (lang) =>
  lang === "en"
    ? "Click to switch interface to Persian"
    : "Click to switch interface to English";

const getDirectionPreview = (lang) =>
  lang === "en"
    ? "Sample English text (LTR)"
    : "نمونه متن فارسی (RTL)";

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

function LanguageToggle() {
  const context = useContext(LanguageContext) || {};

  const lang = context.lang || "en";
  const toggleLang = context.toggleLang || (() => {});
  const direction = context.direction || (lang === "fa" ? "rtl" : "ltr");

  return (
    <div
      className="language-toggle"
      style={styles.container}
      dir={direction}
    >
      {/* Toggle button */}
      <button
        onClick={toggleLang}
        role="switch"
        aria-checked={lang === "fa"}
        aria-label={`Toggle language. Current language is ${lang}`}
        title={getTooltip(lang)}
        style={styles.button}
      >
        {getButtonLabel(lang)}
      </button>

      {/* Current language */}
      <small aria-live="polite">
        Current language: {lang} ({direction})
      </small>

      {/* Direction preview */}
      <div style={{ ...styles.preview, textAlign: direction === "rtl" ? "right" : "left" }}>
        {getDirectionPreview(lang)}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
    transition: "transform 0.3s ease",
  },
  button: {
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    border: "none",
    background: "#2196f3",
    color: "#fff",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  preview: {
    border: "1px dashed #ccc",
    padding: "0.5rem",
    width: "100%",
  },
};

export default LanguageToggle;