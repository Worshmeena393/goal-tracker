# 🎯 Goal Tracker - Advanced Productivity Dashboard

A professional, modern, and highly interactive goal-tracking application built with **React 18**, **Vite**, and **Material UI (MUI)**. Designed to help users manage their personal and professional objectives with gamified progress tracking, visual analytics, and full internationalization support.

---

## ✅ Features Checklist

### 🚀 Core Functionalities
- [x] **Dashboard Overview:** Comprehensive summary of progress, streaks, and XP.
- [x] **CRUD Operations:** Create, Read, Update, and Delete goals with persistence.
- [x] **Persistence:** Local storage integration for data safety.
- [x] **Progress Tracking:** Automated percentage calculations and logs.
- [x] **Categories:** Organize goals into domains (Health, Work, Personal, etc.).
- [x] **Search & Filter:** Find goals by title, status, or category.
- [x] **Pagination:** Smooth navigation for large goal lists.

### 🎨 UI/UX & Design
- [x] **Clean & Modern UI:** Glassmorphic design with premium animations.
- [x] **Responsive Design:** Optimized for Mobile, Tablet, and Desktop.
- [x] **Progress Bars:** Visual representation of goal completion.
- [x] **Cards & Icons:** High-quality Material icons and styled components.
- [x] **Empty States:** Friendly feedback when no data is available.
- [x] **Loading States:** Simulated loading skeletons for a premium feel.

### 🎮 Gamification (Bonus)
- [x] **XP System:** Earn +20 XP for every progress log.
- [x] **Leveling:** Level up every 100 XP.
- [x] **Streak System:** Track consecutive days of activity.
- [x] **Confetti Celebrations:** Celebration on 100% goal completion.

### 🌍 Internationalization & Accessibility (Bonus)
- [x] **Multi-language:** Support for English and Persian (Farsi).
- [x] **RTL/LTR Support:** Full layout mirroring based on language.
- [x] **Accessibility Pass:** ARIA labels and keyboard navigation support.
- [x] **Dark/Light Mode:** Native theme toggling with persistence.

### 🛠️ Advanced Features (Bonus)
- [x] **Advanced Charts:** Interactive Bar and Pie charts using Recharts.
- [x] **Export Data:** Download your goals and stats as a JSON file.
- [x] **Notification UI:** Custom snackbar and sticker notifications.

---

## 🌍 Language & RTL/LTR Explanation

This application features a robust internationalization system using a custom **LanguageContext**.
- **Dynamic Layout:** When switching to Persian (FA), the entire UI direction flips to **RTL (Right-to-Left)**.
- **Stylis RTL:** We use `stylis-plugin-rtl` to automatically mirror CSS properties (like padding, margin, and absolute positions).
- **Font Switching:** The application can adapt fonts based on the selected language for better readability.

---

## 📝 Streak & XP Rules

### 🔥 Streak System
- **How it works:** Your streak increases by 1 for every consecutive day you log progress on any goal.
- **Reset Rule:** If you miss a day (no logs today or yesterday), your streak resets to 0. Consistency is key!

### ✨ XP & Leveling
- **Logging Progress:** Every time you log progress on an active goal, you earn **+20 XP**.
- **Level Up:** Your level is calculated as `Math.floor(xpTotal / 100) + 1`. You level up every 100 XP points!

---

## 📱 Responsive Support

The application is fully optimized for a seamless experience across all devices:
- **Desktop/Laptop:** Wide multi-column layouts with hover effects.
- **Tablet:** Adaptive grid systems (2-3 columns) and optimized spacing.
- **Mobile:** Mobile-first navigation with a bottom drawer, simplified controls, and full-width cards.

---

## 🏃 How to Run

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0.0 or higher)
- [npm](https://www.npmjs.com/) (v8.0.0 or higher)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/goal-tracker.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd goal-tracker/goal-tracker
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```
5. **Open in your browser:**
   Navigate to `http://localhost:5173`

---

## 📂 Project Structure

```text
src/
├── components/   # Reusable UI components (Navbar, Footer, Charts, Skeletons)
├── context/      # Global state (Goals, Language, Notifications, Settings)
├── data/         # Initial sample data and static constants
├── hooks/        # Custom hooks (useLocalStorage, useKeyboardShortcuts)
├── pages/        # Main route views (Dashboard, Goals, Categories, Settings)
├── styles/       # Modular CSS (layout, responsiveness, themes, animations)
└── App.jsx       # Root component and route configuration
```

---

## 📸 Screenshots

### 🖥️ Desktop View
![Desktop Dashboard](https://via.placeholder.com/800x450?text=Desktop+Dashboard)
![Desktop Goals](https://via.placeholder.com/800x450?text=Desktop+Goals+List)

### 📱 Mobile View
<p align="center">
  <img src="https://via.placeholder.com/300x600?text=Mobile+Dashboard" alt="Mobile Dashboard" width="300"/>
  <img src="https://via.placeholder.com/300x600?text=Mobile+Goals" alt="Mobile Goals" width="300"/>
</p>

---

Built for **Code to Inspire** with ❤️ by **[Your Name/Team]**
