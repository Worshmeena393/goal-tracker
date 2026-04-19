import { useEffect, useState, useRef } from "react";

/* -------------------------------------------------------------------------- */
/* Utilities                                                                  */
/* -------------------------------------------------------------------------- */

const clamp = (val = 0) => Math.min(100, Math.max(0, val));

const getGradient = (value) => {
  if (value < 33) return "linear-gradient(to right, #ff4d4d, #ff9999)";
  if (value < 66) return "linear-gradient(to right, #ffcc00, #ffff66)";
  return "linear-gradient(to right, #4caf50, #8bc34a)";
};

const getLabel = (value) => `${value}% complete`;

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

function ProgressBar({
  value = 0,
  showLabel = true,
  size = "medium",
  color = null,
  animated = true,
  labelPosition = "below",
}) {
  // Progress updates instantly, no animation
  const displayValue = clamp(value);

  /* ----------------------------- Styles ---------------------------------- */

  const height =
    size === "small" ? "8px" : size === "large" ? "20px" : "12px";

  const fillStyle = {
    width: `${displayValue}%`,
    height,
    background: color || getGradient(displayValue),
    borderRadius: "inherit",
    transition: "none",
  };

  /* -------------------------------------------------------------------------- */

  const label = getLabel(Math.round(displayValue));

  return (
    <div className="progress-wrapper" style={{ width: "100%" }}>
      {/* Label ABOVE */}
      {showLabel && labelPosition === "above" && (
        <div style={styles.label}>{label}</div>
      )}

      {/* Bar */}
      <div
        className="progress-bar"
        role="progressbar"
        aria-valuenow={Math.round(displayValue)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={label}
        title={label}
        style={styles.container}
      >
        <div className="progress-fill" style={fillStyle}></div>
      </div>

      {/* Label BELOW */}
      {showLabel && labelPosition === "below" && (
        <div style={styles.label}>{label}</div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */

const styles = {
  container: {
    width: "100%",
    background: "#eee",
    borderRadius: "5px",
    overflow: "hidden",
  },
  label: {
    textAlign: "center",
    fontSize: "0.8rem",
    margin: "0.25rem 0",
  },
};

export default ProgressBar;