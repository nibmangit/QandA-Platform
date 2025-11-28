import { Moon, Sun } from "lucide-react";
import { createContext, useContext, useState, useEffect } from "react";

// 1. Create the Context
const ThemeContext = createContext({
  theme: "light", // Default value
  toggleTheme: () => {}, // Default function
});

// 3. Create the Provider Component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  const toggleTheme = () => {
    // 💡 Note: Use the current state to determine the new state
    setTheme((currentTheme) => {
      const newTheme = currentTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  // 4. Use useEffect to apply the 'dark' class to the root element (document.documentElement)
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // 5. Provide the state and function to children components
  const value = {
    theme,
    toggleTheme,
    MoonIcon: Moon, // Optional: Export icons for convenience
    SunIcon: Sun,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
