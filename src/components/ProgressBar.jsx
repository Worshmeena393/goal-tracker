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
  const [displayValue, setDisplayValue] = useState(clamp(value));
  const rafRef = useRef(null);

  /* --------------------------- Animate value ------------------------------ */

  useEffect(() => {
    const target = clamp(value);

    if (!animated) {
      setTimeout(() => setDisplayValue(target), 0);
      return;
    }

    const animate = () => {
      setDisplayValue((prev) => {
        if (prev === target) return prev;

        const diff = target - prev;
        const step = diff * 0.1; // smooth easing
        const next =
          Math.abs(diff) < 0.5 ? target : prev + step;

        return clamp(next);
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [value, animated]);

  /* ----------------------------- Styles ---------------------------------- */

  const height =
    size === "small" ? "8px" : size === "large" ? "20px" : "12px";

  const fillStyle = {
    width: `${displayValue}%`,
    height,
    background: color || getGradient(displayValue),
    borderRadius: "inherit",
    transition: animated ? "width 0.3s ease" : "none",
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