

// components/ThemeProvider.tsx
"use client";

import { createContext, useState, useEffect, ReactNode, useContext } from "react";

type ThemeContextType = {
  darkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(true); // default to dark



  // Read from localStorage only once (on mount)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("theme");
    if (stored === "light") {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);


  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
