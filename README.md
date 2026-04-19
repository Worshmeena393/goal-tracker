# 🎯 Goal Tracker — Professional Gamified Productivity Platform

A responsive, multi-page React application for managing goals, tracking progress, and visualizing productivity through a gamified dashboard.


---

##  Overview

This project is designed to meet all Week 6 assignment requirements while delivering a modern and professional user experience.

It combines:

* Goal management (CRUD)
* Real-time progress tracking
* Gamification (XP & streak system)
* Multilingual support (English / Persian)
* RTL ↔ LTR layout switching
* Persistent storage using LocalStorage

---

##  Assignment Compliance

### ✔ Required Tech

* React + Vite
* React Router DOM
* Two languages (EN / FA)
* RTL/LTR layout switching
* Responsive UI (desktop + mobile)
* LocalStorage persistence
* Material UI (MUI)

---

### ✔ Pages (Routes)

* `/` or `/dashboard` — Dashboard
* `/goals` — Goals list
* `/goals/new` — Create goal
* `/goals/:id` — Goal details
* `/categories` — Categories overview
* `/settings` — Settings
* `*` — Not Found (404)

---

##  Core Features

### 📊 Dashboard

* Overall completion percentage
* XP and level display
* Streak tracking
* Active goals preview
* Completed goals summary

---

### 🧩 Goal Management (CRUD)

* Create, edit, delete goals
* Pause / resume goals
* Automatic completion detection
* Support for:

  * Daily goals
  * Count-based goals
  * Time-based goals

---

### 📈 Progress Tracking

* Add progress entries (logs)
* Automatic calculation:

`progress % = (progress / target) × 100`

* Real-time UI updates

---

## 🎮 Gamification System

### XP Rules

* +20 XP for each progress log
* +100 XP when a goal is completed

### Level System

`Level = floor(XP / 100)`

---

## 📅 Streak System

* Logging progress on consecutive days increases streak
* Missing one day resets streak
* Only daily goals affect streak

---

## 🌍 Language & RTL/LTR

### Supported Languages

* English (LTR)
* Persian (RTL)

### Implementation

* Language stored in `LanguageContext`
* Layout direction controlled using:

```html
<div dir="ltr"> or <div dir="rtl">
```

* UI updates instantly when language changes

---

##  Architecture

```text
src/
├── components/
├── pages/
├── context/
├── hooks/
├── utils/
├── data/
├── styles/
```

---

##  Components

### Core UI

* Navbar
* Footer
* GoalCard
* CategoryCard
* StatsCard

### Progress & Feedback

* ProgressBar
* LoadingState
* EmptyState

### Advanced Features

* AdvancedChart
* AdvancedSearch

### Gamification

* LevelBadge
* NotificationToast

### Controls

* LanguageToggle

---

##  State Management (Context)

* GoalsContext — Goal CRUD & progress
* LanguageContext — Language + RTL/LTR
* NotificationContext — Alerts & messages
* SettingsContext — Theme & preferences

---

## Custom Hooks

* useLocalStorage — Sync data with browser storage
* useKeyboardShortcuts — Keyboard interactions

---

##  Data Model

```js
{
  id,
  title,
  category,
  type: "daily" | "count" | "time",
  target,
  progress,
  status,
  logs: [{ date, amount }]
}
```

---

## 🎨 Styling & Theming

### Core Styles

* index.css
* App.css

### Layout & Base

* base.css
* layout.css

### Components

* components.css

### Theme

* dark-theme.css

### Utilities

* responsive.css
* utility.css

### Accessibility & Animation

* accessibility.css
* animation.css

---

## ⭐ Bonus Features

* Fake authentication
* Charts (Recharts)
* Export goals (JSON)
* Accessibility (ARIA labels, keyboard navigation)

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

```bash
cd d:/goal-tracker/goal-tracker
npm install
npm run dev
```

Open:

```
http://localhost:5173
```

---

##  Project Status

* Build successful
* No critical lint errors
* All required features implemented and tested

## 🏁 Conclusion

This project provides a structured and user-friendly way to manage goals, track progress, and stay motivated through gamification and analytics.


## 📸 Screenshots are available for mobile , mobile, and tablet




---
