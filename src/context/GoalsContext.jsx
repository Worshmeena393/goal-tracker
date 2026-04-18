import { createContext, useState, useEffect, useContext } from "react";
import confetti from "canvas-confetti";
import { useNotification } from "./NotificationContext";
import { LanguageContext } from "./LanguageContext";
import { sampleGoals } from "../data/sampleGoals";

export const GoalsContext = createContext();

/* -------------------------------------------------------------------------- */
/* Utilities                                                                  */
/* -------------------------------------------------------------------------- */

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const normalizeGoal = (goal) => {
  let logs = Array.isArray(goal.logs) ? [...goal.logs] : [];
  
  // If we have a progress value but no logs, or if progress doesn't match logs
  // we add corrective logs for the difference
  const currentLogsProgress = logs.reduce((sum, log) => sum + (Number(log.amount) || 0), 0);
  const targetProgress = Number(goal.progress || 0);

  if (targetProgress > currentLogsProgress) {
    const diff = targetProgress - currentLogsProgress;
    
    // For Daily goals, spread initial progress over consecutive days to build a streak
    if (goal.type === "daily" && diff > 0) {
      const existingDates = new Set(logs.map(l => l.date));
      let added = 0;
      let dayOffset = 0;
      
      while (added < diff) {
        const d = new Date();
        d.setDate(d.getDate() - dayOffset);
        const dateStr = d.toLocaleDateString("en-CA");
        
        if (!existingDates.has(dateStr)) {
          logs.push({
            date: dateStr,
            amount: 1,
            isInitial: true
          });
          added++;
        }
        dayOffset++;
        // Safety break to prevent infinite loop
        if (dayOffset > 365) break;
      }
    } else {
      // For other types, just add one corrective log
      logs.push({
        date: new Date().toLocaleDateString("en-CA"),
        amount: diff,
        isInitial: true
      });
    }
  } else if (targetProgress < currentLogsProgress && targetProgress >= 0) {
    // If progress was manually reduced, add a negative corrective log
    logs.push({
      date: new Date().toLocaleDateString("en-CA"),
      amount: targetProgress - currentLogsProgress,
      isInitial: true
    });
  }

  logs = logs.map((log) => ({
    ...log,
    amount: Number(log.amount || 0),
    date: log.date || new Date().toLocaleDateString("en-CA"),
  }));

  const progress = logs.reduce((sum, log) => sum + (log.amount || 0), 0);
  const target = Math.max(1, Number(goal.target || 1));

  return {
    ...goal,
    id: goal.id || generateId(),
    title: goal.title || "Untitled Goal",
    category: goal.category || "General",
    type: goal.type || "count",
    status: goal.status || (progress >= target ? "completed" : "active"),
    createdAt: goal.createdAt || new Date().toISOString(),
    updatedAt: goal.updatedAt || new Date().toISOString(),
    startDate: goal.startDate || new Date().toLocaleDateString("en-CA"),
    endDate: goal.endDate || null,
    target,
    progress,
    logs,
  };
};

const calculateCompletionRate = (goals = []) => {
  if (goals.length === 0) return 0;
  const completed = goals.filter((g) => g.status === "completed").length;
  return Math.round((completed / goals.length) * 100);
};

const calculateTotalHours = (goals = []) => {
  return goals.reduce((total, goal) => {
    if (goal.type !== "time") return total;
    const progress = Number(goal.progress || 0);
    const unit = goal.timeUnit || "minutes";
    let hours = 0;
    if (unit === "seconds") hours = progress / 3600;
    else if (unit === "minutes") hours = progress / 60;
    else if (unit === "hours") hours = progress;
    return total + hours;
  }, 0);
};

const calculateStreak = (allGoals = []) => {
  const allLogs = allGoals.flatMap(g => g.logs || []);
  if (allLogs.length === 0) return 0;

  const uniqueDates = [...new Set(allLogs.map(l => l.date))].sort((a, b) => new Date(b) - new Date(a));
  
  const today = new Date().toLocaleDateString("en-CA");
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString("en-CA");

  const lastLogDate = uniqueDates[0];
  if (lastLogDate !== today && lastLogDate !== yesterday) return 0;

  let streak = 1;
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const curr = new Date(uniqueDates[i]);
    const next = new Date(uniqueDates[i + 1]);
    const diff = (curr - next) / (1000 * 60 * 60 * 24);
    if (diff >= 0.9 && diff <= 1.1) streak++; // Using a small range due to DST or local time diffs
    else break;
  }

  return streak;
};

/* -------------------------------------------------------------------------- */
/* Provider                                                                   */
/* -------------------------------------------------------------------------- */

export const GoalsProvider = ({ children }) => {
  const { showNotification } = useNotification();
  const { t } = useContext(LanguageContext);
  const [loading, setLoading] = useState(true);

  const [goals, setGoals] = useState([]);
  const [userStats, setUserStats] = useState({
    xpTotal: 0,
    streak: 0,
    completedCount: 0,
    level: 1,
  });

  /* -------------------------- Persistence --------------------------------- */

  useEffect(() => {
    // Simulated loading delay to satisfy UI requirements
    const timer = setTimeout(() => {
      try {
        const storedGoals = JSON.parse(localStorage.getItem("goals"));
        
        // If no stored goals, use our new sample goals
        if (!storedGoals || (Array.isArray(storedGoals) && storedGoals.length === 0)) {
          setGoals(sampleGoals.map(normalizeGoal));
        } else {
          setGoals(Array.isArray(storedGoals) ? storedGoals.map(normalizeGoal) : []);
        }

        const stats = JSON.parse(localStorage.getItem("userStats")) || {
          xpTotal: 0,
          streak: 0,
          completedCount: 0,
          level: 1,
        };
        setUserStats(stats);
      } catch (err) {
        console.error("Load failed:", err);
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem("goals", JSON.stringify(goals));
      } catch (err) {
        console.warn("Persistence failed:", err);
      }
    }
  }, [goals, loading]);

  // Separate effect to sync userStats with goals derived data
  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        setUserStats((prev) => {
          const currentStreak = calculateStreak(goals);
          const currentCompleted = goals.filter((g) => g.status === "completed").length;

          if (
            prev.streak === currentStreak &&
            prev.completedCount === currentCompleted
          ) {
            return prev;
          }

          return {
            ...prev,
            streak: currentStreak,
            completedCount: currentCompleted,
          };
        });
      }, 0);
    }
  }, [goals, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("userStats", JSON.stringify(userStats));
    }
  }, [userStats, loading]);

  /* ------------------------------------------------------------------------ */
  /* CRUD                                                                     */
  /* ------------------------------------------------------------------------ */

  const addGoal = (goal) => {
    const newGoal = normalizeGoal({
      ...goal,
      id: generateId(),
      status: goal.status || "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setGoals((prev) => [...prev, newGoal]);
  };

  const updateGoal = (id, updated) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? normalizeGoal({
              ...g,
              ...updated,
              id: g.id,
              createdAt: g.createdAt,
              updatedAt: new Date().toISOString(),
            })
          : g
      )
    );
  };

  const deleteGoal = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const toggleGoalStatus = (id) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        
        let newStatus = g.status;
        if (g.status === "paused" || g.status === "completed") {
          newStatus = "active";
        } else {
          newStatus = "paused";
        }
        
        return { ...g, status: newStatus };
      })
    );
  };

  /* ------------------------------------------------------------------------ */
  /* Progress + Gamification                                                  */
  /* ------------------------------------------------------------------------ */

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#4caf50", "#2196f3", "#ff9800"],
    });
  };

  const logProgress = (id, amount = 1) => {
    const numAmount = Number(amount) || 1;
    const today = new Date().toLocaleDateString("en-CA");
    
    let isGoalCompleted = false;
    let goalTitle = "";
    let logAdded = false;

    setGoals((prevGoals) => {
      const updatedGoals = prevGoals.map((goal) => {
        if (goal.id !== id || goal.status !== "active") return goal;
        
        // Removed strict daily limit to allow multiple logs if needed
        // but still tracking logs with dates for stats
        const logs = goal.logs || [];
        
        const currentProgress = goal.progress || 0;
        const newProgress = Math.min(currentProgress + numAmount, goal.target);
        const newLogs = [...logs, { date: today, amount: numAmount }];
        const isCompleted = newProgress >= goal.target;

        logAdded = true;
        if (isCompleted) {
          isGoalCompleted = true;
          goalTitle = goal.title;
        }

        return {
          ...goal,
          progress: newProgress,
          logs: newLogs,
          status: isCompleted ? "completed" : "active",
          updatedAt: new Date().toISOString(),
        };
      });

      // Handle side effects safely outside the render cycle
      if (isGoalCompleted) {
        setTimeout(() => {
          triggerConfetti();
          showNotification(`${t("goal")} "${goalTitle}" ${t("completed")}! 🎉`, "success");
        }, 0);
      } else if (logAdded) {
        // Only give XP and show notification if progress was actually logged
        setTimeout(() => {
          showNotification(t("progressLogged") || `Progress logged! +20 XP`, "success");
          setUserStats(prev => {
            const newXp = prev.xpTotal + 20;
            return {
              ...prev,
              xpTotal: newXp,
              level: Math.floor(newXp / 100) + 1,
            };
          });
        }, 0);
      }

      return updatedGoals;
    });
  };

  const renameCategory = (oldName, newName) => {
    setGoals((prev) =>
      prev.map((g) =>
        (g.category || "General") === oldName
          ? { ...g, category: newName, updatedAt: new Date().toISOString() }
          : g
      )
    );
    showNotification(`Renamed category "${oldName}" to "${newName}"`, "success");
  };

  const exportGoals = () => {
    const data = JSON.stringify({ goals, userStats }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `goal-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  /* ------------------------------------------------------------------------ */
  /* Provider Value                                                           */
  /* ------------------------------------------------------------------------ */

  return (
    <GoalsContext.Provider
      value={{
        goals,
        userStats,
        loading,
        completionRate: calculateCompletionRate(goals),
        totalHours: calculateTotalHours(goals),
        addGoal,
        updateGoal,
        deleteGoal,
        toggleGoalStatus,
        logProgress,
        renameCategory,
        exportGoals,
        triggerConfetti,
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
};