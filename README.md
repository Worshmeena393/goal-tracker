# ?? Goal Tracker — Week 6 Assignment

A responsive React + Vite app for tracking goals, progress, and category performance with multilingual RTL support.

---

## ?? Overview

This project meets the Week 6 assignment requirements with:

* Multi-page navigation using React Router
* Goal creation, update, delete, pause, and resume
* Progress tracking and completion calculation
* English + Persian language support with RTL/LTR layout
* LocalStorage persistence for saved goals
* Clean, responsive UI built with Material UI (MUI)

---

## ?? Pages

| Route               | Description                                 |
| ------------------- | ------------------------------------------- |
| `/` or `/dashboard` | Dashboard with active goals and stats       |
| `/goals`            | Goal library with search, filters, and delete |
| `/goals/new`        | Create a new goal or edit an existing one   |
| `/goals/:id`        | Goal details, logs, and delete confirmation |
| `/categories`       | Compact category analytics and progress summary |
| `/settings`         | Theme and language settings                 |
| `*`                 | 404 Not Found page                          |

---

## ? Features

* Create, edit, and delete goals
* Pause and resume active goals
* Log progress with automatic percentage updates
* Compact category summary card for Total Goals and Avg. Progress
* Responsive layout for desktop and mobile
* Notifications for goal actions and category updates

---

## ?? Implementation

* `GoalsContext` manages all goals and persistence
* `LanguageContext` handles English and Persian translations
* `Categories` page now shows a short, compact summary card
* `GoalCard` actions are optimized for mobile and desktop

---

## ??? Tech Stack

* React 18
* Vite
* React Router DOM
* Material UI (MUI)
* Framer Motion
* Recharts
* LocalStorage

---

## ?? Run the App

### Prerequisites

* Node.js 16+
* npm 8+

### Commands

```bash
cd d:/goal-tracker/goal-tracker
npm install
npm run dev
```

Open the app at:

```bash
http://localhost:5173
```

---

## ?? Status

* `npm run build` — passes
* `npm run lint` — no critical errors
* Category summary is compact and short
* Goal delete buttons are stable and visible
