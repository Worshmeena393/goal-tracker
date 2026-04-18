# 🎯 Goal Tracker — Week 6 Assignment

A responsive, multi-page React application for managing goals, tracking progress, and visualizing productivity through a gamified dashboard.

---

## 🚀 Overview

This project is designed to meet all Week 6 assignment requirements by providing a full-featured goal tracking system with:

* Multi-page navigation
* Real-time progress tracking
* Gamification (XP & streaks)
* RTL/LTR multilingual support
* Persistent storage using LocalStorage

---

## ✅ Assignment Compliance Checklist

### ✔ Required Tech Constraints

* React + Vite
* React Router (multi-page navigation)
* Two languages (English + Persian)
* RTL ↔ LTR layout switching
* Responsive UI (desktop + mobile)
* LocalStorage persistence
* UI Library: Material UI (MUI)

---

## 📄 Pages (Routes)

| Route               | Description                                 |
| ------------------- | ------------------------------------------- |
| `/` or `/dashboard` | Main dashboard with stats and active goals  |
| `/goals`            | All goals with filters, search, and sorting |
| `/goals/new`        | Create a new goal                           |
| `/goals/:id`        | Goal details and progress logs              |
| `/categories`       | Category analytics and summaries            |
| `/settings`         | Language and theme settings                 |
| `*`                 | 404 Not Found page                          |

---

## ⚙️ Core Functionalities

### 🧩 Goal Management (CRUD)

* Create, edit, delete goals
* Pause/resume goals
* Automatic completion detection

### 📊 Progress Tracking

* Log daily or custom progress

* Automatic percentage calculation:

  progress % = (progress / target) × 100

* Progress updates reflected instantly in UI

---

## 🔥 Gamification System

### XP Rules

* +20 XP for each progress log
* +100 XP when a goal is completed
* XP stored in `userStats.xpTotal`

### Level System

* Level is derived from XP:

  Level = floor(XP / 100)

---

## 📅 Streak System

### Rules:

* Streak increases if user logs progress on consecutive days
* If user logs today AND logged yesterday → streak +1
* If a day is missed → streak resets to 0
* Only **daily goals** affect streak

---

## 🌍 Language & RTL/LTR Support

### Languages:

* English (LTR)
* Persian (RTL)

### Implementation:

* Language stored in `LanguageContext`

* Layout direction applied using:

  ```html
  <div dir="ltr"> or <div dir="rtl">
  ```

* UI dynamically updates when language changes

* MUI theme adapts to RTL layout

---

## 🧠 Architecture Overview

```
src/
├── components/   # Reusable UI components
├── pages/        # Route pages
├── context/      # Global state management
├── utils/        # Helper functions
├── data/         # Static data (categories)
```

---

## 🔄 Data Flow

* Goals are managed via `GoalsContext`
* State updates trigger UI re-render
* Data is persisted to `localStorage`
* On reload → data is restored automatically

---

## 📦 Data Model (Example)

```js
{
  id: 1,
  title: "Workout",
  category: "Health",
  type: "daily",
  target: 30,
  progress: 10,
  status: "active",
  logs: [
    { date: "2026-04-10", amount: 1 }
  ]
}
```

---

## 🎨 UI Features

* Clean and modern design using MUI
* Fully responsive (desktop + mobile)
* Progress bars and cards
* Icons and action buttons
* Empty states (no goals, no data)
* Loading states for better UX

---

## ⭐ Bonus Features

* Fake authentication system
* Charts using Recharts
* Export goals as JSON
* Accessibility support (ARIA labels, keyboard navigation)

---

## 🛠️ Tech Stack

* React 18
* Vite
* React Router DOM
* Material UI (MUI)
* Framer Motion
* Recharts
* LocalStorage

---

## ▶️ How to Run

### Prerequisites

* Node.js 16+
* npm 8+

### Setup

```bash
cd d:/goal-tracker/goal-tracker
npm install
npm run dev
```

Open in browser:

```
http://localhost:5173
```

---

## 🧪 Project Status

* `npm run build` — successful
* `npm run lint` — no critical errors
* All required features implemented

---

## 📸 Screenshots...






