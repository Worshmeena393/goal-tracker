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
/* Main Dataset (~6 goals)                                                    */
/* -------------------------------------------------------------------------- */

const generateDatedLogs = (count, startDate = new Date()) => {
  const logs = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() - i);
    logs.push({
      date: d.toLocaleDateString("en-CA"),
      amount: 1,
    });
  }
  return logs.reverse();
};

export const sampleGoals = [
  {
    id: "1",
    title: "Morning Workout",
    category: "Health",
    type: "daily",
    target: 30,
    progress: 12,
    status: "active",
    logs: generateDatedLogs(12),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    startDate: new Date().toLocaleDateString("en-CA"),
    notes: "Daily morning exercise routine",
  },
  {
    id: "2",
    title: "Study React",
    category: "Study",
    type: "time",
    target: 600,
    progress: 250,
    status: "active",
    logs: [{ date: new Date().toLocaleDateString("en-CA"), amount: 250 }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    startDate: new Date().toLocaleDateString("en-CA"),
    notes: "Mastering React and modern UI development",
  },
  {
    id: "3",
    title: "Read Books",
    category: "Personal",
    type: "count",
    target: 5,
    progress: 2,
    status: "active",
    logs: generateDatedLogs(2),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    startDate: new Date().toLocaleDateString("en-CA"),
    notes: "Read at least 5 books this month",
  },
  {
    id: "4",
    title: "Build Portfolio Website",
    category: "Work",
    type: "count",
    target: 1,
    progress: 1,
    status: "completed",
    logs: [{ date: new Date().toLocaleDateString("en-CA"), amount: 1 }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    startDate: new Date().toLocaleDateString("en-CA"),
    notes: "Personal professional portfolio project",
  },
  {
    id: "5",
    title: "Learn Python",
    category: "Study",
    type: "time",
    target: 300,
    progress: 100,
    status: "paused",
    logs: [{ date: new Date().toLocaleDateString("en-CA"), amount: 100 }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    startDate: new Date().toLocaleDateString("en-CA"),
    notes: "Basic Python for data science",
  },
  {
    id: "6",
    title: "Drink Water",
    category: "Health",
    type: "daily",
    target: 30,
    progress: 5,
    status: "active",
    logs: generateDatedLogs(5),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    startDate: new Date().toLocaleDateString("en-CA"),
    notes: "Stay hydrated throughout the day",
  },
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