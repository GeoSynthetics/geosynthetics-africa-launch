import { createContext, useContext, useEffect, useState, useMemo } from "react";

export type AdminTheme = "light" | "dark";

interface AdminThemeContextType {
  theme: AdminTheme;
  setTheme: (theme: AdminTheme) => void;
  toggleTheme: () => void;
}

const LOCAL_STORAGE_KEY = "gsa-admin-theme";

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AdminTheme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored === "light" || stored === "dark") {
        return stored;
      }
    }
    return "dark"; // Default to dark mode for admin control panel
  });

  // Apply .dark class to root element while inside admin routes
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, theme);
    } catch (e) {
      console.warn("Failed to save admin theme to localStorage", e);
    }

    // Cleanup: remove dark mode override when leaving admin layout
    return () => {
      root.classList.remove("dark");
    };
  }, [theme]);

  const setTheme = (newTheme: AdminTheme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme],
  );

  return <AdminThemeContext.Provider value={value}>{children}</AdminThemeContext.Provider>;
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error("useAdminTheme must be used within an AdminThemeProvider");
  }
  return context;
}
