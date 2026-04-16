import React, {
  Suspense,
  lazy,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";

import "./styles/main.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { motion, AnimatePresence } from "framer-motion";

/* =========================
   Lazy Loaded Pages
========================= */
const lazyPage = (importer, exportName) =>
  lazy(() =>
    importer().then((module) => {
      const component = module?.default ?? module?.[exportName];
      if (!component) {
        throw new Error(`Lazy page "${exportName}" has no default export.`);
      }
      return { default: component };
    })
  );

const Dashboard = lazyPage(() => import("./pages/Dashboard"), "Dashboard");
const Goals = lazyPage(() => import("./pages/Goals"), "Goals");
const NewGoal = lazyPage(() => import("./pages/NewGoal"), "NewGoal");
const GoalDetails = lazyPage(() => import("./pages/GoalDetails"), "GoalDetails");
const Categories = lazyPage(() => import("./pages/Categories"), "Categories");
const Settings = lazyPage(() => import("./pages/Settings"), "Settings");
const NotFound = lazyPage(() => import("./pages/NotFound"), "NotFound");

/* =========================
   Auth Context
========================= */
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const fakeUser = { id: 1, name: "John Doe" }; 
      setUser(fakeUser);
      setLoading(false);
    }, 800);
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  if (loading) {
    return (
      <div className="text-center p-2">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/* =========================
   Layout
========================= */
function Layout({ children }) {
  return (
    <div className="app-container">
      <Navbar />
      <main className="page-container">
        {children}
      </main>
      <Footer />
    </div>
  );
}

/* =========================
   Scroll Restoration
========================= */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
}

/* =========================
   Loading Component
========================= */
function PageLoader() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh' 
    }}>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ fontSize: '3rem' }}
      >
        🎯
      </motion.div>
    </div>
  );
}

/* =========================
   Animated Page Wrapper
========================= */
const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

/* =========================
   Error Boundary
========================= */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-2">
          <h2>Something went wrong.</h2>
        </div>
      );
    }
    return this.props.children;
  }
}

/* =========================
   Private Route
========================= */
function PrivateRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

/* =========================
   Routes
========================= */
function AppRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <Layout>
              <AnimatedPage><Dashboard /></AnimatedPage>
            </Layout>
          }
        />

        <Route
          path="/goals"
          element={
            <Layout>
              <AnimatedPage><Goals /></AnimatedPage>
            </Layout>
          }
        />

        <Route
          path="/goals/new"
          element={
            <Layout>
              <AnimatedPage><NewGoal /></AnimatedPage>
            </Layout>
          }
        />

        <Route
          path="/goals/edit/:id"
          element={
            <Layout>
              <AnimatedPage><NewGoal /></AnimatedPage>
            </Layout>
          }
        />

        <Route
          path="/goals/:id"
          element={
            <Layout>
              <AnimatedPage><GoalDetails /></AnimatedPage>
            </Layout>
          }
        />

        <Route
          path="/categories"
          element={
            <Layout>
              <AnimatedPage><Categories /></AnimatedPage>
            </Layout>
          }
        />

        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Layout>
                <AnimatedPage><Settings /></AnimatedPage>
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={<Navigate to="/" replace />}
        />

        <Route
          path="*"
          element={
            <Layout>
              <AnimatedPage><NotFound /></AnimatedPage>
            </Layout>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

/* =========================
   Main App
========================= */
function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <ScrollToTop />

        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <AppRoutes />
          </Suspense>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

/* =========================
   Utilities
========================= */

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

export async function fetchData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network error");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export const ROUTES = {
  HOME: "/",
  GOALS: "/goals",
  NEW_GOAL: "/goals/new",
  SETTINGS: "/settings",
};

export const theme = {
  colors: {
    primary: "#4CAF50",
    secondary: "#2196F3",
    danger: "#f44336",
  },
};
