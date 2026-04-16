import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { GoalsProvider } from "./context/GoalsContext";
import { SettingsProvider } from "./context/SettingsContext";
import { LanguageProvider } from "./context/LanguageContext";
import { NotificationProvider } from "./context/NotificationContext";

import "./styles/main.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <LanguageProvider>
    <SettingsProvider>
      <NotificationProvider>
        <GoalsProvider>
          <App />
        </GoalsProvider>
      </NotificationProvider>
    </SettingsProvider>
  </LanguageProvider>
);