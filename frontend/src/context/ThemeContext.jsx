import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Default to light mode — professional light theme
  const [theme, setTheme] = useState(() => localStorage.getItem('sc_theme') || 'light');

  useEffect(() => {
    const root = document.documentElement;
    // We no longer use dark mode classes — force light always
    root.classList.remove('dark');
    localStorage.setItem('sc_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: false }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export default ThemeContext;
