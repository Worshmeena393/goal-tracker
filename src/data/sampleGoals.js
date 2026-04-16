/**
 * sampleGoals.js
 * --------------
 * Large dataset + utilities for testing
 */

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const generateId = () =>
  crypto?.randomUUID?.() || Date.now() + Math.random();

const randomFrom = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/* -------------------------------------------------------------------------- */
/* Base Categories                                                            */
/* -------------------------------------------------------------------------- */

const categories = ["Health", "Study", "Work", "Finance", "Hobby"];
const types = ["daily", "count", "time", "habit"];
const statuses = ["active", "completed", "paused"];

/* -------------------------------------------------------------------------- */
/* Generate Sample Goals                                                      */
/* -------------------------------------------------------------------------- */

const createGoal = (overrides = {}) => {
  const target = randomInt(5, 50);
  const progress = randomInt(0, target);

  return {
    id: generateId(),
    title: overrides.title || "Sample Goal",
    category: overrides.category || randomFrom(categories),
    type: overrides.type || randomFrom(types),
    target,
    progress,
    status:
      progress >= target
        ? "completed"
        : overrides.status || randomFrom(statuses),
    logs: generateLogs(progress),
    createdAt:
      overrides.createdAt || new Date().toISOString(),
  };
};

const generateLogs = (progress) => {
  const logs = [];
  for (let i = 0; i < progress; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    logs.push({
      date: d.toISOString().split("T")[0],
      amount: 1,
    });
  }
  return logs.reverse();
};

/* -------------------------------------------------------------------------- */
/* Main Dataset (~50+ goals)                                                  */
/* -------------------------------------------------------------------------- */

export const sampleGoals = [
  createGoal({ title: "Workout", category: "Health" }),
  createGoal({ title: "Read Book", category: "Study" }),
  createGoal({ title: "Meditation", category: "Mindfulness" }),
  createGoal({ title: "Budget Tracking", category: "Finance" }),

  // Auto-generate more
  ...Array.from({ length: 50 }, () => createGoal()),
];

/* -------------------------------------------------------------------------- */
/* Utilities                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * filterByCategory
 */
export const filterByCategory = (category, goals = sampleGoals) =>
  goals.filter((g) => g.category === category);

/**
 * filterByStatus
 */
export const filterByStatus = (status, goals = sampleGoals) =>
  goals.filter((g) => g.status === status);

/**
 * calculateCompletionRate
 */
export const calculateCompletionRate = (goals = sampleGoals) => {
  if (!goals.length) return 0;
  const completed = goals.filter((g) => g.status === "completed").length;
  return Math.round((completed / goals.length) * 100);
};

/**
 * groupByCategory
 */
export const groupByCategory = (goals = sampleGoals) => {
  return goals.reduce((acc, goal) => {
    acc[goal.category] = (acc[goal.category] || 0) + 1;
    return acc;
  }, {});
};

/**
 * generateRandomGoal
 */
export const generateRandomGoal = () =>
  createGoal({ title: "Random Goal" });

/**
 * getRecentGoals
 */
export const getRecentGoals = (goals = sampleGoals, limit = 5) =>
  [...goals]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);