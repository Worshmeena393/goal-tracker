import { useState, useEffect } from "react";

export default function useLocalStorage(key, initialValue) {
  /* ------------------------ Safe Initial Load ------------------------ */

  const getStoredValue = () => {
    if (typeof window === "undefined") return initialValue;

    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.warn("useLocalStorage load error:", err);
      return initialValue;
    }
  };

  const [value, setValue] = useState(getStoredValue);

  /* ------------------------ Save to localStorage --------------------- */

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn("useLocalStorage save error:", err);
    }
  }, [key, value]);

  /* ------------------------ Sync across tabs ------------------------- */

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === key) {
        try {
          setValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
        } catch {
          setValue(initialValue);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key, initialValue]);

  /* ------------------------ Functional setter ------------------------ */

  const updateValue = (newValue) => {
    setValue((prev) =>
      typeof newValue === "function" ? newValue(prev) : newValue
    );
  };

  /* ------------------------------------------------------------------ */

  return [value, updateValue];
}