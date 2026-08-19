import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export const themes = {
  dark: { label: "Dark+ (par défaut)", swatch: "#1e1e1e", group: "Sombre" },
  light: { label: "Light+", swatch: "#f3f3f3", group: "Clair" },
  monokai: { label: "Monokai", swatch: "#272822", group: "Sombre" },
  github: { label: "GitHub Light", swatch: "#f6f8fa", group: "Clair" },
  solarized: { label: "Solarized Dark", swatch: "#002b36", group: "Sombre" },
  highContrast: { label: "High Contrast", swatch: "#000000", group: "Accessibilité" },
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("kevinn_portfolio_theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === "light" ? "light" : "dark";
    localStorage.setItem("kevinn_portfolio_theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}