import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

import "./App.css";
import CreateUser from "./components/Create-User";
import LoginUser from "./components/Login-User";
import JobForm from "./components/JobForm";
import Feedback from "./components/FeedbackGallery";
import { Button } from "./components/ui/button";

type Theme = "light" | "dark";

const THEME_KEY = "keycv-theme";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = window.localStorage.getItem(THEME_KEY);
    return stored === "light" || stored === "dark" ? stored : "dark";
  } catch {
    return "dark";
  }
}

function App() {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme());

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Ignore persistence errors (e.g. storage disabled)
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <div className="app-shell">
      <nav className="app-nav">
        <div className="app-nav__brand">
          <Link to="/">KeyCV</Link>
        </div>
        <div className="app-nav__center"> We highlight what matters</div>
        <div className="app-nav__actions">
          <Link to="/create-user">Join to us</Link>
          <span className="app-nav__divider" aria-hidden="true">
            |
          </span>
          <Link to="/login-user">Sign In</Link>
          <Button
            aria-label="Toggle theme"
            variant="ghost"
            size="icon"
            className="theme-toggle"
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <Sun aria-hidden="true" />
            ) : (
              <Moon aria-hidden="true" />
            )}
            <span className="sr-only">
              Switch to {theme === "dark" ? "light" : "dark"} theme
            </span>
          </Button>
        </div>
      </nav>
      <main className="app-main">
        <Link to="/feedback">Feedback</Link>
        <Routes>
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/login-user" element={<LoginUser />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/" element={<JobForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
